import nodeStyles from './Node.module.css';
import outputNodeStyles from './OutputNode.module.css';
import { NodeProps } from './Node';
import { Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import Toggle from '../components/Toggle';



interface OutputNodeProps extends NodeProps
{
    data: { on: boolean; }
}



export default class OutputNode extends AudioNode<OutputNodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.destination as globalThis.AudioNode;
    }



    override updateAudioParam(key: string, value: any)
    {
        super.updateAudioParam(key, value);


        const { toggleAudio } = this.context;

        if (key == 'on')
            toggleAudio(value);
    }



    protected renderContent()
    {
        return (
            <>
                <InputHandle 
                    type     = 'target' 
                    position = {Position.Left}
                    id       = {'audio-in'} 
                    nodeid   = {this.props.id} 
                    style    =
                    {{
                        top: 'calc(50% - 14px)'
                    }}
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
