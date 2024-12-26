import { Handle, Position } from 'reactflow';
import { useFlowState } from '../hooks/useFlowState';

import styles from './Node.module.css';



export default function OutputNode()
{
    const { isRunning, toggleAudio } = useFlowState();


    return (
        <div className={styles.node}>
            <Handle type='target' position={Position.Left} />

            <h1>Output</h1>

            <div className={styles.nodeContent}>
                <button 
                    style   = {{ margin: 'auto'}}
                    onClick = {toggleAudio}>
                    { 
                        isRunning 
                            ? (<span role='img' aria-label='mute'  ><span className='material-symbols-outlined'>volume_up</span></span>) 
                            : (<span role='img' aria-label='unmute'><span className='material-symbols-outlined'>no_sound </span></span>)
                    }                
                </button>
            </div>
        </div>
    );
}
