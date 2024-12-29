import { Handle, Node, Position } from 'reactflow';

import styles from './Node.module.css';
import { AudioOutputContext } from '../audio/AudioOutputContext';
import { Component, ContextType } from 'react';
import { audioContext, audioIsRunning, audioNodes, createAudioContext } from '../audio/audio';
import { createId } from '../util';
import Button from '../components/Button';



interface OutputNodeProps 
{
    id:       string;
    selected: boolean;
}

interface OutputNodeState {}



export default class OutputNode extends Component<OutputNodeProps, OutputNodeState>
{
    static contextType = AudioOutputContext;
    declare context: ContextType<typeof AudioOutputContext>;



    static create()
    {
        const node: Node =
        {
            id:       createId(),
            type:    '_output',
            data:     { },
            position: { x: 0, y: 0 }
        };
       
        return node;
    }
    
    
    
    componentDidMount()
    {
        const { id } = this.props;

        createAudioContext();
        const audioNode = audioContext?.destination;

        if (audioNode)
            audioNodes.set(id, audioNode);
    }

    

    componentWillUnmount()
    {
        const { id } = this.props;

        const audioNode = audioNodes.get(id) as AudioDestinationNode;
        
        if (audioNode)
        {
            audioNode?.disconnect();
            audioNodes.delete(id);
        }
    }



    render()
    {
        const { selected } = this.props;
        const { toggleAudio } = this.context!;


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
}
