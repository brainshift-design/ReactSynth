import Toggle from "../components/Toggle";
import Parameter, { ParameterProps } from "./Parameter";



export interface BooleanParameterProps 
extends ParameterProps<boolean> {}



export default class BooleanParameter
extends Parameter<boolean>
{
    render()
    {
        return (
            <Toggle
                label = {this.name}
                value = {this.value}
                // onChange = {(e) => this.update({ reverse: e.target.value === 'true' })}
            />
        );
    }
}