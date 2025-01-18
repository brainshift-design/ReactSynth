import { Tau } from '../util';

export interface ReverbNodeWorkerMessage {
    requestId: number;
    bufferLength: number;
    sampleRate: number;
    duration: number;
    decay: number;
    metallic: number;
    reverse: boolean;
}

export interface ReverbNodeWorkerResponse {
    requestId: number;
    channelData: Float32Array;
}

self.onmessage = function (event: MessageEvent<ReverbNodeWorkerMessage>) {
    const { requestId, bufferLength, sampleRate, duration, decay, metallic, reverse } = event.data;

    const channelData = new Float32Array(bufferLength);

    const length = Math.max(1, Math.floor(sampleRate * duration));

    for (let i = 0; i < length; i++) {
        // optionally reverse the index to fade in instead of out
        const idx = reverse ? length - i : i;

        // base white noise is used to affect all possible frequencies,
        // with exponential decay
        const base = (Math.random() * 2 - 1) * (1 - idx / length) ** Math.max(1, decay ** 2);

        // optionally modulate amplitude with a sine wave,
        // which gives a subtle ringing effect
        const metallicModFreq = 2000;
        const mod = 1 + metallic * Math.sin((Tau * metallicModFreq * i) / sampleRate);

        channelData[i] = base * mod;
    }

    for (let i = length; i < bufferLength; i++) channelData[i] = 0;

    self.postMessage({ requestId, channelData } as ReverbNodeWorkerResponse);
};
