import toggleStyles from './Toggle.module.css';
import paramStyles from './Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, CSSProperties, useCallback, useEffect, useRef, useState } from 'react';



interface ToggleProps
{
    label:        string;
    value:        boolean;
    toggleColor?: string;
    valueColor?:  string;
    onChange?:    ChangeEventHandler<HTMLInputElement>;
}



export default function Toggle({ 
    label, 
    value, 
    toggleColor = '#f4f3f1',
    valueColor  = '#08f',
    onChange 
}: ToggleProps)
{
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


    const onClick = useCallback(() => 
    {
        setToggleValue(value => !value);
    },
    []);


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

            <div 
                className = {toggleStyles.toggle}
                onClick   = {onClick}
                style     =
                {{
                    background: toggleValue ? '#6bf' : '#0000000a'
                }}
                >

                <div 
                    className = {toggleStyles.thumb}
                    style     = 
                    {{
                        top: toggleValue ? '0' : '45%'
                    }}
                        >
                </div>

            </div>

            <h2 className={toggleStyles.name}>
                {label}
            </h2>

        </div>
    );
}
