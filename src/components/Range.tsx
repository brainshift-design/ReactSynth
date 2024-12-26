import { ChangeEventHandler } from 'react';

import paramStyles from './Parameter.module.css';
import rangeStyles from './Range.module.css';



interface RangeProps
{
    label:     string;
    min:       number;
    max:       number;
    value:     number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}



export default function Range({ label, min, max, value, onChange }: RangeProps)
{
    return (
        <label className={`${paramStyles.parameter} ${rangeStyles.range}`}>
            <h2>{label}</h2>
            <input 
                className = 'nodrag'
                type      = 'range'
                min       = {min}
                max       = {max}
                value     = {value}
                onChange  = {onChange}
                />
            <span>{value}</span>
        </label>
    );
}