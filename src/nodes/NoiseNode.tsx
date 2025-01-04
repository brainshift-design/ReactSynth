import nodeStyles from './Node.module.css';
import { NodeProps, Position } from "reactflow";
import { audioContext } from "../audio/audio";
import AudioNode from "./AudioNode";
import OutputHandle from '../components/OutputHandle';



export default class NoiseNode 
extends AudioNode<NodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.createBufferSource() as globalThis.AudioBufferSourceNode;
    }



    protected override initAudioNode()
    {
        const node = this.audioNode as globalThis.AudioBufferSourceNode;

        if (node)
        {
            node.buffer = createNoiseBuffer(5);
            node.loop   = true;
            
            node.start();
        }
    }



    renderContent()
    {
        return (
            <>
                <h1>Noise</h1>

                <div className={nodeStyles.nodeContent}>

                    <div 
                        className ={nodeStyles.checkers}
                        style     = 
                        {{
                            width:  32,
                            height: 32,
                            margin: '8px 18px 18px 18px'
                        }}>

                    </div>

                </div>

                <OutputHandle 
                    type     = 'source' 
                    position = {Position.Right} 
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />
            </>
        );
    }
}



function createNoiseBuffer(duration: number)
{
    const sampleRate  = audioContext?.sampleRate;
    const bufferSize  = sampleRate! * duration;

    const buffer      = audioContext?.createBuffer(1, bufferSize, sampleRate!);
    const channelData = buffer?.getChannelData(0);

    for (let i = 0; i < bufferSize; i++)
        channelData![i] = Math.random() * 2 - 1;

    return buffer!;
}