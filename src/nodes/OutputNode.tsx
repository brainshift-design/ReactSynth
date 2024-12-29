import Node, { NodeProps } from './Node';
import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import { AudioOutputContext } from '../audio/AudioOutputContext';
import { ContextType } from 'react';
import { audioContext, audioIsRunning } from '../audio/audio';
import Button from '../components/Button';

import styles from './Node.module.css';



export default class OutputNode extends Node<NodeProps, typeof AudioOutputContext>
{
    static contextType = AudioOutputContext;
    declare context: ContextType<typeof AudioOutputContext>;



    protected createAudioNode(): AudioNode
    {
        return audioContext?.destination as AudioNode;
    }



    static createReactFlowNode(): ReactFlowNode 
    {
        return { ...super.createReactFlowNode() };
    }



    protected renderContent()
    {
        const { toggleAudio } = this.context!;

        return (
            <>
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
            </>
        );
    }
}
