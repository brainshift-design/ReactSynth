import nodeStyles from './Node.module.css';
import outputNodeStyles from './OutputNode.module.css';
import { NodeProps } from './Node';
import { Position, Node as ReactFlowNode } from 'reactflow';
import { audioContext } from '../audio/audio';
import AudioNode from './AudioNode';
import InputHandle from '../components/InputHandle';
import Toggle from '../components/Toggle';

interface OutputNodeProps extends NodeProps {
    data: { on: boolean };
}

export default class OutputNode extends AudioNode<OutputNodeProps> {
    protected createAudioNode() {
        return audioContext?.destination as globalThis.AudioNode;
    }

    componentDidMount() {
        super.componentDidMount();
    }

    override updateAudioParam(key: string, value: number | string) {
        if (key === 'on') {
            const shouldTurnOn = String(value) === 'true';
            if (shouldTurnOn && audioContext?.state === 'suspended') {
                audioContext.resume();
            }
            this.context.toggleAudio(shouldTurnOn);
        } else {
            super.updateAudioParam(key, value);
        }
    }

    protected renderContent() {
        const {
            data: { on },
        } = this.props;

        return (
            <>
                <InputHandle
                    type="target"
                    handletype="audio"
                    id={'audio-in'}
                    nodeid={this.props.id}
                    position={Position.Left}
                    style={{ top: 'calc(50% + 59px)' }}
                />

                <h1>Output</h1>

                <div className={outputNodeStyles.speaker}></div>

                <div className={nodeStyles.nodeContent}>
                    <Toggle
                        label=""
                        value={on}
                        onChange={(e) => {
                            const newValue = e.target.value === 'true';
                            this.update({ on: newValue });
                        }}
                    />
                </div>
            </>
        );
    }

    static override createReactFlowNode(): ReactFlowNode {
        const baseNode = super.createReactFlowNode();
        return {
            ...baseNode,
            id: '_output',
            data: { on: false },
        };
    }

    override update(data: Partial<OutputNodeProps['data']>) {
        if ('on' in data && data.on !== undefined) {
            this.updateAudioParam('on', String(data.on));
        }
        super.update(data);
    }
}
