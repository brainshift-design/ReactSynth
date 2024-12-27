import { Handle, Node, Position } from 'reactflow';

import styles from './Node.module.css';
import { AudioOutputContext } from '../audio/AudioOutputContext';
import { useContext, useEffect } from 'react';
import { audioContext, audioIsRunning, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';



interface OutputUiNodeProps 
{
    id: string;
}



export default function OutputUiNode({ id }: OutputUiNodeProps)
{
    const audioOutputContext = useContext(AudioOutputContext);
    const { toggleAudio } = audioOutputContext!


    useEffect(() =>
    {
        // constructor
        createAudioContext(); // must be started after user gesture

        const node = audioContext?.destination;

        if (node)
            audioNodes.set(id, node);

        
        // destructor
        return () =>
        {
            const node_ = audioNodes.get(id) as AudioDestinationNode;
            
            node_?.disconnect();
            
            audioNodes.delete(id);
        };
    },
    []);


    return (
        <div className={styles.node}>
            <Handle type='target' position={Position.Left} />

            <h1>Output</h1>

            <div className={styles.nodeContent}>
                <button 
                    style   = {{ margin: 'auto'}}
                    onClick = {() => toggleAudio()}>
                    { 
                        audioIsRunning()
                            ? (<span role='img' aria-label='mute'  ><span className='material-symbols-outlined'>volume_up</span></span>) 
                            : (<span role='img' aria-label='unmute'><span className='material-symbols-outlined'>no_sound </span></span>)
                    }                
                </button>
            </div>
        </div>
    );
}



OutputUiNode.create = function()
{
    const node: Node =
    {
        id:        createId(),
        type:      '_output',
        data:      { },
        position:  { x: 0, y: 0 }
    };
   
    return node;
};