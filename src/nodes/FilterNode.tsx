import styles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import NumberKnob from '../components/NumberKnob';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import { freqCurvePower, getValueCurve, invValueCurve } from './util';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';



interface FilterNodeProps 
extends NodeProps
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



export interface FilterType 
{ 
    id:   string; 
    type: number; 
}



export default class FilterNode 
extends AudioNode<FilterNodeProps>
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

    static readonly knobVisibility: Record<string, {Q: boolean, gain: boolean}> = 
    {
        lowpass:   { Q: true,  gain: false },
        highpass:  { Q: true,  gain: false },
        bandpass:  { Q: true,  gain: false },
        lowshelf:  { Q: false, gain: true  },
        highshelf: { Q: false, gain: true  },
        peaking:   { Q: true,  gain: true  },
        notch:     { Q: true,  gain: false },
        allpass:   { Q: true,  gain: false }
    };

    static readonly knobValueCurve: Record<string, {Q: number}> = 
    {
        lowpass:   { Q: 1 },
        highpass:  { Q: 1 },
        bandpass:  { Q: 4 },
        lowshelf:  { Q: 1 },
        highshelf: { Q: 1 },
        peaking:   { Q: 1 },
        notch:     { Q: 4 },
        allpass:   { Q: 1 }
    };

    static readonly knobTicks: Record<string, {Q: number}> = 
    {
        lowpass:   { Q: 11 },
        highpass:  { Q: 11 },
        bandpass:  { Q: 29 },
        lowshelf:  { Q: 11 },
        highshelf: { Q: 11 },
        peaking:   { Q: 11 },
        notch:     { Q: 29 },
        allpass:   { Q: 11 }
    };



    override componentDidMount()
    {
        super.componentDidMount();

        // add this node to context.filterTypes 
        // to access the type value from other components

        this.context.setFilterTypes([
            ...this.context.filterTypes,
            { id: this.id, type: this.props.data.type }
        ]);
    }



    override componentWillUnmount()
    {
        super.componentWillUnmount();

        this.context.setFilterTypes(
            this.context.filterTypes.filter(type => type.id != this.id)
        );
    }   



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
                frequency: invValueCurve(220),
                detune:    0,
                Q:         0,
                gain:      1,
                type:      0
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { frequency, detune, Q, gain, type } } = this.props;

        const visibility = FilterNode.knobVisibility[FilterNode.filterTypes[type].value];
        const valueCurve = FilterNode.knobValueCurve[FilterNode.filterTypes[type].value];
        const knobTicks  = FilterNode.knobTicks     [FilterNode.filterTypes[type].value];

        
        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />

                <h1>Filter</h1>

                <div className={styles.nodeContent}>

                    <SelectKnob
                        label    = 'Type'
                        options  = {FilterNode.filterTypes}
                        value    = {type}
                        onChange = {(e) => this.update({ type: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label     = 'Det|¢'
                        min       = {-100}
                        max       = { 100}
                        value     = {detune}
                        forcePlus = {true}
                        ticks     = {11}
                        onChange  = {(e) => this.update({ detune: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label          = 'Freq|Hz'
                        min            = {1200}
                        max            = {FilterNode.maxFreq}
                        value          = {frequency}
                        getCurvedValue = {(val) => getValueCurve(val, FilterNode.minFreq, FilterNode.maxFreq, freqCurvePower, v => v)}
                        getCurvedTick  = {(val) => getValueCurve(val, 0, 1, freqCurvePower, v => 1-v)}
                        ticks          = {49}
                        onChange       = {(e) => this.update({ frequency: Number(e.target.value) })}
                        knobColor      = 'var(--color-node-highlight)'
                        valueColor     = 'var(--color-node-highlight-value)'
                        />

                    <NumberKnob 
                        label          = 'Q'
                        min            = {0}
                        max            = {100}
                        value          = {Q}
                        showValue      = {visibility.Q}
                        getCurvedValue = {(val) => getValueCurve(val, 0, 100, valueCurve.Q, v => v)}
                        getCurvedTick  = {(val) => getValueCurve(val, 0, 1, valueCurve.Q, v => 1-v)}
                        ticks          = {knobTicks.Q}
                        onChange       = {(e) => this.update({ Q: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label     = 'Gain|%'
                        min       = {0}
                        max       = {100}
                        value     = {gain * 100}
                        showValue = {visibility.gain}
                        ticks     = {11}
                        onChange  = {(e) => this.update({ gain: Number(e.target.value) / 100 })}
                        />

                </div>

                <OutputHandle 
                    type     = 'source' 
                    position = {Position.Right} 
                    id       = {'audio-out'} 
                    nodeid   = {this.props.id} 
                />
            </>
        );
    }
}