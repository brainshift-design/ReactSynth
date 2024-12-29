import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import Range from '../components/Range';
import { audioContext } from '../audio/audio';
import Node, { NodeProps } from './Node';
import styles from './Node.module.css';



interface DelayNodeProps extends NodeProps
{
    data: { delayTime: number }
}



export default class DelayNode extends Node<DelayNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createDelay() as AudioNode;
    }



    protected initAudioNode()
    {
        const { data: { delayTime } } = this.props;

        const delayNode = this.audioNode as globalThis.DelayNode;

        if (delayNode)
            delayNode.delayTime.value = delayTime;
    }



    static createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data: { delayTime: 1 } 
        };
    }
    
    
    
    renderContent()
    {
        const { updateNode } = this.context;

        return (
            <>
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
            </>
        );
    }
}