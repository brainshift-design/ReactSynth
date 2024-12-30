import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import Node, { NodeProps } from './Node';
import styles from './Node.module.css';
import NumberKnob from '../components/NumberKnob';



interface GainNodeProps extends NodeProps
{
    data: { gain: number }
}



export default class GainNode extends Node<GainNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createGain() as globalThis.GainNode;
    }



    protected initAudioNode()
    {
        const { data: { gain } } = this.props;

        const node = this.audioNode as globalThis.GainNode;

        if (node)
            node.gain.value = gain;
    }



    static createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data: { gain: 1 }
        };
    }
    
    
    
    renderContent()
    {
        const { id, data: { gain } } = this.props;
        const { updateNode } = this.context;
        
        
        return (
            <>

                <Handle type='target' position={Position.Left} />

                <h1>Gain</h1>

                <div className={styles.nodeContent}>

                    <NumberKnob 
                        label           = '%'
                        min             = {0}
                        max             = {200}
                        value           = {gain * 100}
                        padding         = {3}
                        ticks           = {9}
                        tickSize        = {3}
                        tickDistance    = {27}
                        adjustTickX     = {-1}
                        adjustTickAngle = {0.05}
                        onChange = {(e) => updateNode(id, { gain: Number(e.target.value) / 100 })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />

            </>
        );
    }
}