import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';

import styles from './Node.module.css';
import { Component, ContextType } from 'react';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';
import { NodeContext } from './NodeContext';



interface OscillatorNodeProps 
{
    id: string;
    data: 
    {
        frequency: number;
        type:      string;
    },
    selected: boolean
}

interface OscillatorNodeState {}



export default class OscillatorNode extends Component<OscillatorNodeProps, OscillatorNodeState>
{
    static contextType = NodeContext;
    declare context: ContextType<typeof NodeContext>;



    static create()
    {
        const node: Node =
        {
            id:    createId(),
            type: 'oscillator',
            data:     
            { 
                frequency: 440, 
                type:     'sine' 
            },
            position: { x: 0, y: 0 }
        };
       
        return node;
    }
    
    
    
    componentDidMount()
    {
        const { id, data: { frequency, type } } = this.props;

        createAudioContext();
        const audioNode = audioContext?.createOscillator();

        if (audioNode)
        {
            audioNode.frequency.value = frequency;
            audioNode.type            = type as OscillatorType;

            audioNode.start();

            audioNodes.set(id, audioNode);
        }
    }



    componentWillUnmount()
    {
        const { id } = this.props;

        const audioNode = audioNodes.get(id) as globalThis.OscillatorNode;
        
        if (audioNode)
        {
            audioNode.stop();
            audioNode.disconnect();
        
            audioNodes.delete(this.props.id);
        }
    }



    // handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    // {
    //     const { name, value } = e.target;
    //     const { id }          = this.props;
    //     const { updateNode }  = this.context

    //     switch (name)
    //     {
    //         case 'frequency'
    //     }
    //     updateNode(id, { [name]: Number(e.target.value) / 100 })
    // };


    
    render()
    {
        const { id, selected, data: { frequency, type } } = this.props;
        const { updateNode } = this.context!;
        
        
        return (
            <div 
                className = {styles.node}
                style     = {{ outline: selected ? 'var(--node-outline-style)' : 'none' }}
                >
                
                <h1>Oscillator</h1>

                <div className = {styles.nodeContent}>

                    <Range 
                        label    = 'Frequency'
                        min      = {10}
                        max      = {1000}
                        value    = {frequency}
                        suffix   = 'Hz'
                        onChange = {(e) => updateNode(id, { frequency: e.target.value })}
                        />

                    <Select
                        label   = 'Waveform'
                        options =
                        {[
                            { value: 'sine',     label: 'Sine'     },
                            { value: 'triangle', label: 'Triangle' },
                            { value: 'sawtooth', label: 'Sawtooth' },
                            { value: 'square',   label: 'Square'   }
                        ]}
                        value    = {type}
                        onChange = {(e) => updateNode(id, { type: e.target.value })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />

            </div>
        );
    }
}
