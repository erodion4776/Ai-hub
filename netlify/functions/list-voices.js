// netlify/functions/list-voices.js
//
// Fetches Cartesia's available voices so the frontend can show a picker.
// Runs server-side because it needs CARTESIA_API_KEY.
// Written as an ES Module (export, not exports.handler) because the root
// package.json has "type": "module" — CommonJS syntax here throws
// "module is not defined in ES module scope".

export const handler = async () => {
  try {
    const res = await fetch('https://api.cartesia.ai/voices?language=en&limit=20', {
      headers: {
        'X-API-Key': process.env.CARTESIA_API_KEY,
        'Cartesia-Version': '2025-04-16',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Cartesia list-voices error:', res.status, errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not load voices.' }) };
    }

    const json = await res.json();
    const voices = (json.data || []).map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      gender: v.gender,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify({ voices }),
    };
  } catch (err) {
    console.error('list-voices error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error.' }) };
  }
};
