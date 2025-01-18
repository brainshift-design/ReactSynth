export const Tau = Math.PI * 2;
export const NbSp = '\u00A0';

export function roundTo(val: number, dec: number) {
    const step = Math.round(Math.pow(10, dec));
    return Math.round((val + Number.EPSILON) * step) / step;
}

export function nozero(val: number, epsilon = 0.0000001) {
    return val == 0 ? epsilon : val;
}

export function createId(nChars = 6) {
    let id = '';

    for (let i = 0; i < nChars; i++) id += 97 + Math.floor(Math.random() * 26);

    return id;
}
