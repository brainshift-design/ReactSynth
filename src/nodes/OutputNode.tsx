import nodeStyles from './Node.module.css';
import outputNodeStyles from './OutputNode.module.css';
import { NodeProps } from './Node';
import { Handle, Position } from 'reactflow';
import { audioContext, audioIsRunning } from '../audio/audio';
import Button from '../components/Button';
import AudioNode from './AudioNode';



export default class OutputNode extends AudioNode<NodeProps>
{
    protected createAudioNode()
    {
        return audioContext?.destination as globalThis.AudioNode;
    }



    protected renderContent()
    {
        const { toggleAudio } = this.context;

        return (
            <>
                <Handle type='target' position={Position.Left} />

                <h1>Output</h1>

                <div className={outputNodeStyles.speaker}></div>

                <div className={nodeStyles.nodeContent}>
                    <Button
                        style   = {{ margin: 'auto'}}
                        onClick = {() => toggleAudio()}>
                        { 
                            audioIsRunning()
                                ? (<span role='img' aria-label='mute'  ><span className='material-symbols-outlined'>volume_up</span></span>) 
                                : (<span role='img' aria-label='unmute'><span className='material-symbols-outlined'>no_sound </span></span>)
                        }                
                    </Button>
                </div>
            </>
        );
    }
}
