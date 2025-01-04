import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { nozero } from "../util";
import { getSelectedWireColor, getWireColor } from "../nodes/util";
import { ConnectionType } from "../nodes/connections";
import { getWireColors } from "./util";



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


    const { sourceHandleId, targetHandleId } = props;
    const { wireColor, selectedColor } = getWireColors(sourceHandleId!, targetHandleId!);

    
    const aspect  = Math.min(Math.abs(targetX - sourceX) / nozero(Math.abs(targetY - sourceY)), 1);
    const hiAlpha = 0.4 + aspect**2 * 0.3;
    const hiWidth = 1 + (1-aspect) * 1;
    const hiStyle = '#ffffff' + Math.round(hiAlpha * 0xff).toString(16).padStart(2, '0');


    return (
        <>
            <defs>
                <filter 
                    id     = {`dropShadow-${props.id}`} 
                    x      = '-50%' 
                    y      = '-50%' 
                    width  = '200%' 
                    height = '200%'
                    filterUnits='userSpaceOnUse'
                    >
                    <feDropShadow 
                        dx='0' 
                        dy='1.5' 
                        stdDeviation = '2' 
                        floodColor   = '#0004' 
                    />
                </filter>
            </defs>

            {selected &&
                <BaseEdge 
                    path={path} 
                    style=
                    {{
                        ...style, 
                        stroke:         selectedColor, 
                        strokeWidth:    16,       
                        strokeLinecap: 'round',
                    }}
                />
            }

            <BaseEdge 
                path={path} 
                style=
                {{
                    ...style, 
                    stroke:         wireColor, 
                    strokeWidth:    4,       
                    strokeLinecap: 'round',
                    filter:        `url(#dropShadow-${props.id})`
                }}
            />

            <BaseEdge 
                path={path} 
                style=
                {{
                    ...style, 
                    stroke:        '#0007',   
                    strokeWidth:    1,       
                    strokeLinecap: 'round', 
                    transform:     'translateY(1.5px)' 
                }}
            />

            <BaseEdge 
                path={path} 
                style=
                {{
                    ...style, 
                    stroke:         hiStyle,   
                    strokeWidth:    hiWidth, 
                    strokeLinecap: 'round', 
                    transform:     'translateY(-1px)' 
                }} 
            />
        </>
    );
}
