import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';
import { useFlowState } from '../hooks/useFlowState';

import styles from './Node.module.css';
import { useEffect } from 'react';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';
import { createDistortionCurve } from './util';



interface WaveShaperUiNodeProps 
{
    id: string;
    data: 
    {
        amount:     number;
        oversample: string;
    },
    selected: boolean
}



export default function WaveShaperUiNode({ id, data, selected }: WaveShaperUiNodeProps)
{
    const { updateNode }         = useFlowState();
    const { amount, oversample } = data;

    
    useEffect(() =>
    {
        // constructor
        createAudioContext();

        const audioNode = audioContext?.createWaveShaper();

        if (audioNode)
        {
            audioNode.curve      = createDistortionCurve(amount);
            audioNode.oversample = oversample as OverSampleType;

            audioNodes.set(id, audioNode);
        }


        // destructor
        return () =>
        {
            const audioNode = audioNodes.get(id) as WaveShaperNode;
            
            if (audioNode)
            {
                audioNode.disconnect();
            
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



WaveShaperUiNode.create = function()
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