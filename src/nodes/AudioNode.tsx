import { audioNodes, createAudioContext } from "../audio/audio";
import Node, { NodeProps } from "./Node";



export default abstract class AudioNode<T extends NodeProps = NodeProps> 
extends Node<T>
{
    protected audioNode: globalThis.AudioNode | null = null;

    protected abstract createAudioNode(): globalThis.AudioNode | null;
    protected initAudioNode() {}


    componentDidMount()
    {
        createAudioContext();

        this.audioNode = this.createAudioNode();

        if (!this.audioNode)
            throw new Error('Failed to create audio node');


        const { id } = this.props;

        if (this.audioNode)
        {
            this.initAudioNode();
            audioNodes.set(id, this.audioNode);
        }
    }



    componentWillUnmount()
    {
        if (!this.audioNode)
            throw new Error('Attempting to unmount a node without a valid audio node');

        const { id } = this.props;
        
        if (  'stop' in this.audioNode 
            && typeof (this.audioNode as any).stop === 'function')
            (this.audioNode as any).stop();
        
        this.audioNode.disconnect();

        audioNodes.delete(id);
    }
}