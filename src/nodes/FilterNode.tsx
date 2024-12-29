import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import Range from '../components/Range';
import styles from './Node.module.css';
import { audioContext } from '../audio/audio';
import Select from '../components/Select';
import Node, { NodeProps } from './Node';



interface FilterNodeProps extends NodeProps
{
    data: 
    {
        frequency: number;
        detune:    number;
        Q:         number;
        gain:      number;
        type:      string
    }
}



export default class FilterNode extends Node<FilterNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createBiquadFilter() as AudioNode;
    }



    protected initAudioNode()
    {
        const { data: { frequency, detune, Q, gain, type } } = this.props;

        const node = this.audioNode as globalThis.BiquadFilterNode;

        if (node)
        {
            node.frequency.value = frequency;
            node.detune   .value = detune;
            node.Q        .value = Q;
            node.gain     .value = gain;
            node.type            = type as BiquadFilterType;
        }
    }



    static createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                frequency: 220,
                detune:    0,
                Q:         1,
                gain:      1,
                type:     'lowpass' 
            },
        };
    }
    
    
    
    renderContent()
    {
        const { id, data: { frequency, detune, Q, gain, type } } = this.props;
        const { updateNode } = this.context!;


        return (
            <>
                <Handle type='target' position={Position.Left} />

                <h1>Filter</h1>

                <div className={styles.nodeContent}>

                    <Range 
                        label    = 'Frequency'
                        min      = {10}
                        max      = {20000}
                        value    = {frequency}
                        suffix   = 'Hz'
                        onChange = {(e) => updateNode(id, { frequency: e.target.value })}
                        />

                    <Range 
                        label    = 'Detune'
                        min      = {-100}
                        max      = { 100}
                        value    = {detune}
                        suffix   = '¢'
                        onChange = {(e) => updateNode(id, { detune: e.target.value })}
                        />

                    <Range 
                        label    = 'Quality'
                        min      = {0}
                        max      = {30}
                        value    = {Q}
                        onChange = {(e) => updateNode(id, { Q: Number(e.target.value) })}
                        />

                    <Range 
                        label    = 'Gain'
                        min      = {0}
                        max      = {100}
                        value    = {gain}
                        onChange = {(e) => updateNode(id, { gain: Number(e.target.value) })}
                        />

                    <Select
                        label   = 'Type'
                        options =
                        {[
                            { value: 'lowpass',   label: 'Low Pass'   },
                            { value: 'highpass',  label: 'High Pass'  },
                            { value: 'bandpass',  label: 'Band Pass'  },
                            { value: 'lowshelf',  label: 'Low Shelf'  },
                            { value: 'highshelf', label: 'High Shelf' },
                            { value: 'peaking',   label: 'Peaking'    },
                            { value: 'notch',     label: 'Notch'      },
                            { value: 'allpass',   label: 'All Pass'   }
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