// Generates and persists a random device ID in localStorage so anonymous
// visitors can have a usage limit without needing to log in. This is not a
// security boundary (a user could clear localStorage to reset it) — it's a
// friendliness limit, not a payment-fraud guard. Good enough for "free tools
// with a soft cap for now."

const DEVICE_ID_KEY = 'aihub_device_id';

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
