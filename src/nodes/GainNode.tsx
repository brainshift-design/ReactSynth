import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';



interface GainNodeProps 
extends NodeProps
{
    data: { gain: number }
}



export default class GainNode 
extends AudioNode<GainNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createGain() as globalThis.GainNode;
    }



    protected override initAudioNode()
    {
        const { data: { gain } } = this.props;

        const node = this.audioNode as globalThis.GainNode;

        if (node)
            node.gain.value = gain;
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data: { gain: 1 }
        };
    }
    
    
    
    renderContent()
    {
        const { data: { gain } } = this.props;
        
        
        return (
            <>
                <InputHandle 
                    type       = 'target' 
                    handletype = 'audio'
                    id         = {'audio-in'} 
                    nodeid     = {this.props.id} 
                    position   = {Position.Left}
                />

                <h1>Gain</h1>

                <div className={nodeStyles.nodeContent}>

                    <NumberKnob 
                        label           = '_|%'
                        min             = {0}
                        max             = {200}
                        value           = {gain * 100}
                        padding         = {3}
                        ticks           = {11}
                        tickSize        = {3}
                        tickDistance    = {27}
                        adjustTickX     = {-1}
                        adjustTickAngle = {0.05}
                        onChange        = {(e) => this.update({ gain: Number(e.target.value) / 100 })}
                        knobColor       = 'var(--color-node-highlight)'
                        valueColor      = 'var(--color-node-highlight-value)'
                        />

                </div>

                <OutputHandle 
                    type       = 'source' 
                    handletype = 'audio' 
                    id         = {'audio-out'} 
                    position   = {Position.Right} 
                    nodeid     = {this.props.id} 
                />
            </>
        );
    }
}