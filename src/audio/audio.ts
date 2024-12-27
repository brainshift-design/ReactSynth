export let audioContext: AudioContext | null = null;

export const audioNodes = new Map<string, AudioNode>();



export function createAudioContext()
{
    if (!audioContext)
    {
        audioContext = new AudioContext();
        audioContext?.suspend();
    }
}



export function createAudioNode(type: string, id: string, data: { [key: string]: any })
{
    switch (type)
    {
        case 'oscillator':
        {
            const node = audioContext?.createOscillator()!;

            node.frequency.value = data.frequency;
            node.type            = data.type;

            node.start();

            audioNodes.set(id, node);
            break;
        }

        case 'gain':
        {
            const node = audioContext?.createGain()!;
            
            node.gain.value = data.gain;

            audioNodes.set(id, node);
            break;
        }    

        case '_output':
        {
            const node = audioContext?.destination!;

            audioNodes.set(id, node);
            break;
        }
    }
}



export function updateAudioNode(id: string, data: { [key: string]: any })
{
    const node = getAudioNode(id);
    if (!node) return;


    for (const [key, value] of Object.entries(data))
    {
        const audioParam = (node as any)[key] as AudioParam;

        if (audioParam instanceof AudioParam)
            audioParam.value = value;
        else
            (node as any)[key] = value;
    }
}



export function removeAudioNode(id: string)
{
    const node = getAudioNode(id)!;

    node.disconnect();

    if (   'stop' in node 
        && typeof node.stop == 'function')
        node.stop();

    audioNodes.delete(id);
}



export function connectAudioNodes(sourceId: string, targetId: string)
{
    const source = getAudioNode(sourceId);
    const target = getAudioNode(targetId);

    if (!source || !target) return;

    source.connect(target);
}



export function disconnectAudioNodes(sourceId: string, targetId: string)
{
    const source = getAudioNode(sourceId);
    const target = getAudioNode(targetId);

    if (!source || !target) return;

    source.disconnect(target);
}



export function audioIsRunning()
{
    return audioContext?.state == 'running';
}



export function getAudioNode(id: string)
{
    if (id == '_output')
        return audioContext?.destination;
    else
        return audioNodes.get(id);
}