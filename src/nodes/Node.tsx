import { Component, Context, ContextType } from "react";
import { NodeContext } from "./NodeContext";
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



export default abstract class Node<
    T extends NodeProps    = NodeProps, 
    C extends Context<any> = typeof NodeContext> 
    extends Component<T>
{
    static  contextType?: Context<any>;
    declare context:      ContextType<C>;

    protected audioNode: AudioNode | null = null;

    protected abstract createAudioNode(): AudioNode | null;
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
            audioNodes.set(id, this.audioNode);
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