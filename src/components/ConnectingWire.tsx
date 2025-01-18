import { BaseEdge, ConnectionLineComponentProps, getBezierPath } from 'reactflow';
import { nozero } from '../util';
import { getWireColors } from './util';

export default function ConnectingWire(props: ConnectionLineComponentProps) {
    const { fromX, fromY, toX, toY, fromPosition, toPosition } = props;

    const [path] = getBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY,
        sourcePosition: fromPosition,
        targetPosition: toPosition,
    });

    const { fromHandle } = props;

    const { wireColor } = fromHandle?.id
        ? getWireColors(fromHandle.id, fromHandle.id)
        : { wireColor: '#888' };

    const aspect = Math.min(Math.abs(toX - fromX) / nozero(Math.abs(toY - fromY)), 1);
    const hiAlpha = 0.4 + aspect ** 2 * 0.3;
    const hiWidth = 1 + (1 - aspect) * 1;
    const hiStyle =
        '#ffffff' +
        Math.round(hiAlpha * 0xff)
            .toString(16)
            .padStart(2, '0');

    return (
        <>
            <defs>
                <filter
                    id={`dropShadow-connecting`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                    filterUnits="userSpaceOnUse"
                >
                    <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0004" />
                </filter>
            </defs>

            <BaseEdge
                path={path}
                style={{
                    stroke: wireColor,
                    strokeWidth: 4,
                    strokeLinecap: 'round',
                    filter: `url(#dropShadow-connecting)`,
                }}
            />

            <BaseEdge
                path={path}
                style={{
                    stroke: '#0007',
                    strokeWidth: 1,
                    strokeLinecap: 'round',
                    transform: 'translateY(1.5px)',
                }}
            />

            <BaseEdge
                path={path}
                style={{
                    stroke: hiStyle,
                    strokeWidth: hiWidth,
                    strokeLinecap: 'round',
                    transform: 'translateY(-1px)',
                }}
            />
        </>
    );
}
