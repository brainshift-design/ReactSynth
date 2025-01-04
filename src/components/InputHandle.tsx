import { CSSProperties, useContext } from 'react';
import { ClassContext } from '../ClassContext';
import handleStyles from './Handle.module.css';
import { Handle, HandleProps } from "reactflow";
import { ConnectionType } from '../nodes/connections';
import { getHandleColor } from '../nodes/util';



export interface InputHandleProps 
extends HandleProps
{
    id:         string;
    handletype: ConnectionType;
    nodeid:     string;
    style?:     CSSProperties;
}



export default function InputHandle(props: InputHandleProps)
{
    const context = useContext(ClassContext);

    const handleConnected = context?.edges.some((edge) => 
           edge.target       == props.nodeid 
        && edge.targetHandle == props.id
    );
  
    const edgeSelected = context?.edges.some(edge => 
           edge.target       === props.nodeid 
        && edge.targetHandle === props.id
        && edge.selected
    );


    let handleColor = getHandleColor(props.handletype);
   

    return (
        <Handle
            {...props}
            className={handleStyles.inputHandle}
            style =
            {{
                ...props.style,
                background: 
                    handleConnected 
                        ? (edgeSelected
                               ? 'var(--handle-inside-connected-selected)'
                               : 'var(--handle-inside-connected)')
                        : 'var(--handle-inside-disconnected)',
                boxShadow: 'var(--handle-shadow), 0 0 0 7px ' + handleColor
            }}
        />
    );
}