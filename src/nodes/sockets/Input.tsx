import Socket from "./Socket";
import { Handle, Position } from "reactflow";



export default class Input extends Socket
{
    render(nodeId: string): JSX.Element
    {
        return (
            <div>
                <Handle 
                    type      = 'target' 
                    position  = { Position.Left }
                    id        = {`${nodeId}-${this.name}`}
                    className = {`input-handle input-${this.type}`} 
                />
            </div>
        );
    }
}