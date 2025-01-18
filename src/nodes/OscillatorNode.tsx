import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import { freqCurvePower, getValueCurve, invValueCurve } from './util';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';
import { Tau } from '../util';
import OutputHandle from '../components/OutputHandle';
import InputHandle from '../components/InputHandle';



interface OscillatorNodeProps 
extends NodeProps
{
    data: 
    {
        frequency: number;
        type:      number;
    }
}



export default class OscillatorNode 
extends AudioNode<OscillatorNodeProps>
{
    static readonly minFreq = 20;
    static readonly maxFreq = 20000;

    static readonly oscillatorTypes =
    [
        { value: 'sine',     label: 'Sine' },
        { value: 'triangle', label: 'Tri'  },
        { value: 'sawtooth', label: 'Saw'  },
        { value: 'square',   label: 'Sqr'  } 
    ];



    protected createAudioNode()
    {
        return audioContext?.createOscillator() as globalThis.AudioNode;
    }



    protected override initAudioNode()
    {
        const { data: { frequency, type } } = this.props;

        const node = this.audioNode as globalThis.OscillatorNode;

        if (node)
        {
            node.frequency.value = frequency;
            node.type            = OscillatorNode.oscillatorTypes[type].value as OscillatorType;

            node.start();
        }
    }



    override updateAudioParam(key: string, value: number | string)
    {
        if (key === 'type') {
            const typeValue = OscillatorNode.oscillatorTypes.find((_, i) => i === Number(value))?.value ?? 'sine';
            (this.audioNode as globalThis.OscillatorNode).type = typeValue as OscillatorType;
        } else {
            super.updateAudioParam(key, Number(value));
        }
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                frequency: invValueCurve(440), 
                type:      0
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { frequency, type } } = this.props;

        
        return (
            <>
                <InputHandle 
                    type       = 'target' 
                    handletype = 'control'
                    id         = {'control-in'} 
                    nodeid     = {this.props.id} 
                    position   = {Position.Left}
                />

                <h1>Oscillator</h1>

                <div className = {nodeStyles.nodeContent}>

                    <SelectKnob
                        label    = 'Form'
                        options  = {OscillatorNode.oscillatorTypes}
                        value    = {type}
                        onChange = {(e) => this.update({ type: Number(e.target.value) })}
                        minAngle = {Tau * -5/32}
                        maxAngle = {Tau *  5/32}
                        />

                    <NumberKnob 
                        label           = 'Freq|Hz'
                        min             = {1200}
                        max             = {OscillatorNode.maxFreq}
                        value           = {frequency}
                        getCurvedValue  = {(val) => getValueCurve(val, OscillatorNode.minFreq, OscillatorNode.maxFreq, freqCurvePower, v => v)}
                        getCurvedTick   = {(val) => getValueCurve(val, 0, 1, freqCurvePower, v => 1-v)}
                        ticks           = {49}
                        onChange        = {(e) => this.update({ frequency: Number(e.target.value) })}
                        sensitivity     = {0.001}
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
