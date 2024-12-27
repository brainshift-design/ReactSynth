export const Tau = Math.PI * 2;



export function createId(nChars = 6)
{
    let id = '';

    for (let i = 0; i < nChars; i++)
        id += 97 + Math.floor(Math.random() * 26);

    return id;
}