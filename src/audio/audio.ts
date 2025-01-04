import NumberParameter from "../parameters/NumberParameter";

export let audioContext: AudioContext | null = null;

export const audioNodes         = new Map<string, AudioNode>();
export const controlConnections = new Map<string, (value: number) => void>();



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



export function connectControl(source: NumberParameter, target: NumberParameter)
{
    if (!source || !target) return;

    target.connectInput(source);

    controlConnections.set(target.name, (value) => target.setValue(value));
}



export function disconnectControl(target: NumberParameter)
{
    controlConnections.delete(target.name);
}



export function updateControlParameters(time: number)
{
    controlConnections.forEach(update => update(time));
}



export function updateAutomation(time: number)
{
    controlConnections.forEach(update => update(time));
    requestAnimationFrame(updateAutomation);
}