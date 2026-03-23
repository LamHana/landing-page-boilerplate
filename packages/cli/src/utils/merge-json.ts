// Deep merge b into a. Arrays are concatenated and deduplicated.
export function mergeJson(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...a };
  for (const key of Object.keys(b)) {
    const aVal = a[key];
    const bVal = b[key];
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      result[key] = [...new Set([...aVal, ...bVal])];
    } else if (
      typeof aVal === "object" && aVal !== null && !Array.isArray(aVal) &&
      typeof bVal === "object" && bVal !== null && !Array.isArray(bVal)
    ) {
      result[key] = mergeJson(aVal as Record<string, unknown>, bVal as Record<string, unknown>);
    } else {
      result[key] = bVal;
    }
  }
  return result;
}
