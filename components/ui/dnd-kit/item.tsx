import React, { forwardRef } from "react";

type Props = {
  children?: React.ReactNode;
  style?: { transform: string | undefined; transition: string | undefined };
};

export const Item = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      style,
      ...props
    }: {
      children?: React.ReactNode;
      style?: { transform: string | undefined; transition: string | undefined };
    },
    ref
  ) => {
    return (
      <div className="w-full h-full" style={style} {...props} ref={ref}>
        {children}
      </div>
    );
  }
);
