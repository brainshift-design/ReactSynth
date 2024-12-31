import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import styles from './Node.module.css';
import NumberKnob from '../components/NumberKnob';
import AudioNode from './AudioNode';



interface DelayNodeProps extends NodeProps
{
    data: { delayTime: number }
}



export default class DelayNode extends AudioNode<DelayNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createDelay() as globalThis.AudioNode;
    }



    protected override initAudioNode()
    {
        const { data: { delayTime } } = this.props;

        const delayNode = this.audioNode as globalThis.DelayNode;

        if (delayNode)
            delayNode.delayTime.value = delayTime;
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data: { delayTime: 0.5 } 
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

                    <NumberKnob 
                        label    = 'sec'
                        min      = {0}
                        max      = {1}
                        value    = {this.props.data.delayTime}
                        decimals = {2}
                        padding  = {4}
                        ticks    = {11}
                        onChange = {(e) => updateNode(this.props.id, { delayTime: Number(e.target.value) })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}