import { CSSProperties, ReactNode } from 'react';

import styles from './Button.module.css';



interface ButtonProps
{
    children: ReactNode;
    style?:   CSSProperties;
    onClick?: () => void;
}



export default function Button({ children, style, onClick }: ButtonProps)
{
    return (
        <button 
            className = {styles.button}
            style     = {style}
            onClick   = {onClick}>
            {children}
        </button>
    );
}
