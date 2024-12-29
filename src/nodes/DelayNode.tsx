import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';

import styles from './Node.module.css';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { ChangeEvent, Component, ContextType } from 'react';
import { createId } from '../util';
import { NodeContext } from './NodeContext';



interface DelayNodeProps 
{
    id:   string;
    data: { delayTime: number },
    selected: boolean
}

interface DelayNodeState {}



export default class DelayNode extends Component<DelayNodeProps, DelayNodeState>
{
    static contextType = NodeContext;
    declare context: ContextType<typeof NodeContext>;



    static create()
    {
        const node: Node =
        {
            id:       createId(),
            type:     'delay',
            data:     { delayTime: 1 },
            position: { x: 0, y: 0 }
        };
       
        return node;
    }
    
    
    
    componentDidMount()
    {
        createAudioContext();
        const audioNode = audioContext?.createDelay();

        if (audioNode)
        {
            audioNode.delayTime.value = this.props.data.delayTime;
            audioNodes.set(this.props.id, audioNode);
        }
    }



    componentWillUnmount()
    {
        const audioNode = audioNodes.get(this.props.id) as globalThis.DelayNode;
        
        if (audioNode)
        {
            audioNode.disconnect();
            audioNodes.delete(this.props.id);
        }
    }



    handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    {
        const { updateNode } = this.context!;
        updateNode(this.props.id, { gain: Number(e.target.value) / 100 })
    };



    render()
    {
        const { selected }   = this.props;
        const { updateNode } = this.context!;


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
                        value    = {this.props.data.delayTime * 1000} 
                        suffix   = 'ms'
                        onChange = {(e) => updateNode(this.props.id, { delayTime: Number(e.target.value) / 1000 })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />

            </div>
        );
    }
}