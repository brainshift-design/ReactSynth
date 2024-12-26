import { Handle, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';
import { useFlowState } from '../hooks/useFlowState';

import styles from './Node.module.css';



interface OscillatorNodeProps 
{
    id:   string;
    data: 
    {
        frequency: number;
        type:      string;
    }
}



export default function OscillatorNode({ id, data }: OscillatorNodeProps)
{
    const { updateNode }      = useFlowState();
    const { frequency, type } = data;


    return (
        <div className={styles.node}>
            <h1>Oscillator</h1>

            <div className={styles.nodeContent}>

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
