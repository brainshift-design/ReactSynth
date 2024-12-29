import { useEffect, useRef, useState } from "react";
import { EdgeProps, getBezierPath } from "reactflow";



export default function Wire(props: EdgeProps) 
{
    const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;

    
    const pathRef = useRef<SVGPathElement>(null);

    const [x,       setX      ] = useState(0);
    const [y,       setY      ] = useState(0);
    const [width,   setWidth  ] = useState(0);
    const [height,  setHeight ] = useState(0);
    const [viewBox, setViewbox] = useState('0 0 100 100');


    useEffect(() =>
    {
        if (pathRef.current)
        {
            const bbox = pathRef.current.getBBox();
            //const pad  = 5;
            
            const x = Math.round(bbox.x);//      - pad;
            const y = Math.round(bbox.y);//      - pad;
            const w = Math.round(bbox.width) ;// + pad*2;
            const h = Math.round(bbox.height);// + pad*4;

            setX     (x);
            setY     (y);
            setWidth (w);
            setHeight(h);
            
            setViewbox(`${x} ${y} ${w} ${h}`);
        }
    },
    [props]);


    const [path] = getBezierPath(
    {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition
    });


    return (
        <svg 
            x       = {x}
            y       = {y}
            width   = {width} 
            height  = {height} 
            viewBox = {viewBox}
            style   = {{overflow: 'visible', outline: '1px solid red'}}
            >

            <defs>
                <filter id="shadow">   <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#07c8" /></filter>

                <filter id="shade2">   <feOffset dx="0" dy="0.8" result="offset" /></filter>
                <filter id="shade1">   <feOffset dx="0" dy="0.3" result="offset" /></filter>
                <filter id="body">     <feOffset dx="0" dy="-0.5" result="offset" /></filter>
                <filter id="highlight"><feOffset dx="0" dy="-0.6" result="offset" /></filter>
            </defs>
    
            <path
                d             = {path}
                fill          = 'none'
                stroke        = '#034'
                strokeWidth   = {3}
                strokeLinecap = 'round'
                filter        = 'url(#shadow) url(#shade2)'
            />

            <path
                d             = {path}
                fill          = 'none'
                stroke        = '#26b'
                strokeWidth   = {3}
                strokeLinecap = 'round'
                filter        = 'url(#shade1)'
            />

            <path
                d             = {path}
                ref           = {pathRef}
                id            = 'path'
                fill          = 'none'
                stroke        = '#08f'
                strokeWidth   = {2}
                strokeLinecap = 'round'
                filter        = 'url(#body)'
            />

            <path
                d             = {path}
                fill          = 'none'
                stroke        = '#fff5'
                strokeWidth   = {0.5}
                strokeLinecap = 'round'
                filter        = 'url(#highlight)'
            />
        </svg>
    );
}
