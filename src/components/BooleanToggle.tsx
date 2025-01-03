import toggleStyles from './BooleanToggle.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, CSSProperties, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react';



interface BooleanToggleProps
{
    label:        string;
    value:        boolean;
    toggleColor?: string;
    valueColor?:  string;
    onChange?:    ChangeEventHandler<HTMLInputElement>;
}



export default function BooleanToggle({ 
    label, 
    value, 
    toggleColor = '#f4f3f1',
    valueColor  = '#08f',
    onChange 
}: BooleanToggleProps)
{
    //const inputRef    = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);

    const [toggleValue, setToggleValue] = useState(value);

    
    useEffect(() =>
    {
        onChangeRef.current = onChange;
    },
    [onChange]);


    useEffect(() =>
    {
        if (onChangeRef.current)
        {
            onChangeRef.current({
                target: { value: toggleValue.toString() }
            } as ChangeEvent<HTMLInputElement>);
        }
    },
    [toggleValue]);


    const onClick = useCallback((e: ReactPointerEvent<HTMLInputElement>) => 
    {
        setToggleValue((e.target as HTMLInputElement).checked);
    },
    [toggleValue]);


    return (
        <div
            className         = {`${paramStyles.parameter} ${toggleStyles.booleanToggleContainer}`}
            data-toggle-color = {toggleColor}
            data-value-color  = {valueColor}
            style = 
            {{ 
                '--toggle-color':       toggleColor, 
                '--toggle-value-color': valueColor 
            } as CSSProperties}
            >

            <input 
                type    = 'checkbox' 
                // ref     = 'inputRef' 
                onClick = {onClick}
            />

            <div className={toggleStyles.booleanToggle}></div>

            <h2 className={toggleStyles.name}>
                {label}
            </h2>

        </div>
    );
}
