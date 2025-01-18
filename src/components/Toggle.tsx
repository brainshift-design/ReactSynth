import toggleStyles from './Toggle.module.css';
import paramStyles from '../parameters/Parameter.module.css';
import { ChangeEvent, ChangeEventHandler, CSSProperties } from 'react';

interface ToggleProps {
    label: string;
    value: boolean;
    toggleColor?: string;
    valueColor?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Toggle({
    label,
    value,
    toggleColor = '#f4f3f1',
    valueColor = '#08f',
    onChange,
}: ToggleProps) {
    const handleClick = () => {
        if (onChange) {
            onChange({
                target: { value: (!value).toString() },
            } as ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div
            className={`${paramStyles.parameter} ${toggleStyles.toggleContainer}`}
            data-toggle-color={toggleColor}
            data-value-color={valueColor}
            style={
                {
                    '--toggle-color': toggleColor,
                    '--toggle-value-color': valueColor,
                } as CSSProperties
            }
        >
            <div
                className={toggleStyles.toggle}
                onClick={handleClick}
                style={{
                    background: value ? '#6bf' : '#0000000a',
                }}
            >
                <div
                    className={toggleStyles.thumb}
                    style={{
                        top: value ? '0' : '45%',
                    }}
                ></div>
            </div>

            <h2 className={toggleStyles.name}>{label}</h2>
        </div>
    );
}
