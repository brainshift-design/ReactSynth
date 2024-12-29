import { Handle, Node, Position } from 'reactflow';
import Range from '../components/Range';

import styles from './Node.module.css';
import { audioContext, audioNodes, createAudioContext } from '../audio/audio';
import { Component, ContextType } from 'react';
import { createId } from '../util';
import Select from '../components/Select';
import { NodeContext } from './NodeContext';



interface FilterNodeProps 
{
    id: string;
    data: 
    {
        frequency: number;
        detune:    number;
        Q:         number;
        gain:      number;
        type:      string
    },
    selected: boolean
}

interface FilterNodeState {}



export default class FilterNode extends Component<FilterNodeProps, FilterNodeState>
{
    static contextType = NodeContext;
    declare context: ContextType<typeof NodeContext>;




    static create()
    {
        const node: Node =
        {
            id:    createId(),
            type: 'filter',
            data:     
            { 
                frequency: 220,
                detune:    0,
                Q:         1,
                gain:      1,
                type:     'lowpass' 
            },
            position: { x: 0, y: 0 }
        };
       
        return node;
    }
    
    
    
    componentDidMount()
    {
        const { id, data: { type } } = this.props;
        
        createAudioContext();
        const audioNode = audioContext?.createBiquadFilter();

        if (audioNode)
        {
            audioNode.type = type as BiquadFilterType;
            audioNodes.set(id, audioNode);
        }
    }



    componentWillUnmount()
    {
        const { id } = this.props;

        const audioNode = audioNodes.get(id) as BiquadFilterNode;
        
        if (audioNode)
        {
            audioNode.disconnect();
            audioNodes.delete(id);
        }
    }



    // handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    // {
    //     const { id } = this.props;
    //     const { updateNode } = this.context!;

    //     updateNode(id, { gain: Number(e.target.value) / 100 })
    // };



    render()
    {
        const { id, selected, data: { frequency, detune, Q, gain, type } } = this.props;
        const { updateNode } = this.context!;


        return (
            <div 
                className = {styles.node}
                style     = {{ outline: selected ? 'var(--node-outline-style)' : 'none' }}
                >

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

            </div>
        );
    }
}