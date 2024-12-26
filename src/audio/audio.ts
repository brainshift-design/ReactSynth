let audioContext: AudioContext | null = null;

const nodes = new Map<string, AudioNode>();



export function createAudioNode(type: string, id: string, data: { [key: string]: any })
{
    if (!audioContext)
        audioContext = new AudioContext();


    switch (type)
    {
        case 'oscillator':
        {
            const node = audioContext.createOscillator();

            node.frequency.value = data.frequency;
            node.type            = data.type;

            node.start();

            nodes.set(id, node);
            break;
        }

        case 'gain':
        {
            const node = audioContext.createGain();
            
            node.gain.value = data.gain;

            nodes.set(id, node);
            break;
        }    

        case '_output':
        {
            const node = audioContext.destination;

            nodes.set(id, node);
            break;
        }
    }
}



export function updateAudioNode(id: string, data: { [key: string]: any })
{
    const node = nodes.get(id);
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
    const node = nodes.get(id)!;

    node.disconnect();

    if (   'stop' in node 
        && typeof node.stop == 'function')
        node.stop();

    nodes.delete(id);
}



export function connectAudioNodes(sourceId: string, targetId: string)
{
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    if (!source || !target) return;

    source.connect(target);
}



export function disconnectAudioNodes(sourceId: string, targetId: string)
{
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    if (!source || !target) return;

    source.disconnect(target);
}



export function audioIsRunning()
{
    return audioContext?.state == 'running';
}



export function toggleAudio()
{
    return audioIsRunning() 
        ? audioContext?.suspend() 
        : audioContext?.resume();
}