import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { nozero } from "../util";
import { getWireColor } from "../nodes/util";



export default function Wire(props: EdgeProps) 
{
    const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, selected, style } = props;

    const [path] = getBezierPath(
    {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition
    });


    const wireColor = 
        selected 
            ? 'var(--color-wire-selected)' 
            : getWireColor('audio');
    
    const aspect  = Math.min(Math.abs(targetX - sourceX) / nozero(Math.abs(targetY - sourceY)), 1);
    const hiAlpha = 0.4 + aspect**2 * 0.3;
    const hiWidth = 1 + (1-aspect) * 1;
    const hiStyle = '#ffffff' + Math.round(hiAlpha * 0xff).toString(16).padStart(2, '0');


    return (
        <>
            <BaseEdge path={path} style={{...style, stroke: wireColor, strokeWidth: 4,       strokeLinecap: 'round' }} />
            <BaseEdge path={path} style={{...style, stroke: '#0007',   strokeWidth: 1,       strokeLinecap: 'round', transform: 'translateY(1.5px)' }} />
            <BaseEdge path={path} style={{...style, stroke: hiStyle,   strokeWidth: hiWidth, strokeLinecap: 'round', transform: 'translateY(-1px)' }} />
        </>
    );
}
