import { Handle, Node, Position } from 'reactflow';

import styles from './Node.module.css';
import { AudioOutputContext } from '../audio/AudioOutputContext';
import { useContext, useEffect } from 'react';
import { audioContext, audioIsRunning, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';
import Button from '../components/Button';



interface OutputUiNodeProps 
{
    id:       string;
    selected: boolean;
}



export default function OutputUiNode({ id, selected }: OutputUiNodeProps)
{
    const audioOutputContext = useContext(AudioOutputContext);
    const { toggleAudio } = audioOutputContext!


    useEffect(() =>
    {
        // constructor
        createAudioContext(); // must be started after user gesture

        const audioNode = audioContext?.destination;

        if (audioNode)
        {
            audioNodes.set(id, audioNode);
        }

        
        // destructor
        return () =>
        {
            const audioNode = audioNodes.get(id) as AudioDestinationNode;
            
            if (audioNode)
            {
                audioNode?.disconnect();
                
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

            <h1>Output</h1>

            <div className={styles.nodeContent}>
                <Button
                    style   = {{ margin: 'auto'}}
                    onClick = {() => toggleAudio()}>
                    { 
                        audioIsRunning()
                            ? (<span role='img' aria-label='mute'  ><span className='material-symbols-outlined'>volume_up</span></span>) 
                            : (<span role='img' aria-label='unmute'><span className='material-symbols-outlined'>no_sound </span></span>)
                    }                
                </Button>
            </div>

        </div>
    );
}



OutputUiNode.create = function()
{
    const node: Node =
    {
        id:       createId(),
        type:    '_output',
        data:     { },
        position: { x: 0, y: 0 }
    };
   
    return node;
};