import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { Component, ContextType } from 'react';
import { createId } from '../util';
import { NodeContext } from './NodeContext';

import styles from './Node.module.css';



interface GainNodeProps 
{
    id:   string;
    data: { gain: number },
    selected: boolean
}

interface GainNodeState {}



export default class GainNode extends Component<GainNodeProps, GainNodeState>
{
    static contextType = NodeContext;
    declare context: ContextType<typeof NodeContext>;



    static createReactFlowNode()
    {
        const node: Node =
        {
            id:       createId(),
            type:     'gain',
            data:     { gain: 1 },
            position: { x: 0, y: 0 }
        };
       
        return node;
    }
    
    
    
    componentDidMount() 
    {
        const { id, data: { gain } } = this.props;

        createAudioContext();
        const audioNode = audioContext?.createGain();

        if (audioNode)
        {
            audioNode.gain.value = gain;
            audioNodes.set(id, audioNode);
        }
    }



    componentWillUnmount()
    {
        const { id } = this.props;

        const audioNode = audioNodes.get(id) as globalThis.GainNode;
        
        if (audioNode)
        {
            audioNode.disconnect();
            audioNodes.delete(id);
        }
    }



    render()
    {
        const { id, selected, data: { gain } } = this.props;
        const { updateNode } = this.context!;
        
        
        return (
            <div 
                className = {styles.node}
                style     = {{ outline: selected ? 'var(--node-outline-style)' : 'none' }}
                >

                <Handle type='target' position={Position.Left} />

                <h1>Gain</h1>

                <div className={styles.nodeContent}>

                    <Range 
                        label    = 'Gain'
                        min      = {0}
                        max      = {200}
                        value    = {gain * 100} 
                        onChange = {(e) => updateNode(id, { gain: Number(e.target.value) / 100 })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />

            </div>
        );
    }
}