export function isAlphabetical(code : string) {
    const regex = /^[A-Za-z]+$/;
    return regex.test(code);
}
