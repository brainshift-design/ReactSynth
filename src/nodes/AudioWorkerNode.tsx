import AudioNode from './AudioNode';
import { NodeProps } from './Node';

export default abstract class AudioWorkerNode<
    T extends NodeProps,
    WorkerMessage = unknown,
> extends AudioNode<T> {
    protected worker!: Worker;
    protected requestId: number = -1;

    constructor(props: T) {
        super(props);

        this.initWorker();
    }

    protected abstract initWorker(): void;

    protected postWorkerMessage(data: WorkerMessage) {
        const requestId = ++this.requestId;

        this.worker.postMessage({
            requestId,
            ...data,
        });
    }
}
