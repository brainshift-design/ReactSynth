import nodeStyles from './Node.module.css';
import { Node as ReactFlowNode, Position } from 'reactflow';
import { audioContext } from '../audio/audio';
import { NodeProps } from './Node';
import NumberKnob from '../components/NumberKnob';
import { freqCurvePower, getValueCurve, invValueCurve } from './util';
import SelectKnob from '../components/SelectKnob';
import AudioNode from './AudioNode';
import { Tau } from '../util';
import OutputHandle from '../components/OutputHandle';
import InputHandle from '../components/InputHandle';
import { Connection } from './connections';

interface OscillatorNodeProps extends NodeProps {
    data: {
        frequency: number;
        type: number;
        isControlled?: boolean;
        controlInput?: Connection;
    };
}

export default class OscillatorNode extends AudioNode<OscillatorNodeProps> {
    static readonly minFreq = 20;
    static readonly maxFreq = 20000;

    static readonly oscillatorTypes = [
        { value: 'sine', label: 'Sine' },
        { value: 'triangle', label: 'Tri' },
        { value: 'sawtooth', label: 'Saw' },
        { value: 'square', label: 'Sqr' },
    ];

    private oscillator: globalThis.OscillatorNode | null = null;
    private gainNode: globalThis.GainNode | null = null;

    protected createAudioNode(): globalThis.AudioNode | null {
        if (!audioContext) return null;

        // Create the gain node first - this will be our main audio node
        const gainNode = audioContext.createGain();
        this.gainNode = gainNode;

        // Create and configure the oscillator
        const oscillator = audioContext.createOscillator();
        this.oscillator = oscillator;

        const { frequency, type } = this.props.data;
        oscillator.frequency.value = frequency;
        oscillator.type = OscillatorNode.oscillatorTypes[type].value as OscillatorType;

        // Connect oscillator to gain
        oscillator.connect(gainNode);

        // Start with gain at 1 (will be set to 0 if control input is connected)
        gainNode.gain.value = 1;

        // Start the oscillator - it will keep running
        try {
            oscillator.start();
        } catch (error) {
            console.error('Failed to start oscillator:', error);
        }

        // Return the gain node as our main audio node
        return gainNode;
    }

    override updateAudioParam(key: string, value: number | string) {
        if (key === 'type' && this.oscillator) {
            const typeValue =
                OscillatorNode.oscillatorTypes.find((_, i) => i === Number(value))?.value ?? 'sine';
            this.oscillator.type = typeValue as OscillatorType;
        } else if (key === 'frequency' && this.oscillator) {
            this.oscillator.frequency.value = Number(value);
        }
    }

    componentDidUpdate(prevProps: OscillatorNodeProps) {
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
        // Stop and disconnect oscillator
        if (this.oscillator) {
            try {
                this.oscillator.stop();
            } catch (error) {
                console.error('Failed to stop oscillator:', error);
            }
            this.oscillator.disconnect();
            this.oscillator = null;
        }
        // Let parent handle the gain node cleanup
        super.componentWillUnmount();
        this.gainNode = null;
    }

    static override createReactFlowNode(): ReactFlowNode {
        return {
            ...super.createReactFlowNode(),
            data: {
                frequency: invValueCurve(440),
                type: 0,
                isControlled: false,
            },
        };
    }

    renderContent() {
        const {
            data: { frequency, type },
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

                <h1>Oscillator</h1>

                <div className={nodeStyles.nodeContent}>
                    <SelectKnob
                        label="Form"
                        options={OscillatorNode.oscillatorTypes}
                        value={type}
                        onChange={(e) => this.update({ type: Number(e.target.value) })}
                        minAngle={(Tau * -5) / 32}
                        maxAngle={(Tau * 5) / 32}
                    />

                    <NumberKnob
                        label="Freq|Hz"
                        min={1200}
                        max={OscillatorNode.maxFreq}
                        value={frequency}
                        getCurvedValue={(val) =>
                            getValueCurve(
                                val,
                                OscillatorNode.minFreq,
                                OscillatorNode.maxFreq,
                                freqCurvePower,
                                (v) => v
                            )
                        }
                        getCurvedTick={(val) =>
                            getValueCurve(val, 0, 1, freqCurvePower, (v) => 1 - v)
                        }
                        ticks={49}
                        onChange={(e) => this.update({ frequency: Number(e.target.value) })}
                        sensitivity={0.001}
                        knobColor="var(--color-node-highlight)"
                        valueColor="var(--color-node-highlight-value)"
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
