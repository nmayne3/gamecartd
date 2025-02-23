import React, { ForwardedRef, forwardRef } from "react";

type Props = {
  children?: React.ReactNode;
  style?: { transform: string | undefined; transition: string | undefined };
};

export const DnDItem = forwardRef(
  (
    {
      children,
      style,
      ...props
    }: {
      children?: React.ReactNode;
      style?: { transform: string | undefined; transition: string | undefined };
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div className="w-full h-full" style={style} {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

DnDItem.displayName = "DnDItem";
