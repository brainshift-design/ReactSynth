export type ConnectionType = 'audio' | 'control' | 'data';

export type ControlCommand = 'note-on' | 'note-off';

export interface Connection {
    type: ConnectionType;
    data?: unknown;
    audio?: AudioNode;
    control?: (command: ControlCommand) => void;
}

export interface Input {
    name: string;
    type: ConnectionType;
    handle?: Connection;
}

export interface Output {
    name: Output;
    type: ConnectionType;
    data?: unknown;
    audio?: AudioNode;
    control?: (value: boolean) => void;
}

export interface Parameter {
    name: string;
    value: unknown;
    input?: Connection;
}
