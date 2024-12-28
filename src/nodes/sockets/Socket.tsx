export type SocketType = 'audio' | 'data' | 'control';
export type DataType = 'number';



export default abstract class Socket
{
    name:      string;
    type:      SocketType;
    dataType?: DataType;



    constructor(name: string, type: SocketType, dataType?: DataType)
    {
        this.name     = name;
        this.type     = type;
        this.dataType = dataType;
    }



    abstract render(nodeId: string): JSX.Element;
}