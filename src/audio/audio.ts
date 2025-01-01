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