import { CSSProperties, useContext } from 'react';
import handleStyles from './Handle.module.css';
import { Handle, HandleProps } from "reactflow";
import { ClassContext } from '../ClassContext';



export interface OutputHandleProps extends HandleProps
{
    id:     string;
    nodeid: string;
    style?: CSSProperties;
}



export default function OutputHandle(props: OutputHandleProps)
{
    const context = useContext(ClassContext);

    const handleConnected = context?.edges.some((edge) => 
           edge.source       == props.nodeid 
        && edge.sourceHandle == props.id
    );
  
    return (
        <Handle
            {...props}
            className={handleStyles.outputHandle}
            style =
            {{
                ...props.style,
                background: 
                    handleConnected 
                        ? 'var(--handle-inside-connected)' 
                        : 'var(--handle-inside-disconnected)'
            }}
        />
    );
}