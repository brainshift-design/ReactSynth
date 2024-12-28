export const Tau = Math.PI * 2;



export type ProxyArray<T> = T[] & { [key: string]: T };



export function createId(nChars = 6)
{
    let id = '';

    for (let i = 0; i < nChars; i++)
        id += 97 + Math.floor(Math.random() * 26);

    return id;
}



export function removeFromArray(array: any[], item: any)
{
    const index = array.indexOf(item);
    
    if (index > -1)
        array.splice(index, 1);

    return item;
}



export function removeFromArrayWhere<T>(array: T[], where: (item: T) => boolean)
{
    const index = array.findIndex(where);
    const item  = array[index];
    
    if (index > -1)
        array.splice(index, 1);

    return item;
}
