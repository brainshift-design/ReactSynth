import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';

import styles from './Node.module.css';
import { Component, ContextType } from 'react';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';
import { createDistortionCurve } from './util';
import { NodeContext } from './NodeContext';



interface WaveShaperNodeProps 
{
    id: string;
    data: 
    {
        amount:     number;
        oversample: string;
    },
    selected: boolean
}

interface WaveShaperNodeState {}



export default class WaveShaperNode extends Component<WaveShaperNodeProps, WaveShaperNodeState>
{
    static contextType = NodeContext;
    declare context: ContextType<typeof NodeContext>;


    
    static create()
    {
        const node: Node =
        {
            id:    createId(),
            type: 'waveShaper',
            data:     
            { 
                amount:      400,
                oversample: 'none' 
            },
            position: { x: 0, y: 0 }
        };
       
        return node;
    };    
    

    
    componentDidMount()
    {
        const { id, data: { amount, oversample } } = this.props;

        createAudioContext();
        const audioNode = audioContext?.createWaveShaper();

        if (audioNode)
        {
            audioNode.curve      = createDistortionCurve(amount);
            audioNode.oversample = oversample as OverSampleType;

            audioNodes.set(id, audioNode);
        }
    }



    componentWillUnmount()
    {
        const { id } = this.props;

        const audioNode = audioNodes.get(id) as globalThis.WaveShaperNode;
        
        if (audioNode)
        {
            audioNode.disconnect();
            audioNodes.delete(id);
        }
    }



    render()
    {
        const { id, selected, data: { amount, oversample } } = this.props;
        const { updateNode } = this.context!;


        return (
            <div 
                className = {styles.node}
                style     = {{ outline: selected ? 'var(--node-outline-style)' : 'none' }}
                >
                
                <Handle type='target' position={Position.Left} />

                <h1>Wave Shaper</h1>

                <div className = {styles.nodeContent}>

                    <Range 
                        label    = 'Amount'
                        min      = {0}
                        max      = {1000}
                        value    = {amount}
                        onChange = {(e) => updateNode(id, { amount: Number(e.target.value), curve: createDistortionCurve(Number(e.target.value)) })}
                        />

                    <Select
                        label   = 'Oversample'
                        options =
                        {[
                            { value: 'none', label: 'None' },
                            { value: '2x',   label: '2x'   },
                            { value: '4x',   label: '4x'   }
                        ]}
                        value    = {oversample}
                        onChange = {(e) => updateNode(id, { oversample: e.target.value })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />

            </div>
        );
    }
}