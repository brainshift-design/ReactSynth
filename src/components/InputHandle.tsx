import { CSSProperties, useContext } from 'react';
import { ClassContext } from '../ClassContext';
import handleStyles from './Handle.module.css';
import { Handle, HandleProps } from "reactflow";



export interface InputHandleProps extends HandleProps
{
    id:     string;
    nodeid: string;
    style?: CSSProperties;
}



export default function InputHandle(props: InputHandleProps)
{
    const context = useContext(ClassContext);

    const handleConnected = context?.edges.some((edge) => 
           edge.target       == props.nodeid 
        && edge.targetHandle == props.id
    );
  
    return (
        <Handle
            {...props}
            className={handleStyles.inputHandle}
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