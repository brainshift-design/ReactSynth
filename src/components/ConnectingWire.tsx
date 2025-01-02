import { BaseEdge, ConnectionLineComponentProps, getBezierPath } from "reactflow";
import { nozero } from "../util";



export default function ConnectingWire(props: ConnectionLineComponentProps) 
{
    const { fromX, fromY, toX, toY, fromPosition, toPosition } = props;

    const [path] = getBezierPath(
    {
        sourceX:        fromX,
        sourceY:        fromY,
        targetX:        toX,
        targetY:        toY,
        sourcePosition: fromPosition,
        targetPosition: toPosition
    });


    const wireColor = 'var(--color-wire)';
    
    const aspect  = Math.min(Math.abs(toX - fromX) / nozero(Math.abs(toY - fromY)), 1);
    const hiAlpha = 0.4 + aspect**2 * 0.3;
    const hiWidth = 1 + (1-aspect) * 1;
    const hiStyle = '#ffffff' + Math.round(hiAlpha * 0xff).toString(16).padStart(2, '0');


    return (
        <>
            <BaseEdge path={path} style={{ stroke: wireColor, strokeWidth: 4,       strokeLinecap: 'round' }} />
            <BaseEdge path={path} style={{ stroke: '#0008',   strokeWidth: 1,       strokeLinecap: 'round', transform: 'translateY(1.5px)' }} />
            <BaseEdge path={path} style={{ stroke: hiStyle,   strokeWidth: hiWidth, strokeLinecap: 'round', transform: 'translateY(-1px)' }} />
        </>
    );
}
