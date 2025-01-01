import styles from './Node.module.css';
import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import NumberKnob from '../components/NumberKnob';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import { getFreqCurve, invFreq } from './util';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';



interface FilterNodeProps extends NodeProps
{
    data: 
    {
        frequency: number;
        detune:    number;
        Q:         number;
        gain:      number;
        type:      number;
    }
}



export default class FilterNode extends AudioNode<FilterNodeProps>
{
    static readonly minFreq = 20;
    static readonly maxFreq = 20000;

    static readonly filterTypes =
    [
        { value: 'lowpass',   label: 'LoPs' },
        { value: 'highpass',  label: 'HiPs' },
        { value: 'bandpass',  label: 'BnPs' },
        { value: 'lowshelf',  label: 'LoSh' },
        { value: 'highshelf', label: 'HiSh' },
        { value: 'peaking',   label: 'Peak' },
        { value: 'notch',     label: 'Ntch' },
        { value: 'allpass',   label: 'AlPs' }
    ];



    protected createAudioNode()
    {
        return audioContext?.createBiquadFilter() as globalThis.AudioNode;
    }



    protected override initAudioNode()
    {
        const { data: { frequency, detune, Q, gain, type } } = this.props;

        const node = this.audioNode as globalThis.BiquadFilterNode;

        if (node)
        {
            node.frequency.value = frequency;
            node.detune   .value = detune;
            node.Q        .value = Q;
            node.gain     .value = gain;
            node.type            = FilterNode.filterTypes[type].value as BiquadFilterType;
        }
    }



    override updateAudioParam(key: string, value: any)
    {
        super.updateAudioParam(
            key,
            key == 'type'
                ? FilterNode.filterTypes.find((_, i) => i == value)?.value
                : value
        );
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                frequency: invFreq(220),
                detune:    0,
                Q:         1,
                gain:      1,
                type:      0
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { frequency, detune, Q, gain, type } } = this.props;


        return (
            <>
                <Handle type='target' position={Position.Left} />

                <h1>Filter</h1>

                * detune doesn't turn properly<br/>

                <div className={styles.nodeContent}>

                    <SelectKnob
                        label    = 'Type'
                        options  = {FilterNode.filterTypes}
                        value    = {type}
                        onChange = {(e) => this.update({ type: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label    = 'Det ¢'
                        min      = {-100}
                        max      = { 100}
                        value    = {detune}
                        ticks    = {11}
                        onChange = {(e) => this.update({ detune: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label          = 'Hz'
                        min            = {FilterNode.minFreq}
                        max            = {FilterNode.maxFreq}
                        value          = {frequency}
                        getCurvedValue = {(val) => getFreqCurve(val, FilterNode.minFreq, FilterNode.maxFreq, 6, v => v)}
                        getCurvedTick  = {(val) => getFreqCurve(val, 0, 1, 6, v => 1-v)}
                        ticks          = {35}
                        onChange       = {(e) => this.update({ frequency: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label    = 'Q'
                        min      = {0}
                        max      = {30}
                        value    = {Q}
                        ticks    = {11}
                        onChange = {(e) => this.update({ Q: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label    = 'Gain %'
                        min      = {0}
                        max      = {100}
                        value    = {gain * 100}
                        ticks    = {11}
                        onChange = {(e) => this.update({ gain: Number(e.target.value) / 100 })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />

            </>
        );
    }
}