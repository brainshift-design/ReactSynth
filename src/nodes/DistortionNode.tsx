import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { createDistortionCurve } from './util';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';
import { Tau } from '../util';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';



interface DistortionNodeProps extends NodeProps
{
    data: 
    {
        amount:     number;
        oversample: number;
    }
}



export default class DistortionNode extends AudioNode<DistortionNodeProps>
{
    static readonly oversampleTypes =
    [
        { value: 'none', label: 'None' },
        { value: '2x',   label: '2x'   },
        { value: '4x',   label: '4x'   }
    ];



    protected createAudioNode()
    {
        return audioContext?.createWaveShaper() as globalThis.AudioNode;
    }



    protected override initAudioNode()
    {
        const { data: { oversample } } = this.props;

        const audioNode = this.audioNode as globalThis.WaveShaperNode;

        if (audioNode)
            audioNode.oversample = DistortionNode.oversampleTypes[oversample].value as OverSampleType;
    }



    override updateAudioParam(key: string, value: any)
    {
        super.updateAudioParam(
            key,
            key == 'oversample'
                ? DistortionNode.oversampleTypes.find((_, i) => i == value)?.value
                : value
        );

        const { data: { amount } } = this.props;
        const node = this.audioNode as globalThis.WaveShaperNode;
        
        if (node)
            node.curve = createDistortionCurve(amount);
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                amount:     0,
                oversample: 0
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { amount, oversample } } = this.props;


        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />

                <h1>Distortion</h1>

                <div className = {nodeStyles.nodeContent}>

                    <NumberKnob 
                        label      = 'Amt'
                        min        = {0}
                        max        = {1000}
                        value      = {amount}
                        ticks      = {11}
                        onChange   = {(e) => this.update(
                        { 
                            amount: Number(e.target.value)
                        })}
                        knobColor  = 'var(--color-node-highlight)'
                        valueColor = 'var(--color-node-highlight-value)'
                        />

                    <SelectKnob
                        label    = 'OvrSmp'
                        options  = {DistortionNode.oversampleTypes}
                        value    = {oversample}
                        onChange = {(e) => this.update({ oversample: Number(e.target.value) })}
                        minAngle = {Tau * -3/32}
                        maxAngle = {Tau *  3/32}
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