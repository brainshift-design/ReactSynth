import { ChangeEventHandler } from 'react';

import paramStyles from '../parameters/Parameter.module.css';
import selectStyles from './Select.module.css';

interface SelectProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
}

export default function Select({ label, options, value, onChange }: SelectProps) {
    return (
        <label className={`${paramStyles.parameter} ${selectStyles.select}`}>
            <h2>{label}</h2>
            <select className="nodrag" value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
