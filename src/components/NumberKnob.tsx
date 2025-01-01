import knobStyles from './Knob.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef } from 'react';
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
    color?:           string;
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
    color           = '#f0f4f5',
    minAngle        = Tau * -3/8,
    maxAngle        = Tau *  3/8,
    ticks           = 15, 
    tickSize        = 3, 
    tickDistance    = 27,
    adjustTickX     = -1, // these are for manual
    adjustTickY     = 0, // adjustment of ticks
    adjustTickAngle = 0.05, // because of CSS pixel grid issues
    onChange 
}: NumberKnobProps)
{
    const linearInputRef = useRef<HTMLInputElement>(null);
    const curvedInputRef = useRef<HTMLInputElement>(null);

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
        if (!dragState.current.isDragging) return;

        const delta = (e.clientX - dragState.current.startX) * 0.01;

        const newLinearValue = Math.min(Math.max(
            minRef.current,
            dragState.current.startValue + delta * (maxRef.current - minRef.current)),
            maxRef.current);
            
        if (linearInputRef.current)
            linearInputRef.current.value = newLinearValue.toString();

        if (curvedInputRef.current) 
        {
            const newCurvedValue = getCurvedValue(newLinearValue, minRef.current, maxRef.current);
            curvedInputRef.current.value = newCurvedValue.toString();
        }

        if (onChangeRef.current)
        {
            onChangeRef.current({
                target: { value: newLinearValue.toString() }
            } as ChangeEvent<HTMLInputElement>);
        }
    },
    []);


    const onPointerUp = useCallback((e: globalThis.PointerEvent) => 
    {
        dragState.current.isDragging = false;

        globalThis.removeEventListener('pointermove', onPointerMove);
        globalThis.removeEventListener('pointerup',   onPointerUp);

        linearInputRef.current?.releasePointerCapture(e.pointerId);
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
            startValue: value
        }

        globalThis.addEventListener('pointermove', onPointerMove);
        globalThis.addEventListener('pointerup',   onPointerUp);

        linearInputRef.current?.setPointerCapture(e.pointerId);
    },
    [value, onPointerMove, onPointerUp]);


    const onClick = (e: ReactPointerEvent<HTMLInputElement>) => e.preventDefault();


    const linearValue = parseFloat(linearInputRef.current?.value || value.toString());
    const curvedValue = getCurvedValue(linearValue, minRef.current, maxRef.current);
    
    const valueAngle = minAngle + (linearValue - min) / (max - min) * (maxAngle - minAngle);

    const tickAngle = (index: number) => 
          minAngle
        + getCurvedTick(index / (ticks-1), 0, 1) * (maxAngle - minAngle)
        + adjustTickAngle;


    const handleLinearChange = (e: ChangeEvent<HTMLInputElement>) => 
    {
        const newLinearValue = parseFloat(e.target.value);
        const newCurvedValue = getCurvedValue(newLinearValue, minRef.current, maxRef.current);

        if (curvedInputRef.current) 
        {
            curvedInputRef.current.value = newCurvedValue.toString();

            const event = new Event('input', { bubbles: true });
            curvedInputRef.current.dispatchEvent(event);
        }
    };


    const finalCurvedValue = curvedValue.toFixed(decimals);
    const strValue         = finalCurvedValue.toString().padStart(padding, padChar.replace(' ', ' ')) + (suffix && ' ') + suffix;

    const inputStep = 1 / Math.round(Math.pow(10, decimals));


    return (
        <label className = {`${paramStyles.parameter} ${knobStyles.knobContainer}`} data-color={color}>

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
                        ref           = {linearInputRef}
                        onChange      = {handleLinearChange}
                        onPointerDown = {onPointerDown}
                        onClick       = {onClick}
                        style         = {{ touchAction: 'none' }}
                        />

                    <input 
                        className     = 'nodrag'
                        type          = 'range'
                        min           = {min}
                        max           = {max}
                        value         = {finalCurvedValue}
                        ref           = {curvedInputRef}
                        onChange      = {onChange}
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
