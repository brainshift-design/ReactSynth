import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import AudioNode from './AudioNode';
import OutputHandle from '../components/OutputHandle';
import InputHandle from '../components/InputHandle';
import { NodeProps } from './Node';
import { Connection } from './connections';

interface NoiseNodeProps extends NodeProps {
    data: {
        isControlled?: boolean;
        controlInput?: Connection;
    };
}

export default class NoiseNode extends AudioNode<NoiseNodeProps> {
    private sourceNode: globalThis.AudioBufferSourceNode | null = null;
    private gainNode: globalThis.GainNode | null = null;

    protected createAudioNode() {
        if (!audioContext) return null;

        // Create the gain node first - this will be our main audio node
        const gainNode = audioContext.createGain();
        this.gainNode = gainNode;

        // Create and configure the source node
        const sourceNode = audioContext.createBufferSource();
        this.sourceNode = sourceNode;

        sourceNode.buffer = createNoiseBuffer(5);
        sourceNode.loop = true;

        // Connect source to gain
        sourceNode.connect(gainNode);

        // Start with gain at 1 (will be set to 0 if control input is connected)
        gainNode.gain.value = 1;

        // Start the source node
        try {
            sourceNode.start();
        } catch (error) {
            console.error('Failed to start noise source:', error);
        }

        // Return the gain node as our main audio node
        return gainNode;
    }

    componentDidUpdate(prevProps: NoiseNodeProps) {
        const {
            data: { controlInput },
        } = this.props;
        const {
            data: { controlInput: prevControlInput },
        } = prevProps;

        if (controlInput !== prevControlInput) {
            if (!controlInput) {
                // Control input was disconnected - set gain back to 1
                if (this.gainNode && audioContext) {
                    this.gainNode.gain.setValueAtTime(1, audioContext.currentTime);
                }
                return;
            }

            if (controlInput.type === 'control') {
                if (this.gainNode && audioContext) {
                    this.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                }

                // Handle control commands
                controlInput.control = (command) => {
                    if (!this.gainNode || !audioContext) return;

                    switch (command) {
                        case 'note-on':
                            this.gainNode.gain.setValueAtTime(1, audioContext.currentTime);
                            break;

                        case 'note-off':
                            this.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                            break;
                    }
                };
            }
        }
    }

    componentWillUnmount() {
        // Stop and disconnect source node
        if (this.sourceNode) {
            try {
                this.sourceNode.stop();
            } catch (error) {
                console.error('Failed to stop noise source:', error);
            }
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }
        // Let parent handle the gain node cleanup
        super.componentWillUnmount();
        this.gainNode = null;
    }

    static override createReactFlowNode(): ReactFlowNode {
        return {
            ...super.createReactFlowNode(),
            data: {
                isControlled: false,
            },
        };
    }

    renderContent() {
        return (
            <>
                <InputHandle
                    type="target"
                    handletype="control"
                    id={'control-in'}
                    nodeid={this.props.id}
                    position={Position.Left}
                    style={{ top: 'calc(50% + 6px)' }}
                />

                <h1>Noise</h1>

                <div className={nodeStyles.nodeContent}>
                    <div
                        className={nodeStyles.checkers}
                        style={{
                            width: 48,
                            height: 48,
                            margin: '8px 18px 18px 18px',
                            borderRadius: '50%',
                        }}
                    ></div>
                </div>

                <OutputHandle
                    type="source"
                    handletype="audio"
                    id={'audio-out'}
                    position={Position.Right}
                    nodeid={this.props.id}
                    style={{ top: 'calc(50% + 6px)' }}
                />
            </>
        );
    }
}

function createNoiseBuffer(duration: number) {
    if (!audioContext) return null;

    const sampleRate = audioContext.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    return buffer;
}
