export const Section = ({
  header,
  children,
}: {
  header: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="w-full h-fit">
      {/** Header Section */}
      <div className="w-full border-b border-secondary uppercase py-0.5 flex flex-row justify-between text-xs">
        <div className="hover:text-blue-400"> {header} </div>
        <div className="hover:text-blue-400"> More </div>
      </div>
      {/** Content Section */}
      <div className="w-full max-h">{children}</div>
    </div>
  );
};
