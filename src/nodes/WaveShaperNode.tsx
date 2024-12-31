import nodeStyles from './Node.module.css';
import { Handle, Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { createDistortionCurve } from './util';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';



interface WaveShaperNodeProps extends NodeProps
{
    data: 
    {
        amount:     number;
        oversample: string;
    }
}



export default class WaveShaperNode extends AudioNode<WaveShaperNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createWaveShaper() as globalThis.AudioNode;
    }



    protected override initAudioNode()
    {
        const { data: { oversample } } = this.props;

        const node = this.audioNode as globalThis.WaveShaperNode;

        if (node)
        {
            node.oversample = oversample as OverSampleType;
        }
    }



    static override createReactFlowNode(): ReactFlowNode
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

                <div className = {nodeStyles.nodeContent}>

                    <NumberKnob 
                        label    = 'Amt'
                        min      = {0}
                        max      = {1000}
                        value    = {amount}
                        padding  = {3}
                        ticks    = {11}
                        onChange = {(e) => updateNode(id, { amount: Number(e.target.value), curve: createDistortionCurve(Number(e.target.value)) })}
                        />

                    <SelectKnob
                        label   = 'Over'
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