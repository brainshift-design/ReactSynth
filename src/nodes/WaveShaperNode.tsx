import nodeStyles from './Node.module.css';
import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { createDistortionCurve } from './util';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';
import { Tau } from '../util';



interface WaveShaperNodeProps extends NodeProps
{
    data: 
    {
        amount:     number;
        oversample: number;
    }
}



export default class WaveShaperNode extends AudioNode<WaveShaperNodeProps>
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
        {
            audioNode.oversample = WaveShaperNode.oversampleTypes[oversample].value as OverSampleType;
        }
    }



    protected getAudioNodeData(data: any) 
    {
        return {
            amount:     data.amount,
            oversample: WaveShaperNode.oversampleTypes[data.oversample].value
        }
    }



    override updateAudioParam(key: string, value: any)
    {
        super.updateAudioParam(
            key,
            key == 'oversample'
                ? WaveShaperNode.oversampleTypes.find((_, i) => i == value)?.value
                : value
        );
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                amount:     400,
                oversample: 0
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { amount, oversample } } = this.props;


        return (
            <>
                <Handle type='target' position={Position.Left} />

                <h1>Wave Shaper</h1>

                <div className = {nodeStyles.nodeContent}>

                    <NumberKnob 
                        label      = 'Amt'
                        min        = {0}
                        max        = {1000}
                        value      = {amount}
                        padding    = {3}
                        ticks      = {11}
                        onChange   = {(e) => this.update({ amount: Number(e.target.value), curve: createDistortionCurve(Number(e.target.value)) })}
                        knobColor  = '#4af'
                        valueColor = '#444'
                        />

                    <SelectKnob
                        label    = 'Over'
                        options  = {WaveShaperNode.oversampleTypes}
                        value    = {oversample}
                        onChange = {(e) => this.update({ oversample: Number(e.target.value) })}
                        minAngle = {Tau * -3/32}
                        maxAngle = {Tau *  3/32}
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}