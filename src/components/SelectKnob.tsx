import knobStyles from './Knob.module.css';
import paramStyles from '../parameters/Parameter.module.css';
import {
    ChangeEvent,
    ChangeEventHandler,
    CSSProperties,
    PointerEvent as ReactPointerEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Tau } from '../util';

interface SelectKnobProps {
    label: string;
    value: number;
    options: { value: string; label: string }[];
    minAngle?: number;
    maxAngle?: number;
    knobColor?: string;
    valueColor?: string;
    tickSize?: number;
    tickDistance?: number;
    adjustTickX?: number;
    adjustTickY?: number;
    adjustTickAngle?: number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function SelectKnob({
    label,
    value,
    options,
    minAngle = (Tau * -3) / 8,
    maxAngle = (Tau * 3) / 8,
    knobColor = '#f4f3f1',
    valueColor = 'var(--color-node-value)',
    tickSize = 3,
    tickDistance = 27,
    adjustTickX = -1, // these are for manual
    adjustTickY = 0, // adjustment of ticks
    adjustTickAngle = 0.05, // because of CSS pixel grid issues
    onChange,
}: SelectKnobProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);

    const [knobValue, setKnobValue] = useState(value);
    const [oldValue, setOldValue] = useState(value);

    const dragState = useRef({
        isDragging: false,
        startX: 0,
        startValue: 0,
    });

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (onChangeRef.current && knobValue != oldValue) {
            onChangeRef.current({
                target: { value: knobValue.toString() },
            } as ChangeEvent<HTMLInputElement>);
        }

        setOldValue(knobValue);
    }, [knobValue, oldValue]);

    const onPointerMove = useCallback(
        (e: globalThis.PointerEvent) => {
            if (!dragState.current.isDragging) return;

            const delta = (e.clientX - dragState.current.startX) * 0.01;

            const newValue = Math.min(
                Math.max(0, Math.round(dragState.current.startValue + delta * options.length)),
                options.length - 1
            );

            setKnobValue(newValue);
        },
        [options.length]
    );

    const onPointerUp = useCallback(
        (e: globalThis.PointerEvent) => {
            dragState.current.isDragging = false;

            globalThis.removeEventListener('pointermove', onPointerMove);
            globalThis.removeEventListener('pointerup', onPointerUp);

            inputRef.current?.releasePointerCapture(e.pointerId);
        },
        [onPointerMove]
    );

    const onPointerDown = useCallback(
        (e: ReactPointerEvent<HTMLInputElement>) => {
            if (e.button != 0) return;

            e.preventDefault();

            dragState.current = {
                isDragging: true,
                startX: e.clientX,
                startValue: knobValue,
            };

            globalThis.addEventListener('pointermove', onPointerMove);
            globalThis.addEventListener('pointerup', onPointerUp);

            inputRef.current?.setPointerCapture(e.pointerId);
        },
        [knobValue, onPointerMove, onPointerUp]
    );

    const valueAngle = minAngle + (knobValue / (options.length - 1)) * (maxAngle - minAngle);

    const nTicks = options.length;

    const tickAngle = (index: number) =>
        minAngle + (index / (nTicks - 1)) * (maxAngle - minAngle) + adjustTickAngle;

    const [name, unit] = label.split('|');

    return (
        <div
            className={`${paramStyles.parameter} ${knobStyles.knobContainer}`}
            data-knob-color={knobColor}
            data-value-color={valueColor}
            style={
                {
                    '--knob-color': knobColor,
                    '--knob-value-color': valueColor,
                } as CSSProperties
            }
        >
            <h2 className={knobStyles.display} style={{ color: 'var(--color-node-text)' }}>
                {options.find((_, index) => index == Number(value))!.label}
            </h2>

            <div className={knobStyles.infoContainer}>
                {Array.from({ length: nTicks }).map((_, index) => (
                    <div
                        key={index}
                        className={knobStyles.knobTick}
                        style={{
                            height: `${tickSize}px`,
                            transform: `translate(${adjustTickX}px, ${adjustTickY}px) rotate(${tickAngle(index)}rad) translate(-50%, -${tickDistance}px)`,
                        }}
                    ></div>
                ))}

                <div className={knobStyles.inputContainer}>
                    <div
                        className={knobStyles.knob}
                        ref={inputRef}
                        onPointerDown={onPointerDown}
                        onChange={onChange}
                    ></div>

                    <div
                        className={knobStyles.knobValue}
                        style={{ transform: `rotate(${valueAngle}rad)` }}
                    ></div>
                </div>
            </div>

            <h2 className={knobStyles.name}>
                {name != '_' && <span className={knobStyles.knobName}>{name}</span>}
                {/* eslint-disable-next-line no-irregular-whitespace */}
                {name != '_' && unit && <span> · </span>}
                <span className={knobStyles.knobUnit}>{unit}</span>
            </h2>
        </div>
    );
}
