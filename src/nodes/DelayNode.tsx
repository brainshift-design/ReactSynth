import styles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';



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
        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />

                <h1>Delay</h1>

                <div className={styles.nodeContent}>

                    <NumberKnob 
                        label      = 'Dur|sec'
                        min        = {0}
                        max        = {1}
                        value      = {this.props.data.delayTime}
                        decimals   = {2}
                        padding    = {4}
                        ticks      = {11}
                        onChange   = {(e) => this.update({ delayTime: Number(e.target.value) })}
                        knobColor  = 'var(--color-node-highlight)'
                        valueColor = 'var(--color-node-highlight-value)'
                        />

                </div>

                <OutputHandle 
                    type     = 'source' 
                    position = {Position.Right} 
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />
            </>
        );
    }
}