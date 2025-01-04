// import { ChangeEventHandler } from "react";

export type ParameterValueType = number | boolean;
export type ParameterCallback = (value: number | boolean) => void;



export interface ParameterProps<T extends ParameterValueType>
{
    name:         string;
    value:        T;

    inputHandle?: (value: T) => void;
  //onChange?:    ChangeEventHandler<HTMLInputElement>;
}



export default abstract class Parameter<T extends ParameterValueType>
{
    name:  string;
    value: T;
    
    inputHandle?: (value: T) => void;
  //onChange?:    ChangeEventHandler<HTMLInputElement>;

    private setValueCallback?:   ParameterCallback;
    private automationCallback?: (time: number) => T; // for automation like LFO



    constructor(props: ParameterProps<T>)
    {
        const { name, value } = props;

        this.name  = name;
        this.value = value;

        this.inputHandle = props.inputHandle;
        // this.onChange    = props.onChange;

        if (this.setValueCallback)
            this.setValueCallback(value);
    }



    setValue(value: T)
    {
        this.value = value;


        if (this.inputHandle)
            this.inputHandle(value);
    }



    connect(setValueCallback: ParameterCallback)
    {
        this.setValueCallback = setValueCallback;
    }



    connectInput(source: Parameter<T>)
    {
        source.setValueCallback = (value) => this.setValue(value as T);
    }



    setAutomation(callback: (time: number) => T)
    {
        this.automationCallback = callback;
    }



    updateWithAutomation(time: number)
    {
        if (this.automationCallback)
            this.setValue(this.automationCallback(time));
    }



    abstract render(): JSX.Element;
}