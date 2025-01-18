import nodeStyles from './Node.module.css';
import { NodeProps, Position } from 'reactflow';
import OutputHandle from '../components/OutputHandle';
import ParamButton from '../components/ParamButton';
import Node from './Node';
import { Connection } from './connections';

interface TriggerNodeState {
    isPlaying: boolean;
}

interface TriggerNodeProps extends NodeProps {
    data: {
        controlOutput?: Connection;
        noteOffHandler?: () => void;
    };
}

export default class TriggerNode extends Node<TriggerNodeProps, TriggerNodeState> {
    constructor(props: TriggerNodeProps) {
        super(props);

        this.state = { isPlaying: false };

        this.startNote = this.startNote.bind(this);
        this.stopNote = this.stopNote.bind(this);
    }

    startNote() {
        this.setState({ isPlaying: true });

        const { controlOutput } = this.props.data;

        if (controlOutput?.control) {
            controlOutput.control('note-on');
        }
    }

    stopNote() {
        this.setState({ isPlaying: false });

        const { controlOutput } = this.props.data;

        if (controlOutput?.control) {
            controlOutput.control('note-off');
        }
    }

    renderContent() {
        return (
            <>
                <h1>Trigger</h1>

                <div className={nodeStyles.nodeContent}>
                    <ParamButton
                        onPointerDown={this.startNote}
                        onPointerUp={this.stopNote}
                        onPointerLeave={this.stopNote}
                        style={{
                            margin: '8px 18px 18px 18px',
                        }}
                    />
                </div>

                <OutputHandle
                    type="source"
                    handletype="control"
                    id={'control-out'}
                    position={Position.Right}
                    nodeid={this.props.id}
                    style={{ top: 'calc(50% + 7px)' }}
                />
            </>
        );
    }
}
