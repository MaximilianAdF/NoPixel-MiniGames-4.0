import {ReactNode} from "react";

import React, { MouseEventHandler } from 'react';
import Link from 'next/link';
import classNames from "classnames";

interface NPButtonProps {
    label?: string;
    type?: 'outlined' | 'filled';
    color?: 'purple' | 'green' | 'red';
    icon?: React.ReactElement | string;
    href?: string;
    disabled?: boolean;
    onClick?: (() => MouseEventHandler | void);
    children?: string;
    className?: string;
    // Increments on each opponent button-press in 1v1 spectator views.
    // When it changes we remount the button via the React `key`, which
    // replays the np-button-pulse animation from scratch. Undefined ⇒
    // no pulse behaviour (interactive case).
    pulseKey?: number;
}

const NPButton: React.FC<NPButtonProps> = ({
    type,
    color,
    label,
    icon,
    href,
    disabled,
    onClick,
    children,
    className,
    pulseKey
}) => {

    const props = {
        title: label || children?.toString(),
        className: classNames(
            `
                ${className}
                rounded-lg
                px-4 py-2
                text-xl
                font-medium
                transition-colors
                duration-100
                ease-in-out
                disabled:opacity-50
            `,
            color === "purple" ? "bg-vivid-violet-600/25 text-vivid-violet-600 enabled:hover:bg-vivid-violet-600/50" :
            color === "green" ? "bg-turquoise-400/25 text-turquoise-400 enabled:hover:bg-turquoise-400/50" : "",
            color === "red" ? "bg-rose-400/25 text-rose-400 enabled:hover:bg-rose-400/50" : "",
            pulseKey !== undefined && "np-button-pulse",
        ),
        'aria-label': label || children?.toString(),
        disabled: disabled,
        onClick: onClick
    };

    const childrenElements = (
        <>
            { icon && icon }
            { children && children }
        </>
    );

    if (!href) {
        return (
            <button key={pulseKey ?? 'static'} {...props}>
                { childrenElements }
            </button>
        );
    } else {
        return (
            <Link key={pulseKey ?? 'static'} href={ href } {...props}>
                { childrenElements }
            </Link>
        );
    }
}

export default NPButton;
