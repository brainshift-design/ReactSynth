import { Tau } from "../util";

export function createDistortionCurve(amount: number) 
{
    const k        = amount;

    const nSamples = 44100;
    const curve    = new Float32Array(nSamples);
    const deg      = Tau/360;
  
    for (let i = 0; i < nSamples; i++) 
    {
        const x = (i*2) / nSamples - 1;
        curve[i] = ((3+k) * 20*x*deg) / (Tau/2 + k * Math.abs(x));
    }

    return curve;
}



export function toCapitalCase(str: string)
{
    let capitalCase = '';

    if (str.length > 0)
        capitalCase += str[0].toUpperCase();

    if (str.length > 1)
        capitalCase += str.substring(1).toLowerCase();

    return capitalCase;
}