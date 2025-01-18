import { CSSProperties, useContext, useEffect, useRef } from 'react';
import styles from './Handle.module.css';
import { Handle, HandleProps } from 'reactflow';
import { ClassContext } from '../contexts/ClassContext';
import { getHandleColor, getWireColor } from '../nodes/util';
import { ConnectionType } from '../nodes/connections';

export interface OutputHandleProps extends HandleProps {
    id: string;
    handletype: ConnectionType;
    nodeid: string;
    style?: CSSProperties;
}

export default function OutputHandle(props: OutputHandleProps) {
    const context = useContext(ClassContext);
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (handleRef.current) handleRef.current.dataset.handletype = props.handletype;
    }, [props.handletype]);

    const handleConnected = context?.edges.some(
        (edge) => edge.source == props.nodeid && edge.sourceHandle == props.id
    );

    const handleColor = getHandleColor(props.handletype);

    return (
        <Handle
            {...props}
            ref={handleRef}
            className={styles.outputHandle}
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
