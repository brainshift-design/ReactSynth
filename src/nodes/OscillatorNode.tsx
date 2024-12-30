import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import Select from '../components/Select';
import styles from './Node.module.css';
import { audioContext } from '../audio/audio';
import Node, { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';



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
                <h1>OSC</h1>

                * make frequency knob logarighmic, at least on a power curve

                <div className = {styles.nodeContent}>

                    <NumberKnob 
                        label           = 'FREQ'
                        min             = {20}
                        max             = {20000}
                        value           = {frequency}
                        padding         = {5}
                        ticks           = {19}
                        tickSize        = {3}
                        tickDistance    = {27}
                        adjustTickX     = {-1}
                        adjustTickAngle = {0.05}
                        onChange        = {(e) => updateNode(id, { frequency: Number(e.target.value) })}
                        />

                    <Select
                        label   = 'FORM'
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
