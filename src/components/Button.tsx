import { CSSProperties, ReactNode } from 'react';

import styles from './Button.module.css';



interface ButtonProps
{
    children:        ReactNode;
    style?:          CSSProperties;
    onClick?:        () => void;
    onPointerDown?:  () => void;
    onPointerUp?:    () => void;
    onPointerMove?:  () => void;
    onPointerEnter?: () => void;
    onPointerLeave?: () => void;
}



export default function Button({ 
    children, 
    style, 
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerEnter,
    onPointerLeave
}: ButtonProps)
{
    return (
        <button 
            className      = {styles.button}
            style          = {style}
            onClick        = {onClick}
            onPointerDown  = {onPointerDown}
            onPointerUp    = {onPointerUp}
            onPointerMove  = {onPointerMove}
            onPointerEnter = {onPointerEnter}
            onPointerLeave = {onPointerLeave}
            >
            {children}
        </button>
    );
}
