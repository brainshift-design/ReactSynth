import { Tau } from "../util";
import { nodeTypes } from "./nodeTypes";



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



export function getTypeName(NodeType: Function): string
{
    return Object.entries(nodeTypes)
        .find(([_, NodeClass]) => NodeClass.prototype instanceof NodeType)?.[0] as string;
}
