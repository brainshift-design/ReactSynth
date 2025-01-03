import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';
import BooleanToggle from '../components/BooleanToggle';
import { createReverbImpulseResponse } from './util';



interface ConvolverNodeProps extends NodeProps
{
    data: 
    {
        duration: number;
        decay:    number;
        metallic: number;
        reverse:  boolean;
    }
}



export default class ReverbNode extends AudioNode<ConvolverNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createConvolver() as globalThis.AudioNode;
    }



    protected override initAudioNode() 
    {
        const { data: { duration, decay, metallic, reverse } } = this.props;
        const node = this.audioNode as globalThis.ConvolverNode;
        
        if (node)
            node.buffer = createReverbImpulseResponse(duration, decay, metallic, reverse);
    }



    override updateAudioParam(key: string, value: any) 
    {
        super.updateAudioParam(key, value);
        
        const { data: { duration, decay, metallic, reverse } } = this.props;
        const node = this.audioNode as globalThis.ConvolverNode;
        
        if (node)
            node.buffer = createReverbImpulseResponse(duration, decay, metallic, reverse);
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                duration:  1,
                decay:     5,
                metallic:  0,
                reverse:   false
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { duration, decay, metallic, reverse } } = this.props;


        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />

                <h1>Reverb</h1>

                <div className = {nodeStyles.nodeContent}>

                    <NumberKnob 
                        label      = 'Dur|sec'
                        min        = {0}
                        max        = {10}
                        decimals   = {1}
                        value      = {duration}
                        ticks      = {11}
                        onChange   = {(e) => this.update({ duration: Number(e.target.value) })}
                        knobColor  = 'var(--color-node-highlight)'
                        valueColor = 'var(--color-node-highlight-value)'
                    />

                    <NumberKnob 
                        label      = 'Decay'
                        min        = {0.1}
                        max        = {10}
                        decimals   = {1}
                        value      = {decay}
                        ticks      = {11}
                        onChange   = {(e) => this.update({ decay: Number(e.target.value) })}
                    />

                    <NumberKnob 
                        label      = 'Metal|%'
                        min        = {0}
                        max        = {100}
                        value      = {metallic}
                        ticks      = {11}
                        onChange   = {(e) => this.update({ metallic: Number(e.target.value) })}
                    />

                    <BooleanToggle
                        label    = 'Rev'
                        value    = {reverse}
                        onChange = {(e) => this.update({ reverse: e.target.value === 'true' })}
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