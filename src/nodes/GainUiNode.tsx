import { Handle, Node, Position } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';
import Range from '../components/Range';

import styles from './Node.module.css';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { useEffect } from 'react';
import { createId } from '../util';



interface GainUiNodeProps 
{
    id:   string;
    data: 
    {
        gain: number;
    },
    selected: boolean
}



export default function GainUiNode({ id, data, selected }: GainUiNodeProps)
{
    const { updateNode } = useFlowState();
    const { gain }       = data;


    useEffect(() =>
    {
        // constructor
        createAudioContext();
  
        const node = audioContext?.createGain();

        if (node)
        {
            node.gain.value = gain;

            audioNodes.set(id, node);
        }


        // destructor
        return () =>
        {
            const node = audioNodes.get(id) as GainNode;
            
            if (node)
            {
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



GainUiNode.create = function()
{
    const node: Node =
    {
        id:       createId(),
        type:     'gain',
        data:     { gain: 1 },
        position: { x: 0, y: 0 }
    };
   
    return node;
};