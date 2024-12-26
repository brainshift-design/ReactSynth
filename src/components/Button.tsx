import { ReactNode } from 'react';

import styles from './Button.module.css';



interface ButtonProps
{
    children: ReactNode;
    onClick?: () => void;
}



export default function Button({ children, onClick }: ButtonProps)
{
    return (
        <button 
            className = {styles.button}
            onClick   = {onClick}>
            {children}
        </button>
    );
}
