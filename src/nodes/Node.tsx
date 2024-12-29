import { Component } from "react";
import { ClassContext, ClassContextProps } from "./ClassContext";
import { audioNodes, createAudioContext } from "../audio/audio";
import styles from './Node.module.css';
import { Node as ReactFlowNode } from "reactflow";
import { createId } from "../util";
import { getTypeName } from "./util";


export interface NodeProps 
{
    id:       string;
    selected: boolean;
    data:     any;
}



export default abstract class Node<T extends NodeProps = NodeProps> 
extends Component<T>
{
    static  contextType = ClassContext;
    declare context: ClassContextProps;

    protected audioNode: AudioNode | null = null;

    protected abstract createAudioNode(): AudioNode | null;
    protected abstract initAudioNode(): void;

    protected abstract renderContent(): JSX.Element;



    static createReactFlowNode(): ReactFlowNode 
    {
        return {
            id:       createId(),
            type:     getTypeName(this),
            data:     {},
            position: { x: 0, y: 0 }
        };
    }
    
    

    componentDidMount()
    {
        const { id } = this.props;

        createAudioContext();
        this.audioNode = this.createAudioNode();

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



    render()
    {
        const { selected } = this.props;
        
        return (
            <div 
                className = {styles.node}
                style     = {{ outline: selected ? 'var(--node-outline-style)' : 'none' }}
                >

                { this.renderContent() }

            </div>
        );
    }
}