import Parameter from "./Parameter";

import paramStyles from './Parameter.module.css';
import rangeStyles from '../../components/Range.module.css';



export default class NumberParameter extends Parameter
{
    min:    number;
    max:    number;
    
    suffix: string;



    constructor(name: string, value: number, min: number, max: number, suffix: string = '', onChange?: () => void)
    {
        super(name, value, onChange);

        this.min    = min;
        this.max    = max;

        this.suffix = suffix;
    }



    render(): JSX.Element
    {
        return (
            <label className={`${paramStyles.parameter} ${rangeStyles.range}`}>
                <h2>{this.name}</h2>
                <input 
                    className = 'nodrag'
                    type      = 'range'
                    min       = {this.min}
                    max       = {this.max}
                    value     = {this.value}
                    onChange  = {this.onChange}
                    />
                <span>{this.value + (this.suffix && ' ') + this.suffix}</span>
            </label>
        );
    }
}