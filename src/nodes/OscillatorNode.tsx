import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import styles from './Node.module.css';
import { audioContext } from '../audio/audio';
import Node, { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import { freqCurvePower, getFreqCurve } from './util';
import SelectKnob from '../components/SelectKnob';



interface OscillatorNodeProps extends NodeProps
{
    data: 
    {
        frequency: number;
        type:      string;
    }
}



export default class OscillatorNode extends Node<OscillatorNodeProps>
{
    static readonly minFreq = 20;
    static readonly maxFreq = 20000;



    protected createAudioNode()
    {
        return audioContext?.createOscillator() as AudioNode;
    }



    protected initAudioNode()
    {
        const { data: { frequency, type } } = this.props;

        const node = this.audioNode as globalThis.OscillatorNode;

        if (node)
        {
            node.frequency.value = frequency;
            node.type            = type as OscillatorType;

            node.start();
        }
    }



    static createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                frequency: getFreqCurve(440, OscillatorNode.minFreq, OscillatorNode.maxFreq, 1/freqCurvePower), 
                type:     'sine' 
            },
        };
    }
    
    
    
    renderContent()
    {
        const { id, data: { frequency, type } } = this.props;
        const { updateNode } = this.context;

        
        return (
            <>
                <h1>Oscillator</h1>

                * wrong frequency<br/>

                <div className = {styles.nodeContent}>

                    <SelectKnob
                        label   = 'Form'
                        options =
                        {[
                            { value: 'sine',     label: 'Sine' },
                            { value: 'triangle', label: 'Tri'  },
                            { value: 'sawtooth', label: 'Saw'  },
                            { value: 'square',   label: 'Sqr'  }
                        ]}
                        value    = {type}
                        onChange = {(e) => updateNode(id, { type: e.target.value })}
                        />

                    <NumberKnob 
                        label           = 'Hz'
                        min             = {OscillatorNode.minFreq}
                        max             = {OscillatorNode.maxFreq}
                        value           = {frequency}
                        getCurvedValue  = {(val) => getFreqCurve(val, OscillatorNode.minFreq, OscillatorNode.maxFreq, 6, v => v)}
                        getCurvedTick   = {(val) => getFreqCurve(val, 0, 1, 6, v => 1-v)}
                        ticks           = {35}
                        onChange        = {(e) => (
                            console.log('e.target.value =', e.target.value),
                            updateNode(id, { frequency: Number(e.target.value) })
                        )}
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}
