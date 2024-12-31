import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import styles from './Node.module.css';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import { getFreqCurve, invFreq } from './util';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';



interface OscillatorNodeProps extends NodeProps
{
    data: 
    {
        frequency: number;
        type:      string;
    }
}



export default class OscillatorNode extends AudioNode<OscillatorNodeProps>
{
    static readonly minFreq = 20;
    static readonly maxFreq = 20000;



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
            node.type            = type as OscillatorType;

            node.start();
        }
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
                        onChange = {(e) => updateNode(id, { type: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label           = 'Hz'
                        min             = {OscillatorNode.minFreq}
                        max             = {OscillatorNode.maxFreq}
                        value           = {frequency}
                        getCurvedValue  = {(val) => getFreqCurve(val, OscillatorNode.minFreq, OscillatorNode.maxFreq, 6, v => v)}
                        getCurvedTick   = {(val) => getFreqCurve(val, 0, 1, 6, v => 1-v)}
                        ticks           = {35}
                        onChange        = {(e) => updateNode(id, { frequency: Number(e.target.value) })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}
