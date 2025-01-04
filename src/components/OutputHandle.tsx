import { CSSProperties, useContext } from 'react';
import handleStyles from './Handle.module.css';
import { Handle, HandleProps } from "reactflow";
import { ClassContext } from '../ClassContext';
import { getHandleColor } from '../nodes/util';
import { ConnectionType } from '../nodes/connections';



export interface OutputHandleProps 
extends HandleProps
{
    id:         string;
    handletype: ConnectionType;
    nodeid:     string;
    style?:     CSSProperties;
}



export default function OutputHandle(props: OutputHandleProps)
{
    const context = useContext(ClassContext);

    const handleConnected = context?.edges.some((edge) => 
           edge.source       == props.nodeid 
        && edge.sourceHandle == props.id
    );
  
    const edgeSelected = context?.edges.some(edge => 
           edge.source       === props.nodeid 
        && edge.sourceHandle === props.id
        && edge.selected
    );


    let handleColor = getHandleColor(props.handletype);


    return (
        <Handle
            {...props}
            className={handleStyles.outputHandle}
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