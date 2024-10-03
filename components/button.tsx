"use client";

const Button = ({
  className,
  children,
  onClick,
}: {
  className?: String;
  children?: React.ReactNode;
  onClick?: Function;
}) => {
  return (
    <button
      onClick={() => {
        onClick?.();
      }}
      className={`bg-secondary/75 rounded-sm-md h-fit pt-[0.06rem] shadow-inner whitespace-nowrap overflow-hidden hover:brightness-125 ${className}`}
    >
      <div className="p-1 bg-dark-grey rounded-sm-md "> {children} </div>
    </button>
  );
};

export default Button;
