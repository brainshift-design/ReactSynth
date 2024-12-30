import { ChangeEvent, ChangeEventHandler, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef } from 'react';

import paramStyles from './Parameter.module.css';
import knobStyles from './Knob.module.css';
import { roundTo, Tau } from '../util';



interface NumberKnobProps
{
    label:     string;
    min:       number;
    max:       number;
    value:     number;
    decimals?: number;
    padding?:  number;
    padChar?:  string;
    suffix?:   string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}



export default function NumberKnob({ label, min, max, value, decimals = 0, padding = 0, padChar = ' ', suffix = '', onChange }: NumberKnobProps)
{
    const inputRef = useRef<HTMLInputElement>(null);

    const dragState = useRef(
    {
        isDragging: false,
        startX:     0,
        startValue: 0
    });


    const minRef      = useRef(min);
    const maxRef      = useRef(max);
    const onChangeRef = useRef(onChange);


    useEffect(() =>
    {
        minRef.current = min;
        maxRef.current = max;
        onChangeRef.current = onChange;
    },
    [min, max, onChange]);


    const onPointerMove = useCallback((e: globalThis.PointerEvent) => 
    {
        console.log('onPointerMove()');
        console.log('dragState =', dragState);

        if (!dragState.current.isDragging) return;

        console.log('1');

        const delta = (e.clientX - dragState.current.startX) * 0.01;

        const newValue = Math.min(Math.max(
            minRef.current,
            dragState.current.startValue + delta * (maxRef.current - minRef.current)),
            maxRef.current);

        if (onChangeRef.current)
        {
            onChangeRef.current({
                target: { value: newValue.toString() }
            } as ChangeEvent<HTMLInputElement>);
        }
    },
    []);


    const onPointerUp = useCallback((e: globalThis.PointerEvent) => 
    {
        dragState.current.isDragging = false;

        globalThis.removeEventListener('pointermove', onPointerMove);
        globalThis.removeEventListener('pointerup',   onPointerUp);

        inputRef.current?.releasePointerCapture(e.pointerId);
    },
    []);


    const onPointerDown = useCallback((e: ReactPointerEvent<HTMLInputElement>) => 
    {
        console.log('handlePointerDown()');
        
        e.preventDefault();

        dragState.current =
        {
            isDragging: true,
            startX:     e.clientX,
            startValue: value
        }

        globalThis.addEventListener('pointermove', onPointerMove);
        globalThis.addEventListener('pointerup',   onPointerUp);

        console.log('dragState =', dragState);

        inputRef.current?.setPointerCapture(e.pointerId);
    },
    [value, onPointerMove, onPointerUp]);


    const onClick = (e: ReactPointerEvent<HTMLInputElement>) => e.preventDefault();


    const angleMin = Tau * -3/8;
    const angleMax = Tau *  3/8;
    const angle    = angleMin + (value - min) / (max - min) * (angleMax - angleMin);


    return (
        <label className={`${paramStyles.parameter} ${knobStyles.knobContainer}`}>

            <h2 className={knobStyles.display}
                style=
                {{ 
                    color: 'var(--color-node-text)'
                }}
                >
                {roundTo(value, decimals).toString().padStart(padding, padChar.replace(' ', ' ')) + (suffix && ' ') + suffix}
            </h2>

            <div className={knobStyles.inputContainer}>

                <input 
                    className     = 'nodrag'
                    type          = 'range'
                    min           = {min}
                    max           = {max}
                    value         = {value}
                    ref           = {inputRef}
                    onChange      = {onChange}
                    onPointerDown = {onPointerDown}
                    onClick       = {onClick}
                    style         = {{ touchAction: 'none' }}
                    />

                <div className = {knobStyles.knob}></div>

                <div 
                    className = {knobStyles.knobValue}
                    style     = {{ transform: `rotate(${angle}rad)` }}
                    >
                </div>

            </div>

            <h2 
                style=
                {{ 
                    color: 'var(--color-node-text)',
                    fontWeight: 800
                }}
                >
                {label}
            </h2>

        </label>
    );
}
