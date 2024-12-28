import Parameter from "./Parameter";

import paramStyles from './Parameter.module.css';
import selectStyles from './Select.module.css';



export type SelectOption = { name: string; value: string };



export default class SelectParameter extends Parameter
{
    options: SelectOption[];



    constructor(name: string, value: string, options: SelectOption[], onChange?: () => void)    {
        super(name, value, onChange);

        this.options = options;
    }



    render(): JSX.Element
    {
        return (
            <label className={`${paramStyles.parameter} ${selectStyles.select}`}>
                <h2>{this.name}</h2>
                <select 
                    className = 'nodrag'
                    value     = {this.value}
                    onChange  = {this.onChange}
                    >
                    {
                        this.options.map((option) => 
                        (
                            <option 
                                key   = {option.value} 
                                value = {option.value}
                                >
                                {option.name}
                            </option>
                        ))
                    }
                </select>
            </label>
        );
    }
}