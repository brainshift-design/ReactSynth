import Parameter from './parameters/Parameter'
import Input from './sockets/Input';
import Output from './sockets/Output';
import { toCapitalCase } from './util';

import styles from './Node.module.css'
import { ProxyArray, removeFromArrayWhere } from '../util';



export default abstract class Node
{
    readonly id:         string;
    readonly type:       string;

    readonly inputs:     Input[];
    readonly outputs:    Output[];
    
    private _parameters: Parameter[];
    readonly parameters: ProxyArray<Parameter>;

    selected:            boolean;



    constructor(id: string, type: string)
    {
        this.id          = id;
        this.type        = type;

        this.inputs      = [];
        this.outputs     = [];
        
        this._parameters = [];

        this.selected    = false;


        this.parameters = new Proxy(this._parameters,
        {
            get(target, prop)
            {
                if (typeof prop === 'string')
                {
                    // array access
                    if (!isNaN(Number(prop)))
                        return target[Number(prop)];

                    // property access by name
                    return target.find(p => p.name === prop);
                }

                return Reflect.get(target, prop);
            }
        }
        ) as ProxyArray<Parameter>; 
    }



    static create() {}


    
    addInput(input: Input)
    {
        this.inputs.push(input);
    }



    removeInput(name: string)
    {
        removeFromArrayWhere(
            this.inputs, 
            input => input.name == name);
    }



    addOutput(output: Output)
    {
        this.outputs.push(output);
    }



    removeOutput(name: string)
    {
        removeFromArrayWhere(
            this.outputs, 
            output => output.name == name);
    }



    addParameter(parameter: Parameter)
    {
        this._parameters.push(parameter);
    }



    removeParameter(name: string)
    {
        removeFromArrayWhere(
            this._parameters, 
            parameter => parameter.name == name);
    }



    abstract eval(): any;


 
    render(): JSX.Element
    {
        return (
            <div 
                className = {styles.node}
                style     = {{ outline: this.selected ? 'var(--node-outline-style)' : 'none' }}
                >

                <h1>{toCapitalCase(this.type)}</h1>

                <div className={styles.nodeContent}>

                    {(Object.values(this.parameters) as Parameter[]).map((param, index) =>
                        <div key={index}>{param.render()}</div>
                    )}

                </div>

            </div>
        );
    }
}