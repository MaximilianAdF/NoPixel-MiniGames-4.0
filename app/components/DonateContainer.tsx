import React, {FC, ReactNode} from "react";
import classNames from "classnames";

interface DonateContainerProps {
    children: ReactNode,
    title: string,
    description?: string,
    className?: string,
}

const DonateContainer: FC<DonateContainerProps> = ({
    children,
    title,
    description,
    className,
}) => {
    return (
        <div className={classNames("container", className)}>
            <h1 className="text-lg   sm:text-2xl   text-spring-green-300   [text-shadow:0_0_40px_rgb(127_255_191)]">{title}</h1>
            {description && <p className="text-xs   sm:text-base   text-[rgb(142_142_142)]">{description}</p>}
            {children}
        </div>
    );
};

export default DonateContainer;