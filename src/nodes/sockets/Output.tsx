import Socket from "./Socket";
import { Handle, Position } from "reactflow";



export default class Output extends Socket
{
    render(nodeId: string): JSX.Element
    {
        return (
            <div>
                <Handle 
                    type      = 'source' 
                    position  = { Position.Right }
                    id        = {`${nodeId}-${this.name}`}
                    className = {`output-handle output-${this.type}`} 
                />
            </div>
        );
    }
}