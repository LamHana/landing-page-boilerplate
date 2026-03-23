// Replace all __TOKEN__ occurrences in a string with their values
export function replaceTokens(content, tokens) {
    let result = content;
    for (const [token, value] of Object.entries(tokens)) {
        result = result.replaceAll(token, value);
    }
    return result;
}
