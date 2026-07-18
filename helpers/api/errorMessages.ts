// Central place to turn backend error codes / raw messages into friendly,
// human-readable text shown to users. Two layers:
//   1. KNOWN_ERROR_MESSAGES — explicit, well-worded copy for codes we know.
//   2. humanizeCode()       — fallback that converts any leftover
//      SCREAMING_SNAKE_CASE code (e.g. REQUEST_ALREADY_EXISTS) into a sentence,
//      so a raw code never leaks to the UI.

const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  REQUEST_ALREADY_EXISTS: 'A request with these details already exists.',
  USER_ALREADY_EXISTS: 'An account with this number already exists. Please sign in.',
  USER_NOT_FOUND: "We couldn't find an account with these details.",
  INVALID_CREDENTIALS: 'The details you entered are incorrect. Please try again.',
  INVALID_OTP: 'The verification code is incorrect. Please try again.',
  OTP_EXPIRED: 'Your verification code has expired. Please request a new one.',
  OTP_NOT_FOUND: 'No verification code found. Please request a new one.',
  TOO_MANY_REQUESTS: 'Too many attempts. Please wait a moment and try again.',
  RATE_LIMIT_EXCEEDED: 'Too many attempts. Please wait a moment and try again.',
  UNAUTHORIZED: 'Please sign in to continue.',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
  ACCESS_TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: "You don't have permission to do that.",
  NOT_FOUND: "We couldn't find what you were looking for.",
  VALIDATION_ERROR: 'Some details are missing or invalid. Please check and try again.',
  MISSING_REQUIRED_FIELD: 'Please fill in all required fields.',
  INVALID_PHONE_NUMBER: 'Please enter a valid 10-digit mobile number.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  EMAIL_ALREADY_EXISTS: 'This email is already registered.',
  PHONE_ALREADY_EXISTS: 'This mobile number is already registered.',
  PROPERTY_NOT_FOUND: "This property could not be found.",
  DUPLICATE_ENTRY: 'This record already exists.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again shortly.',
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Please try again shortly.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable. Please try again shortly.',
};

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

// Looks like a raw code: ALL_CAPS with underscores, no spaces (e.g. REQUEST_ALREADY_EXISTS).
const looksLikeCode = (s: string): boolean =>
  /^[A-Z0-9]+(?:_[A-Z0-9]+)+$/.test(s.trim());

// REQUEST_ALREADY_EXISTS -> "Request already exists."
const humanizeCode = (code: string): string => {
  const words = code
    .trim()
    .toLowerCase()
    .split('_')
    .filter(Boolean);
  if (!words.length) return DEFAULT_MESSAGE;
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
};

/**
 * Normalize any error input (Axios error, string, code, or {message}) into a
 * friendly, user-facing message. Never returns a raw SCREAMING_SNAKE code.
 */
export const getFriendlyError = (input: any, fallback: string = DEFAULT_MESSAGE): string => {
  // Pull the most specific string we can find from common error shapes.
  let raw: string | undefined;
  if (typeof input === 'string') {
    raw = input;
  } else if (input) {
    raw =
      input?.response?.data?.code ||
      input?.response?.data?.error ||
      input?.response?.data?.message ||
      input?.data?.code ||
      input?.data?.message ||
      input?.code ||
      input?.message;
  }

  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  // 1. Exact known code (case-insensitive on the key).
  const upper = trimmed.toUpperCase();
  if (KNOWN_ERROR_MESSAGES[upper]) return KNOWN_ERROR_MESSAGES[upper];

  // 2. If it's a raw code we don't know, humanize it instead of showing it raw.
  if (looksLikeCode(trimmed)) {
    return KNOWN_ERROR_MESSAGES[upper] || humanizeCode(trimmed);
  }

  // 3. Otherwise it's already a human sentence from the server — show as-is.
  return trimmed;
};

export default getFriendlyError;
