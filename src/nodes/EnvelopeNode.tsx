import styles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import NumberKnob from '../components/NumberKnob';
import Node, { NodeProps } from './Node';
import OutputHandle from '../components/OutputHandle';
import InputHandle from '../components/InputHandle';

interface EnvelopeNodeProps extends NodeProps {
    data: {
        attack: number;
        decay: number;
        sustain: number;
        release: number;
    };
}

export default class EnvelopeNode extends Node<EnvelopeNodeProps> {
    static override createReactFlowNode(): ReactFlowNode {
        return {
            ...super.createReactFlowNode(),
            data: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.3,
                release: 0.5,
            },
        };
    }

    renderContent() {
        const {
            data: { attack, decay, sustain, release },
        } = this.props;

        return (
            <>
                <InputHandle
                    type="target"
                    handletype="control"
                    id={'control-in'}
                    nodeid={this.props.id}
                    position={Position.Left}
                />

                <h1>Envelope</h1>

                <div className={styles.nodeContent}>
                    <NumberKnob
                        label="Att|sec"
                        min={0}
                        max={10}
                        decimals={1}
                        value={attack}
                        ticks={11}
                        onChange={(e) => this.update({ attack: Number(e.target.value) })}
                    />

                    <NumberKnob
                        label="Dec|sec"
                        min={0}
                        max={10}
                        decimals={1}
                        value={decay}
                        ticks={11}
                        onChange={(e) => this.update({ decay: Number(e.target.value) })}
                    />

                    <NumberKnob
                        label="Sus|%"
                        min={0}
                        max={100}
                        value={sustain * 100}
                        ticks={11}
                        onChange={(e) => this.update({ sustain: Number(e.target.value) / 100 })}
                    />

                    <NumberKnob
                        label="Rel|sec"
                        min={0}
                        max={10}
                        decimals={1}
                        value={release}
                        ticks={11}
                        onChange={(e) => this.update({ release: Number(e.target.value) })}
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
