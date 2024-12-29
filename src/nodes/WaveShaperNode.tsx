import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import Range from '../components/Range';
import Select from '../components/Select';

import styles from './Node.module.css';
import { audioContext } from '../audio/audio';
import { createDistortionCurve } from './util';
import Node, { NodeProps } from './Node';



interface WaveShaperNodeProps extends NodeProps
{
    data: 
    {
        amount:     number;
        oversample: string;
    }
}



export default class WaveShaperNode extends Node<WaveShaperNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createWaveShaper() as AudioNode;
    }



    protected initAudioNode()
    {
        const { data: { oversample } } = this.props;

        const node = this.audioNode as globalThis.WaveShaperNode;

        if (node)
        {
            node.oversample = oversample as OverSampleType;
        }
    }



    static createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                amount:      400,
                oversample: 'none' 
            },
        };
    }
    
    
    
    renderContent()
    {
        const { id, data: { amount, oversample } } = this.props;
        const { updateNode } = this.context!;


        return (
            <>
                <Handle type='target' position={Position.Left} />

                <h1>Wave Shaper</h1>

                <div className = {styles.nodeContent}>

                    <Range 
                        label    = 'Amount'
                        min      = {0}
                        max      = {1000}
                        value    = {amount}
                        onChange = {(e) => updateNode(id, { amount: Number(e.target.value), curve: createDistortionCurve(Number(e.target.value)) })}
                        />

                    <Select
                        label   = 'Oversample'
                        options =
                        {[
                            { value: 'none', label: 'None' },
                            { value: '2x',   label: '2x'   },
                            { value: '4x',   label: '4x'   }
                        ]}
                        value    = {oversample}
                        onChange = {(e) => updateNode(id, { oversample: e.target.value })}
                        />

                </div>

                <Handle type='source' position={Position.Right} />
            </>
        );
    }
}