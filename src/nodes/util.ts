import { nodeTypes } from '.';
import { ConnectionType } from './connections';
import OscillatorNode from './OscillatorNode';
import Node from './Node';
import { NodeProps } from './Node';

export const freqCurvePower = 4.5; // picked to make 440 be at the top

export function getTypeName<T extends NodeProps, S>(
    Class: abstract new (props: T) => Node<T, S>
): string {
    const found = Object.entries(nodeTypes).find(([, cls]) => cls === (Class as unknown));

    return found?.[0] as string;
}

export function getValueCurve(
    val: number,
    min: number,
    max: number,
    power: number,
    prep: (v: number) => number = (_v: number) => _v
) {
    return min + prep(((val - min) / (max - min)) ** power) * (max - min);
}

export function invValueCurve(freq: number) {
    return getValueCurve(freq, OscillatorNode.minFreq, OscillatorNode.maxFreq, 1 / freqCurvePower);
}

export function getHandleColor(handletype: ConnectionType) {
    switch (handletype) {
        case 'audio':
            return '#5af';
        case 'data':
            return '#fca';
        case 'control':
            return '#fc0';
    }
}

export function getWireColor(handletype: ConnectionType) {
    switch (handletype) {
        case 'audio':
            return '#2292ff';
        case 'data':
            return '#f44';
        case 'control':
            return '#fc0';
    }
}

export function getSelectedWireColor(handletype: ConnectionType) {
    switch (handletype) {
        case 'audio':
            return '#09f8';
        case 'data':
            return '#f448';
        case 'control':
            return '#fc08';
    }
}
