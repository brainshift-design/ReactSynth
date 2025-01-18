import { CSSProperties, ReactNode } from 'react';

import styles from './PanelButton.module.css';

interface PanelButtonProps {
    children: ReactNode;
    style?: CSSProperties;
    onClick?: () => void;
    onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerUp?: () => void;
    onPointerMove?: () => void;
    onPointerEnter?: () => void;
    onPointerLeave?: () => void;
}

export default function PanelButton({
    children,
    style,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
}: PanelButtonProps) {
    return (
        <button
            className={styles.button}
            style={style}
            onClick={onClick}
            onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                onPointerDown?.(e);
            }}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        >
            {children}
        </button>
    );
}
