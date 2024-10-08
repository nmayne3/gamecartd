export const Section = ({
  header,
  children,
  className,
}: {
  header: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={`w-full h-fit ${className}`}>
      {/** Header Section */}
      <div
        id="Section Heading"
        className="w-full border-b border-secondary uppercase py-0.5 flex flex-row justify-between text-xs"
      >
        <h4 className="hover:text-blue-400"> {header} </h4>
        <h4 className="hover:text-blue-400"> More </h4>
      </div>
      {/** Content Section */}
      <div
        id="Section Content"
        className="w-full max-h divide-y-1 divide-dark-grey"
      >
        {children}
      </div>
    </section>
  );
};

export const SectionHeader = ({
  title,
  children,
  className,
  more,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
  more?: Boolean;
}) => {
  more = more ? more : true;
  return (
    <div className={`w-full h-fit ${className}`}>
      {/** Header Section */}
      <div
        id="Section Heading"
        className="w-full border-b border-secondary uppercase py-0.5 flex flex-row justify-between text-xs place-items-baseline"
      >
        <h4 className="hover:text-blue-400 text-justify"> {title} </h4>
        <div className="flex flex-row justify-evenly gap-8">
          {children}
          {more && <h4 className="hover:text-blue-400"> More </h4>}
        </div>
      </div>
    </div>
  );
};
