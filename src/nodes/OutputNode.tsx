import nodeStyles from './Node.module.css';
import outputNodeStyles from './OutputNode.module.css';
import { NodeProps } from './Node';
import { Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import Toggle from '../components/Toggle';



interface OutputNodeProps 
extends NodeProps
{
    data: { on: boolean; }
}



export default class OutputNode 
extends AudioNode<OutputNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.destination as globalThis.AudioNode;
    }



    override updateAudioParam(key: string, value: boolean | number)
    {
        if (key === 'on') {
            this.context.toggleAudio(value as boolean);
        } else {
            super.updateAudioParam(key, value as number);
        }
    }



    protected renderContent()
    {
        return (
            <>
                <InputHandle 
                    type       = 'target' 
                    handletype = 'audio'
                    id         = {'audio-in'} 
                    nodeid     = {this.props.id} 
                    position   = {Position.Left}
                    style      = {{ top: 'calc(50% + 59px)' }}
                />

                <h1>Output</h1>

                <div className={outputNodeStyles.speaker}></div>

                <div className={nodeStyles.nodeContent}>
                    <Toggle
                        label    = ''
                        value    = {false}
                        onChange = {(e) => this.update({ on: e.target.value === 'true' })}
                    />
                </div>
            </>
        );
    }
}
