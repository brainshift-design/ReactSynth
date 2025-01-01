export type ConnectionType = 'audio' | 'control' | 'data';


export interface Connection
{
    type:     ConnectionType;
    data?:    any;
    audio?:   AudioNode;
    control?: () => void;
}


export interface Input
{
    name:    string;
    type:    ConnectionType;
    handle?: Connection;
}


export interface Output
{
    name:     Output;
    type:     ConnectionType;
    data?:    any;
    audio?:   AudioNode;
    control?: () => void;
}


export interface Parameter
{
    name:   string;
    value:  any;
    input?: Connection;
}