export const capitalize = (string: string) => {
    if (!string.length) return string;
    let firstCode = string.charCodeAt(0);
    if (firstCode >= 97 && firstCode <= 122) {
        firstCode -= 32;
    }
    return String.fromCharCode(firstCode) + string.substring(1);
};
