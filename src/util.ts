export const Tau = Math.PI * 2;



export function roundTo(val: number, dec: number)
{
    const div = Math.round(Math.pow(10, dec));
    return Math.round((val + Number.EPSILON) * div) / div;    
}



export function createId(nChars = 6)
{
    let id = '';

    for (let i = 0; i < nChars; i++)
        id += 97 + Math.floor(Math.random() * 26);

    return id;
}