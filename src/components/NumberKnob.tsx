import knobStyles from './Knob.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, CSSProperties, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Tau } from '../util';



interface NumberKnobProps
{
    label:            string;
    min:              number;
    max:              number;
    value:            number;
    getCurvedValue?:  (val: number, min: number, max: number) => number,
    getCurvedTick?:   (val: number, min: number, max: number) => number,
    decimals?:        number;
    padding?:         number;
    padChar?:         string;
    suffix?:          string;
    knobColor?:       string;
    valueColor?:      string;
    minAngle?:        number;
    maxAngle?:        number;
    ticks?:           number;
    tickSize?:        number;
    tickDistance?:    number;
    adjustTickX?:     number;
    adjustTickY?:     number;
    adjustTickAngle?: number;
    onChange?:        ChangeEventHandler<HTMLInputElement>;
}



export default function NumberKnob({ 
    label, 
    min, 
    max, 
    value, 
    getCurvedValue  = (val, _1, _2) => val,
    getCurvedTick   = (val, _1, _2) => val,
    decimals        = 0, 
    padding         = 0, 
    padChar         = ' ', 
    suffix          = '', 
    knobColor       = '#f4f3f1',
    valueColor      = 'var(--color-node-value)',
    minAngle        = Tau * -3/8,
    maxAngle        = Tau *  3/8,
    ticks           = 15, 
    tickSize        = 3, 
    tickDistance    = 27,
    adjustTickX     = -1,   // these are for manual
    adjustTickY     = 0,    // adjustment of ticks
    adjustTickAngle = 0.05, // because of CSS pixel grid issues
    onChange 
}: NumberKnobProps)
{
    const inputRef    = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);

    const [linearValue,    setLinearValue   ] = useState(value);
    const [curvedValue,    setCurvedValue   ] = useState(value);
    const [oldCurvedValue, setOldCurvedValue] = useState(value);


    const dragState = useRef(
    {
        isDragging: false,
        startX:     0,
        startValue: 0
    });


    useEffect(() =>
    {
        onChangeRef.current = onChange;
    },
    [onChange]);


    useEffect(() =>
    {
        setCurvedValue(getCurvedValue(linearValue, min, max));
    },
    [linearValue]);


    useEffect(() =>
    {
        if (   onChangeRef.current
            && curvedValue != oldCurvedValue)
        {
            onChangeRef.current({
                target: { value: curvedValue.toString() }
            } as ChangeEvent<HTMLInputElement>);
        }

        setOldCurvedValue(curvedValue);
    },
    [curvedValue]);


    const onPointerMove = useCallback((e: globalThis.PointerEvent) => 
    {
        if (!dragState.current.isDragging) return;

        const delta = (e.clientX - dragState.current.startX) * 0.01;

        setLinearValue(Math.min(Math.max(
            min,
            dragState.current.startValue + delta * (max - min)),
            max));
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
            startValue: linearValue
        }

        globalThis.addEventListener('pointermove', onPointerMove);
        globalThis.addEventListener('pointerup',   onPointerUp);

        inputRef.current?.setPointerCapture(e.pointerId);
    },
    [linearValue]);


    const onClick = (e: ReactPointerEvent<HTMLInputElement>) => e.preventDefault();


    const valueAngle = minAngle + (linearValue - min) / (max - min) * (maxAngle - minAngle);

    const tickAngle = (index: number) => 
          minAngle
        + getCurvedTick(index / (ticks-1), 0, 1) * (maxAngle - minAngle)
        + adjustTickAngle;


    const finalCurvedValue = curvedValue.toFixed(decimals);
    const strValue         = finalCurvedValue.toString().padStart(padding, padChar.replace(' ', ' ')) + (suffix && ' ') + suffix;

    const inputStep = 1 / Math.round(Math.pow(10, decimals));


    return (
        <label 
            className        = {`${paramStyles.parameter} ${knobStyles.knobContainer}`}
            data-knob-color  = {knobColor}
            data-value-color = {valueColor}
            style = 
            {{ 
                '--knob-color':  knobColor, 
                '--value-color': valueColor 
            } as CSSProperties}
            >

            <h2 
                className = {knobStyles.display}
                style     = {{ color: 'var(--color-node-text)' }}
                >
                {strValue}
            </h2>

            <div className={knobStyles.infoContainer}>

                {Array.from({ length: ticks }).map((_, index) => (
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
                        min           = {min}
                        max           = {max}
                        step          = {inputStep}
                        value         = {value} // this should reflect the linear value
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
