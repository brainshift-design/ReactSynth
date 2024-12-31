import knobStyles from './Knob.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef } from 'react';
import { Tau } from '../util';



interface SelectKnobProps
{
    label:            string;
    value:            string;
    options:          { value: string, label: string }[];
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
    tickSize        = 3, 
    tickDistance    = 27,
    adjustTickX     = -1,   // these are for manual
    adjustTickY     = 0,    // adjustment of ticks
    adjustTickAngle = 0.05, // because of CSS pixel grid issues
    onChange 
}: SelectKnobProps)
{
    const inputRef = useRef<HTMLInputElement>(null);

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

        const newValue = Math.min(Math.max(
            0,
            dragState.current.startValue + delta * options.length),
            options.length);
            
        if (inputRef.current)
            inputRef.current.value = newValue.toString();

        if (onChangeRef.current)
        {
            const index = Math.min(Math.max(0, Math.round(newValue)), options.length-1);
            console.log('index =', index);
            console.log('options[index].value =', options[index].value);

            onChangeRef.current({
                target: { value: options[index].value }
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
        if (e.button != 0)
            return;
        
        e.preventDefault();

        dragState.current =
        {
            isDragging: true,
            startX:     e.clientX,
            startValue: options.findIndex(i => i.value == value)
        }

        globalThis.addEventListener('pointermove', onPointerMove);
        globalThis.addEventListener('pointerup',   onPointerUp);

        inputRef.current?.setPointerCapture(e.pointerId);
    },
    [value, onPointerMove, onPointerUp]);


    const onClick = (e: ReactPointerEvent<HTMLInputElement>) => e.preventDefault();


    const angleMin = Tau * -3/8;
    const angleMax = Tau *  3/8;

    console.log('inputRef.current?.value =', inputRef.current?.value);
    console.log('value =', value);

    const _value = parseFloat(inputRef.current?.value || value.toString());
    
    const valueAngle = angleMin + _value / (options.length-1) * (angleMax - angleMin);

    const nTicks = options.length;

    const tickAngle = (index: number) => 
          angleMin
        + index / (nTicks-1) * (angleMax - angleMin)
        + adjustTickAngle;


    return (
        <label className={`${paramStyles.parameter} ${knobStyles.knobContainer}`}>

            <h2 
                className = {knobStyles.display}
                style     = {{ color: 'var(--color-node-text)' }}
                >
                {options.find(o => o.value == value)?.label}
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
                        value         = {options.findIndex(i => i.value == value)} // this should reflect the linear value
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
