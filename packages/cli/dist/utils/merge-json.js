// Deep merge b into a. Arrays are concatenated and deduplicated.
export function mergeJson(a, b) {
    const result = { ...a };
    for (const key of Object.keys(b)) {
        const aVal = a[key];
        const bVal = b[key];
        if (Array.isArray(aVal) && Array.isArray(bVal)) {
            result[key] = [...new Set([...aVal, ...bVal])];
        }
        else if (typeof aVal === "object" && aVal !== null && !Array.isArray(aVal) &&
            typeof bVal === "object" && bVal !== null && !Array.isArray(bVal)) {
            result[key] = mergeJson(aVal, bVal);
        }
        else {
            result[key] = bVal;
        }
    }
    return result;
}
