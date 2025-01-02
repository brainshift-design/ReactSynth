import styles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import NumberKnob from '../components/NumberKnob';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';



interface CompressorNodeProps extends NodeProps
{
    data: 
    {
        threshold: number;
        knee:      number;
        ratio:     number;
        reduction: number;
        attack:    number;
        release:   number;
    }
}



export interface CompressorType 
{ 
    id:   string; 
    type: number; 
}



export default class CompressorNode extends AudioNode<CompressorNodeProps>
{
    static readonly minFreq = 20;
    static readonly maxFreq = 20000;



    protected createAudioNode()
    {
        return audioContext?.createDynamicsCompressor() as globalThis.AudioNode;
    }



    protected override initAudioNode()
    {
        const { data: { threshold, knee, ratio, /*reduction,*/ attack, release } } = this.props;

        const node = this.audioNode as globalThis.DynamicsCompressorNode;

        if (node)
        {
            node.threshold.value = threshold;
            node.knee     .value = knee;
            node.ratio    .value = ratio;
            node.attack   .value = attack;
            node.release  .value = release;
        }
    }



    static override createReactFlowNode(): ReactFlowNode
    {
        return { 
            ...super.createReactFlowNode(),
            data:     
            { 
                threshold: -24,
                knee:       30,
                ratio:      12,
                attack:     0.01,
                release:    0.25
            },
        };
    }
    
    
    
    renderContent()
    {
        const { data: { threshold, knee, ratio, /*reduction,*/ attack, release } } = this.props;

        
        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                />

                <h1>Compressor</h1>

                <div className={styles.nodeContent}>

                    <NumberKnob 
                        label     = 'Thrsh|dB'
                        min       = {-100}
                        max       = {0}
                        value     = {threshold}
                        ticks     = {11}
                        onChange  = {(e) => this.update({ threshold: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label     = 'Knee|dB'
                        min       = {0}
                        max       = {40}
                        value     = {knee}
                        forcePlus = {true}
                        ticks     = {9}
                        onChange  = {(e) => this.update({ knee: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label     = 'Ratio'
                        min       = { 1}
                        max       = {20}
                        value     = {ratio}
                        ticks     = {13}
                        onChange  = {(e) => this.update({ ratio: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label     = 'Att|sec'
                        min       = {0}
                        max       = {1}
                        decimals  = {2}
                        value     = {attack}
                        ticks     = {11}
                        onChange  = {(e) => this.update({ attack: Number(e.target.value) })}
                        />

                    <NumberKnob 
                        label     = 'Rel|sec'
                        min       = {0}
                        max       = {1}
                        decimals  = {2}
                        value     = {release}
                        ticks     = {11}
                        onChange  = {(e) => this.update({ release: Number(e.target.value) })}
                        />


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