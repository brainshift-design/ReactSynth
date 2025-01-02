import { Tau } from "../util";
import { nodeTypes } from ".";
import OscillatorNode from "./OscillatorNode";
import { audioContext } from "../audio/audio";



export const freqCurvePower = 4.5; // picked to make 440 be at the top



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



export function getTypeName(Class: Function): string
{
    const found = Object.entries(nodeTypes)
        .find(([_, cls]) => cls == Class);

    return found?.[0] as string;
}



export function getValueCurve(val: number, min: number, max: number, power: number, prep: (v: number) => number = (_v: number) => _v)
{
    return min + prep(((val-min)/(max-min)) ** power) * (max-min);
}



export function invValueCurve(freq: number)
{
    return getValueCurve(freq, OscillatorNode.minFreq, OscillatorNode.maxFreq, 1/freqCurvePower);    
}



export function createImpulse(amount: number): AudioBuffer
{
    const durationSeconds = 1;

    const sampleRate      = audioContext?.sampleRate;
    const length          = durationSeconds * sampleRate!;
 
    const impulseBuffer   = audioContext?.createBuffer(1, length, sampleRate!);

    const channelData     = impulseBuffer?.getChannelData(0);


    const len = amount/100 * sampleRate!;

    for (let i = 0; i < len; i++)
        channelData![i] = Math.max(0, 1 - i/(len-1));


    return impulseBuffer!;
}