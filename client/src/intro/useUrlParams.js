/**
 * useUrlParams — reads ?to= from the URL and returns a formatted recipient name.
 * Maps known company slugs to their HR/recruiting team labels.
 * Falls back to the raw value, or 'Future Collaborator' if no param.
 */

const COMPANY_LABELS = new Map([
  ['google', 'Google Hiring Team'],
  ['microsoft', 'Microsoft Recruiting'],
  ['amazon', 'Amazon Hiring Team'],
  ['meta', 'Meta Recruiting'],
  ['apple', 'Apple Hiring Team'],
  ['netflix', 'Netflix Hiring Team'],
  ['openai', 'OpenAI Team'],
  ['stripe', 'Stripe Team'],
  ['vercel', 'Vercel Team'],
  ['linear', 'Linear Team'],
  ['notion', 'Notion Team'],
  ['figma', 'Figma Team'],
  ['airbnb', 'Airbnb Recruiting'],
  ['uber', 'Uber Hiring Team'],
  ['spotify', 'Spotify Recruiting'],
  ['twitter', 'X (Twitter) Team'],
  ['x', 'X (Twitter) Team'],
  ['adobe', 'Adobe Recruiting'],
  ['salesforce', 'Salesforce Recruiting'],
]);

/**
 * Returns the recipient name to display on the envelope.
 * Called once at module level — no re-parsing on re-render.
 */
export function getRecipientName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to');

  if (!raw || !raw.trim()) return 'Future Collaborator';

  const key = raw.trim().toLowerCase();
  return COMPANY_LABELS.get(key) ?? raw.trim();
}
