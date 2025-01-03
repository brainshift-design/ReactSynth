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



export function createReverbImpulseResponse(
    duration: number, // "room size"
    decay:    number,
    metallic: number  = 0,
    reverse:  boolean = false
): AudioBuffer 
{
    const sampleRate  = audioContext?.sampleRate;
    const length      = Math.floor(sampleRate! * duration);

    const impulse     = audioContext?.createBuffer(1, Math.max(1, length), sampleRate!);
    const channelData = impulse?.getChannelData(0);

    const metallicModFreq = 2000;


    for (let i = 0; i < length; i++) 
    {
        // optionally use the reversed index to fade in instead of out
        const idx = reverse ? length - i : i;

        // base white noise is used to affect all possible frequencies,
        // with exponential decay
        const base = (Math.random()*2 - 1) * (1 - idx/length)**decay;

        // optionally modulate amplitude with a sine wave,
        // which gives a subtle ringing effect
        const mod = 1 + metallic * Math.sin((2 * Math.PI * metallicModFreq * i) / sampleRate!);

        channelData![i] = base * mod;
    }

    
    return impulse!;
}