import toggleStyles from './Toggle.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, CSSProperties, /*PointerEvent as ReactPointerEvent,*/ useCallback, useEffect, useRef, useState } from 'react';



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


    const onClick = useCallback((/*e: ReactPointerEvent<HTMLInputElement>*/) => 
    {
        setToggleValue(!toggleValue);
    },
    [toggleValue]);


    return (
        <div
            className         = {`${paramStyles.parameter} ${toggleStyles.toggleContainer}`}
            data-toggle-color = {toggleColor}
            data-value-color  = {valueColor}
            style = 
            {{ 
                '--toggle-color':       toggleColor, 
                '--toggle-value-color': valueColor 
            } as CSSProperties}
            >

            {/* <h2 
                className = {toggleStyles.display}
                style     = {{ color: 'var(--color-node-text)' }}
                >
                {showValue ? strValue : ' '}
            </h2> */}

            <input 
                type    = 'checkbox' 
                id      = 'switch' 
                // ref     = 'inputRef' 
                onClick = {onClick}
            />

            <h2 className={toggleStyles.name}>
                {label}
            </h2>

        </div>
    );
}
