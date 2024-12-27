import { Handle, Node, Position } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';
import Range from '../components/Range';

import styles from './Node.module.css';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { useEffect } from 'react';
import { createId } from '../util';



interface DelayUiNodeProps 
{
    id:   string;
    data: 
    {
        delayTime: number;
    },
    selected: boolean
}



export default function DelayUiNode({ id, data, selected }: DelayUiNodeProps)
{
    const { updateNode } = useFlowState();
    const { delayTime: delayTime } = data;


    useEffect(() =>
    {
        // constructor
        createAudioContext();
  
        const audioNode = audioContext?.createDelay();

        if (audioNode)
        {
            audioNode.delayTime.value = delayTime;

            audioNodes.set(id, audioNode);
        }


        // destructor
        return () =>
        {
            const audioNode = audioNodes.get(id) as DelayNode;
            
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

            <h1>Delay</h1>

            <div className={styles.nodeContent}>

                <Range 
                    label    = 'Time'
                    min      = {0}
                    max      = {1000}
                    value    = {delayTime * 1000} 
                    suffix   = 'ms'
                    onChange = {(e) => updateNode(id, { delayTime: Number(e.target.value) / 1000 })}
                    />

            </div>

            <Handle type='source' position={Position.Right} />

        </div>
    );
}



DelayUiNode.create = function()
{
    const node: Node =
    {
        id:    createId(),
        type: 'delay',
        data:     
        { 
            delayTime: 1 
        },
        position: { x: 0, y: 0 }
    };
   
    return node;
};