import Link from "next/link";

export const Section = ({
  header,
  children,
  className,
  href,
  more,
}: {
  header: string;
  children?: React.ReactNode;
  className?: string;
  href?: string;
  more?: string;
}) => {
  return (
    <section className={`w-full h-fit ${className}`}>
      {/** Header Section */}
      <div
        id="Section Heading"
        className="w-full border-b border-secondary uppercase py-0.5 flex flex-row justify-between text-xs"
      >
        {href && (
          <Link href={href}>
            <h4 className="hover:text-blue-400"> {header} </h4>
          </Link>
        )}
        {!href && <h4 className="hover:text-blue-400"> {header} </h4>}
        {href && (
          <Link href={href}>
            <h4 className="hover:text-blue-400"> {more ? more : "More"} </h4>
          </Link>
        )}
      </div>
      {/** Content Section */}
      <div
        id="Section Content"
        className="w-full h-full divide-y-1 divide-dark-grey"
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
