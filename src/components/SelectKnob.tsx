import knobStyles from './Knob.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Tau } from '../util';



interface SelectKnobProps
{
    label:            string;
    value:            number;
    options:          { value: string, label: string }[];
    minAngle?:        number;
    maxAngle?:        number;
    tickSize?:        number;
    tickDistance?:    number;
    adjustTickX?:     number;
    adjustTickY?:     number;
    adjustTickAngle?: number;
    onChange?:        ChangeEventHandler<HTMLInputElement>;
}



export default function SelectKnob({ 
    label, 
    value, 
    options,
    minAngle        = Tau * -3/8,
    maxAngle        = Tau *  3/8,
    tickSize        = 3, 
    tickDistance    = 27,
    adjustTickX     = -1,   // these are for manual
    adjustTickY     = 0,    // adjustment of ticks
    adjustTickAngle = 0.05, // because of CSS pixel grid issues
    onChange 
}: SelectKnobProps)
{
    const inputRef = useRef<HTMLInputElement>(null);
    const [knobValue, setKnobValue] = useState(0);

    
    const dragState = useRef(
    {
        isDragging: false,
        startX:     0,
        startValue: 0
    });


    const onChangeRef = useRef(onChange);


    useEffect(() =>
    {
        onChangeRef.current = onChange;
    },
    [onChange]);


    const onPointerMove = useCallback((e: globalThis.PointerEvent) => 
    {
        if (!dragState.current.isDragging) return;

        const delta = (e.clientX - dragState.current.startX) * 0.01;

        const oldValue = inputRef.current?.value;
        const newValue = Math.min(Math.max(
            0,
            Math.round(dragState.current.startValue + delta * options.length)),
            options.length-1);
            

        if (inputRef.current)
            inputRef.current.value = newValue.toString();


        if (onChangeRef.current)
        {
            const index = Math.min(Math.max(0, Math.round(newValue)), options.length-1);

            if (oldValue != index.toString())
            {
                onChangeRef.current({
                    target: { value: index.toString() }
                } as ChangeEvent<HTMLInputElement>);
            }
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
        if (e.button != 0)
            return;
        
        e.preventDefault();

        dragState.current =
        {
            isDragging: true,
            startX:     e.clientX,
            startValue: options.findIndex((_, index) => index == knobValue)
        };

        globalThis.addEventListener('pointermove', onPointerMove);
        globalThis.addEventListener('pointerup',   onPointerUp);

        inputRef.current?.setPointerCapture(e.pointerId);
    },
    [value, onPointerMove, onPointerUp]);


    const onClick = (e: ReactPointerEvent<HTMLInputElement>) => e.preventDefault();


    const _value     = knobValue;
    const valueAngle = minAngle + _value / (options.length-1) * (maxAngle - minAngle);

    useEffect(() =>
    {
        setKnobValue(Number(inputRef.current?.value));
    },
    [inputRef.current?.value]);


    const nTicks = options.length;

    const tickAngle = (index: number) => 
          minAngle
        + index / (nTicks-1) * (maxAngle - minAngle)
        + adjustTickAngle;


    return (
        <label className={`${paramStyles.parameter} ${knobStyles.knobContainer}`}>

            <h2 
                className = {knobStyles.display}
                style     = {{ color: 'var(--color-node-text)' }}
                >
                {options.find((_, index) => index == Number(value))!.label}
            </h2>

            <div className={knobStyles.infoContainer}>

                {Array.from({ length: nTicks }).map((_, index) => (
                    <div 
                        key       = {index} 
                        className = {knobStyles.knobTick}
                        style     = 
                        {{ 
                            height:    `${tickSize}px`,
                            transform: `translate(${adjustTickX}px, ${adjustTickY}px) rotate(${tickAngle(index)}rad) translate(-50%, -${tickDistance}px)` 
                        }}
                        >
                    </div>
                ))}

                <div className={knobStyles.inputContainer}>

                    <input 
                        className     = 'nodrag'
                        type          = 'range'
                        min           = {0}
                        max           = {options.length-1}
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
                        style     = {{ transform: `rotate(${valueAngle}rad)` }}
                        >
                    </div>

                </div>

            </div>

            <h2 className={knobStyles.name}>
                {label}
            </h2>

        </label>
    );
}
