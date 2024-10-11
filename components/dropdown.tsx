import { FaAngleDown } from "react-icons/fa6";
import Image from "next/image";

export const DropdownTab = ({
  name,
  children,
  icon_src,
  className,
}: {
  name: string;
  children?: React.ReactNode;
  icon_src?: string;
  className?: string;
}) => {
  return (
    <div className="relative w-fit group/drop">
      <div
        id={`${name} dropdown tab`}
        className={`${className} inline-flex flex-col`}
      >
        <Tab
          name={name}
          className={`group/drop group-hover/drop:bg-secondary rounded-sm rounded-b-none`}
        >
          {icon_src && (
            <Image
              src={icon_src}
              alt="Profile Picture"
              className="outline-white/10 -outline-offset-1  outline-1 outline rounded-full"
              width={32}
              height={32}
            />
          )}
        </Tab>
        <div className="absolute group-hover/drop:shadow-2xl  ">
          <Tab
            name={name}
            className={`hidden group/drop group-hover/drop:block group-hover/drop:bg-menu-primary rounded-sm rounded-b-none border-b-1 group-hover/drop:border-secondary `}
          >
            {icon_src && (
              <Image
                src={icon_src}
                alt="Profile Picture"
                className="outline-white/10 -outline-offset-1  outline-1 outline rounded-full"
                width={32}
                height={32}
              />
            )}
          </Tab>
          <div
            id={`${name} dropdown content`}
            className={`hidden group-hover/drop:inline-block overflow-hidden w-full rounded-b-sm`}
          >
            <ul className="max-h-32 px-2 py-1 bg-menu-primary rounded-b-sm divide-y divide-dark-grey z-10 drop-shadow-md capitalize overflow-y-scroll overflow-hidden min-w-fit w-full">
              {children}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab = ({
  name,
  children,
  className,
}: {
  name: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`bg-transparent uppercase flex flex-row p-1 px-2 place-items-center gap-1`}
      >
        {children}
        {name}
        <FaAngleDown />
      </div>
    </div>
  );
};
