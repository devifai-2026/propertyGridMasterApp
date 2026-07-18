// Single source of truth for the PreLease Grid brand logo.
//
// Two variants:
//   logoDark  — dark wordmark ("prelease grid" in black). Use on LIGHT backgrounds.
//   logoWhite — white wordmark. Use on DARK backgrounds (e.g. the footer #1E1E1E).
//
// Both files must live next to this module:
//   src/assets/logo/prelease-grid-dark.png
//   src/assets/logo/prelease-grid-white.png
//
// Prefer importing `logoDark` / `logoWhite` from here rather than requiring the
// PNGs directly, so a future logo swap is a one-file change.

export const logoDark = require('./prelease-grid-dark.png');
export const logoWhite = require('./prelease-grid-white.png');

export default logoDark;
