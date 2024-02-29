import {ReactNode} from "react";

import React, { MouseEventHandler } from 'react';
import Link from 'next/link';
import classNames from "classnames";

interface NPButtonProps {
    label?: string;
    type?: 'outlined' | 'filled';
    color?: 'purple' | 'green';
    icon?: React.ReactElement | string;
    href?: string;
    disabled?: boolean;
    onClick?: (() => MouseEventHandler | void);
    children?: string;
}

const NPButton: React.FC<NPButtonProps> = ({
    type,
    color,
    label,
    icon,
    href,
    disabled,
    onClick,
    children
}) => {

    const props = {
        title: label || children?.toString(),
        className: classNames(
            `
                flex-grow
                rounded-lg
                px-4 py-2
                text-xl
                font-medium
                transition-colors
                duration-100
                ease-in-out
            `,
            color === "purple" ? "bg-[rgb(49_37_76)] text-[rgb(147_62_171)] hover:bg-[rgb(83_39_107)]" :
            color === "green" ? "bg-[rgb(23_95_88)] text-[rgb(48_221_189)] hover:bg-[rgb(23_109_93)]" : "",
            disabled ? "opacity-50" : "",
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
            <button {...props}>
                { childrenElements }
            </button>
        );
    } else {
        return (
            <Link href={ href } {...props}>
                { childrenElements }
            </Link>
        );
    }
}

export default NPButton;
