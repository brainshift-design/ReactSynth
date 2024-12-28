import { audioNodes, createAudioContext } from "../audio/audio";
import Node from "./Node";



export default abstract class AudioBaseNode extends Node
{
    audioNode: AudioNode | null;



    constructor(id: string, type: string)
    {
        super(id, type);

        this.audioNode = null;

        createAudioContext();
    }



    setAudioNode(audioNode: AudioNode)
    {
        this.audioNode = audioNode;

        if (this.audioNode)
            audioNodes.set(this.id, audioNode);
    }
}