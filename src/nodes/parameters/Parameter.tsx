export default abstract class Parameter
{
    name:      string;
    value:     any;

    onChange?: () => void;



    constructor(name: string, value: any, onChange?: () => void)
    {
        this.name     = name;
        this.value    = value;

        this.onChange = onChange;
    }



    abstract render(): JSX.Element;
}