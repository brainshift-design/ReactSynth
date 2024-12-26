import { Handle, Position } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';
import Range from '../components/Range';

import styles from './Node.module.css';



interface GainNodeProps 
{
    id:   string;
    data: 
    {
        gain: number;
    }
}



export default function GainNode({ id, data }: GainNodeProps)
{
    const { updateNode } = useFlowState();
    const { gain }       = data;


    return (
        <div className={styles.node}>
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
