import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';
import { useFlowState } from '../hooks/useFlowState';

import styles from './Node.module.css';
import { useEffect } from 'react';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';



interface OscillatorUiNodeProps 
{
    id: string;
    data: 
    {
        frequency: number;
        type:      string;
    },
    selected: boolean
}



export default function OscillatorUiNode({ id, data, selected }: OscillatorUiNodeProps)
{
    const { updateNode }      = useFlowState();
    const { frequency, type } = data;


    useEffect(() =>
    {
        // constructor
        createAudioContext();

        const node = audioContext?.createOscillator();

        if (node)
        {
            node.frequency.value = frequency;
            node.type            = type as OscillatorType;

            node.start();

            audioNodes.set(id, node);
        }


        // destructor
        return () =>
        {
            const node = audioNodes.get(id) as OscillatorNode;
            
            if (node)
            {
                node.stop();
                node.disconnect();
            
                audioNodes.delete(id);
            }
        };
    },
    []);


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



OscillatorUiNode.create = function()
{
    const node: Node =
    {
        id:       createId(),
        type:     'oscillator',
        data:     { frequency: 440, type: 'sine' },
        position: { x: 0, y: 0 }
    };
   
    return node;
};