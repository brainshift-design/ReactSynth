import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';
import BooleanToggle from '../components/Toggle';
import { Tau } from '../util';



interface ConvolverNodeProps extends NodeProps
{
    data: 
    {
        duration: number;
        decay:    number;
        metallic: number;
        reverse:  boolean;
    }
}



export default class ReverbNode extends AudioNode<ConvolverNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createConvolver() as globalThis.AudioNode;
    }



    override updateAudioParam(key: string, value: any) 
    {
        super.updateAudioParam(key, value);
        
        
        const { data } = this.props;
        const node = this.audioNode as globalThis.ConvolverNode;

        const newData = { ...data, [key]: value };

        const { duration, decay, metallic, reverse } = newData;

        if (node)
        {
            if (!node.buffer)
            {
                const sampleRate  = audioContext?.sampleRate!;
                const totalLength = Math.floor(sampleRate! * 20);

                node.buffer = audioContext?.createBuffer(1, totalLength, sampleRate)!;
            }

            const buffer = node.buffer;
            updateReverbImpulseResponse(buffer, duration, decay, metallic, reverse);
            node.buffer = buffer;
        }
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                duration: 1,
                decay:    5,
                metallic: 0,
                reverse:  false
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { duration, decay, metallic, reverse } } = this.props;


        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />

                <h1>Reverb</h1>

                <div className = {nodeStyles.nodeContent}>

                    <NumberKnob 
                        label      = 'Dur|sec'
                        min        = {0}
                        max        = {20}
                        decimals   = {1}
                        value      = {duration}
                        ticks      = {11}
                        onChange   = {(e) => this.update({ duration: Number(e.target.value) })}
                        knobColor  = 'var(--color-node-highlight)'
                        valueColor = 'var(--color-node-highlight-value)'
                    />

                    <NumberKnob 
                        label    = 'Decay'
                        min      = {0.1}
                        max      = {10}
                        decimals = {1}
                        value    = {decay}
                        ticks    = {11}
                        onChange = {(e) => this.update({ decay: Number(e.target.value) })}
                    />

                    <NumberKnob 
                        label    = 'Metal|%'
                        min      = {0}
                        max      = {100}
                        value    = {metallic * 100}
                        ticks    = {11}
                        onChange = {(e) => this.update({ metallic: Number(e.target.value) / 100 })}
                    />

                    <BooleanToggle
                        label    = 'Rev'
                        value    = {reverse}
                        onChange = {(e) => this.update({ reverse: e.target.value === 'true' })}
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



function updateReverbImpulseResponse(
    buffer:   AudioBuffer,
    duration: number,
    decay:    number,
    metallic: number,
    reverse:  boolean
) {
    const sampleRate  = buffer.sampleRate;
    const channelData = buffer.getChannelData(0);

    const length      = Math.floor(sampleRate * duration);
    const totalLength = Math.floor(sampleRate * 20);


    for (let i = 0; i < length; i++) 
    {
        // optionally reverse the index to fade in instead of out
        const idx = reverse ? length - i : i;

        // base white noise is used to affect all possible frequencies,
        // with exponential decay
        const base = (Math.random()*2 - 1) * (1 - idx/length)**Math.max(1, (decay**2));

        // optionally modulate amplitude with a sine wave,
        // which gives a subtle ringing effect
        const metallicModFreq = 2000;
        const mod = 1 + metallic * Math.sin((Tau * metallicModFreq * i) / sampleRate);

        channelData[i] = base * mod;
    }

    for (let i = length; i < totalLength; i++)
        channelData[i] = 0;
}
