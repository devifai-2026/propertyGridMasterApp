/**
 * Formats an absolute rupee amount into a readable Indian-format string.
 *
 * The DB stores prices in absolute rupees (e.g. 37500000), so the value must
 * never be concatenated directly with a "Cr" suffix. This helper converts the
 * absolute amount into the appropriate Crore (Cr) / Lakh (L) / rupee display.
 *
 * Examples:
 *   formatINR(37500000) => "₹3.75 Cr"
 *   formatINR(5000000)  => "₹50 L"
 *   formatINR(45000)    => "₹45,000"
 *   formatINR(null)     => "N/A"
 */
export const formatINR = (
  amount: number | string | null | undefined,
): string => {
  if (amount === null || amount === undefined || amount === '') return 'N/A';

  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!isFinite(value as number) || isNaN(value as number)) return 'N/A';

  const abs = Math.abs(value as number);

  // 1 Crore = 10,000,000 ; 1 Lakh = 100,000
  if (abs >= 10000000) {
    const cr = (value as number) / 10000000;
    // Drop trailing ".00" but keep meaningful decimals.
    return `₹${trim(cr)} Cr`;
  }
  if (abs >= 100000) {
    const lakh = (value as number) / 100000;
    return `₹${trim(lakh)} L`;
  }

  return `₹${(value as number).toLocaleString('en-IN')}`;
};

const trim = (n: number): string => {
  // Round to 2 decimals, then strip trailing zeros / dot.
  return parseFloat(n.toFixed(2)).toString();
};
