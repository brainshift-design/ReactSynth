import styles from './Node.module.css';
import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import { getFreqCurve, invFreq } from './util';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';
import { Tau } from '../util';



interface OscillatorNodeProps extends NodeProps
{
    data: 
    {
        frequency: number;
        type:      number;
    }
}



export default class OscillatorNode extends AudioNode<OscillatorNodeProps>
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



    override updateAudioParam(key: string, value: any)
    {
        super.updateAudioParam(
            key,
            key == 'type'
                ? OscillatorNode.oscillatorTypes.find((_, i) => i == value)?.value
                : value
        );
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                frequency: invFreq(440), 
                type:      0
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { frequency, type } } = this.props;

        
        return (
            <>
                <h1>Oscillator</h1>

                * wrong frequency<br/>
                * moving NumberKnob, then moving another NumberKnob, updates the previous one<br/>

                <div className = {styles.nodeContent}>

                    <SelectKnob
                        label    = 'Form'
                        options  = {OscillatorNode.oscillatorTypes}
                        value    = {type}
                        onChange = {(e) => this.update({ type: Number(e.target.value) })}
                        minAngle = {Tau * -5/32}
                        maxAngle = {Tau *  5/32}
                        />

                    <NumberKnob 
                        label           = 'Hz'
                        min             = {OscillatorNode.minFreq}
                        max             = {OscillatorNode.maxFreq}
                        value           = {frequency}
                        getCurvedValue  = {(val) => getFreqCurve(val, OscillatorNode.minFreq, OscillatorNode.maxFreq, 6, v => v)}
                        getCurvedTick   = {(val) => getFreqCurve(val, 0, 1, 6, v => 1-v)}
                        ticks           = {62}
                        onChange        = {(e) => this.update({ frequency: Number(e.target.value) })}
                        knobColor       = '#4af'
                        valueColor      = '#444'
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}
