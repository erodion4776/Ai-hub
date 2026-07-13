// netlify/functions/generate-speech.js
//
// Proxies text-to-speech requests to Cartesia. This MUST run server-side because
// CARTESIA_API_KEY is a paid credential — it can never be shipped to the browser.
// Also enforces a daily per-device limit using the tool_usage table, checked with
// the Supabase service_role key (bypasses RLS, safe to use server-side only).
//
// Written as an ES module (import/export) because this project's package.json
// has "type": "module", which makes Node treat all .js files as ESM — a
// CommonJS require()/exports.handler version will crash before it even runs.

import { createClient } from '@supabase/supabase-js';

const DAILY_LIMIT = 5; // adjust as you see fit

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text, deviceId } = JSON.parse(event.body || '{}');

    if (!text || !text.trim()) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Text is required.' }) };
    }
    if (!deviceId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing device ID.' }) };
    }
    if (text.length > 500) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Text is too long (max 500 characters).' }) };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // server-only key, set in Netlify env vars
    );

    const today = new Date().toISOString().slice(0, 10);

    const { data: existing, error: fetchError } = await supabase
      .from('tool_usage')
      .select('count')
      .eq('device_id', deviceId)
      .eq('tool_name', 'text_to_speech')
      .eq('usage_date', today)
      .maybeSingle();

    if (fetchError) {
      console.error('tool_usage fetch error:', fetchError);
    }

    const currentCount = existing?.count ?? 0;
    if (currentCount >= DAILY_LIMIT) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          error: `Daily limit reached (${DAILY_LIMIT} per day). Try again tomorrow.`,
        }),
      };
    }

    // Call Cartesia
    const cartesiaRes = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.CARTESIA_API_KEY,
        'Cartesia-Version': '2025-04-16',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-2',
        transcript: text,
        voice: {
          mode: 'id',
          // Default Cartesia demo voice. Swap for a voice ID from your own
          // Cartesia dashboard/voice library if you want a specific voice.
          id: 'a0e99841-438c-4a64-b679-ae501e7d6091',
        },
        output_format: {
          container: 'mp3',
          sample_rate: 44100,
          bit_rate: 128000,
        },
      }),
    });

    if (!cartesiaRes.ok) {
      const errText = await cartesiaRes.text();
      console.error('Cartesia API error:', cartesiaRes.status, errText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Speech generation failed. Please try again shortly.' }),
      };
    }

    const audioBuffer = await cartesiaRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    // Increment usage count only after a successful generation
    await supabase.from('tool_usage').upsert({
      device_id: deviceId,
      tool_name: 'text_to_speech',
      usage_date: today,
      count: currentCount + 1,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: audioBase64,
        remaining: DAILY_LIMIT - (currentCount + 1),
      }),
    };
  } catch (err) {
    console.error('generate-speech error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error.' }) };
  }
}
