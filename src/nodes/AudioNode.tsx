import { audioNodes, createAudioContext } from '../audio/audio';
import Node, { NodeProps } from './Node';
import { Connection } from './connections';

interface AudioNodeData {
    [key: string]: number | string | boolean | undefined | object;
}

export default abstract class AudioNode<T extends NodeProps = NodeProps> extends Node<T> {
    protected audioNode: globalThis.AudioNode | null = null;

    protected abstract createAudioNode(): globalThis.AudioNode | null;
    protected initAudioNode() {}

    componentDidMount() {
        createAudioContext();

        this.audioNode = this.createAudioNode();

        if (!this.audioNode) throw new Error('Failed to create audio node');

        const { id } = this.props;

        if (this.audioNode) {
            this.initAudioNode();
            audioNodes.set(id, this.audioNode);
        }
    }

    componentWillUnmount() {
        if (!this.audioNode)
            throw new Error('Attempting to unmount a node without a valid audio node');

        const { id } = this.props;

        if (
            this.audioNode instanceof OscillatorNode ||
            this.audioNode instanceof AudioBufferSourceNode
        ) {
            this.audioNode.stop();
        }

        this.audioNode.disconnect();

        audioNodes.delete(id);
    }

    override update(data: Partial<T['data']>) {
        super.update(data);
        this.updateAudio(data as unknown as AudioNodeData);
    }

    updateAudio(data: AudioNodeData) {
        for (const [key, value] of Object.entries(data)) {
            if (typeof value !== 'number' && typeof value !== 'string') continue;

            // Try to get the parameter as an AudioParam
            const param =
                this.audioNode && key in this.audioNode
                    ? (this.audioNode as unknown as Record<string, AudioParam>)[key]
                    : null;

            if (param instanceof AudioParam && typeof value === 'number') {
                param.value = value;
            } else {
                this.updateAudioParam(key, value);
            }
        }
    }

    updateAudioParam(key: string, value: number | string) {
        if (this.audioNode && key in this.audioNode) {
            (this.audioNode as unknown as Record<string, number | string>)[key] = value;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleControlInput(_connection: Connection) {
        // Default implementation does nothing
    }

    handleControlDisconnect() {
        // Default implementation does nothing
    }
}
