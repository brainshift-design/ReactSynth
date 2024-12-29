import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';
import styles from './Node.module.css';
import { audioContext } from '../audio/audio';
import Node, { NodeProps } from './Node';



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
                frequency: 440, 
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

                <div className = {styles.nodeContent}>

                    <Range 
                        label    = 'Frequency'
                        min      = {10}
                        max      = {1000}
                        value    = {frequency}
                        suffix   = 'Hz'
                        onChange = {(e) => updateNode(id, { frequency: Number(e.target.value) })}
                        />

                    <Select
                        label   = 'Waveform'
                        options =
                        {[
                            { value: 'sine',     label: 'Sine'     },
                            { value: 'triangle', label: 'Triangle' },
                            { value: 'sawtooth', label: 'Sawtooth' },
                            { value: 'square',   label: 'Square'   }
                        ]}
                        value    = {type}
                        onChange = {(e) => updateNode(id, { type: e.target.value })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}
