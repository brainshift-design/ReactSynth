import { CSSProperties, useContext, useEffect, useRef } from 'react';
import { ClassContext } from '../contexts/ClassContext';
import handleStyles from './Handle.module.css';
import { Handle, HandleProps } from 'reactflow';
import { ConnectionType } from '../nodes/connections';
import { getHandleColor, getWireColor } from '../nodes/util';

export interface InputHandleProps extends HandleProps {
    id: string;
    handletype: ConnectionType;
    nodeid: string;
    style?: CSSProperties;
}

export default function InputHandle(props: InputHandleProps) {
    const context = useContext(ClassContext);
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (handleRef.current) handleRef.current.dataset.handletype = props.handletype;
    }, [props.handletype]);

    const handleConnected = context?.edges.some(
        (edge) => edge.target == props.nodeid && edge.targetHandle == props.id
    );

    const handleColor = getHandleColor(props.handletype);

    return (
        <Handle
            {...props}
            ref={handleRef}
            className={handleStyles.inputHandle}
            style={{
                ...props.style,
                background: handleConnected
                    ? `radial-gradient(${getWireColor(props.handletype)} 35%, #000 50%)`
                    : 'var(--handle-inside-disconnected)',
                boxShadow: 'var(--handle-shadow), 0 0 0 7px ' + handleColor,
            }}
        />
    );
}
