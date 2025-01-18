import NumberKnob from '../components/NumberKnob';
import Parameter, { ParameterProps } from './Parameter';

export interface NumberParameterProps extends ParameterProps<number> {
    min: number;
    max: number;
    showValue?: boolean;
    getCurvedValue?: (val: number) => number;
    getCurvedTick?: (val: number) => number;
    ticks?: number;
}

export default class NumberParameter extends Parameter<number> {
    min: number = 0;
    max: number = 100;
    showValue?: boolean = true;
    getCurvedValue?: (val: number) => number = (val) => val;
    getCurvedTick?: (val: number) => number = (val) => val;
    ticks?: number = 11;

    constructor(props: NumberParameterProps) {
        super(props);

        const { min, max, showValue, getCurvedValue, getCurvedTick, ticks } = props;

        this.min = min;
        this.max = max;
        this.showValue = showValue;
        this.getCurvedValue = getCurvedValue;
        this.getCurvedTick = getCurvedTick;
        this.ticks = ticks;
    }

    render() {
        return (
            <NumberKnob
                label={this.name}
                min={this.min}
                max={this.max}
                value={this.value}
                showValue={this.showValue}
                getCurvedValue={this.getCurvedValue}
                getCurvedTick={this.getCurvedTick}
                ticks={this.ticks}
                // onChange       = {this.onChange}
            />
        );
    }
}
