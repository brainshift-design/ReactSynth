import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import AudioWorkerNode from './AudioWorkerNode';
import InputHandle from '../components/InputHandle';
import OutputHandle from '../components/OutputHandle';
import Toggle from '../components/Toggle';
import ReverbNodeWorker from './ReverbNode.worker?worker';
import { ReverbNodeWorkerResponse } from './ReverbNode.worker';

interface ConvolverNodeProps extends NodeProps {
    data: {
        duration: number;
        decay: number;
        metallic: number;
        reverse: boolean;
    };
}

export default class ReverbNode extends AudioWorkerNode<ConvolverNodeProps> {
    protected createAudioNode() {
        return audioContext?.createConvolver() as globalThis.AudioNode;
    }

    protected override initAudioNode() {
        const { data } = this.props;
        const node = this.audioNode as globalThis.ConvolverNode;
        const { duration, decay, metallic, reverse } = data;

        if (node && audioContext) {
            const sampleRate = audioContext.sampleRate;
            const bufferLength = Math.floor(sampleRate * 20);
            node.buffer = audioContext.createBuffer(1, bufferLength, sampleRate);

            this.postWorkerMessage({
                bufferLength,
                sampleRate,
                duration,
                decay,
                metallic,
                reverse,
            });
        }
    }

    override updateAudioParam(key: string, value: string | number) {
        super.updateAudioParam(key, value);

        const { data } = this.props;
        const node = this.audioNode as globalThis.ConvolverNode;

        const newData = { ...data, [key]: value };
        const { duration, decay, metallic, reverse } = newData;

        if (node) {
            if (!audioContext) return;
            const sampleRate = audioContext.sampleRate;
            const bufferLength = Math.floor(sampleRate * 20);

            if (!node.buffer) node.buffer = audioContext.createBuffer(1, bufferLength, sampleRate);

            this.postWorkerMessage({
                bufferLength,
                sampleRate,
                duration,
                decay,
                metallic,
                reverse,
            });
        }
    }

    protected initWorker() {
        this.worker = new ReverbNodeWorker();
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
    }

    private handleWorkerMessage(event: MessageEvent<ReverbNodeWorkerResponse>) {
        const { requestId, channelData } = event.data;

        if (requestId != this.requestId) return;

        const node = this.audioNode as globalThis.ConvolverNode;

        if (node && node.buffer) {
            const buffer = node.buffer;
            buffer.copyToChannel(channelData, 0);
            node.buffer = buffer;
        }
    }

    static override createReactFlowNode(): ReactFlowNode {
        return {
            ...super.createReactFlowNode(),
            data: {
                duration: 1,
                decay: 5,
                metallic: 0,
                reverse: false,
            },
        };
    }

    renderContent() {
        const {
            data: { duration, decay, metallic, reverse },
        } = this.props;

        return (
            <>
                <InputHandle
                    type="target"
                    handletype="audio"
                    id={'audio-in'}
                    nodeid={this.props.id}
                    position={Position.Left}
                />

                <h1>Reverb</h1>

                <div className={nodeStyles.nodeContent}>
                    <NumberKnob
                        label="Dur|sec"
                        min={0}
                        max={20}
                        decimals={1}
                        value={duration}
                        ticks={11}
                        onChange={(e) => this.update({ duration: Number(e.target.value) })}
                        knobColor="var(--color-node-highlight)"
                        valueColor="var(--color-node-highlight-value)"
                    />

                    <NumberKnob
                        label="Decay"
                        min={0.1}
                        max={10}
                        decimals={1}
                        value={decay}
                        ticks={11}
                        onChange={(e) => this.update({ decay: Number(e.target.value) })}
                    />

                    <NumberKnob
                        label="Metal|%"
                        min={0}
                        max={100}
                        value={metallic * 100}
                        ticks={11}
                        onChange={(e) => this.update({ metallic: Number(e.target.value) / 100 })}
                    />

                    <Toggle
                        label="Rev"
                        value={reverse}
                        onChange={(e) => this.update({ reverse: e.target.value === 'true' })}
                    />
                </div>

                <OutputHandle
                    type="source"
                    handletype="audio"
                    id={'audio-out'}
                    position={Position.Right}
                    nodeid={this.props.id}
                />
            </>
        );
    }
}
