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
        {/** Unhovered menu */}
        <Tab
          name={name}
          className={`group/drop group-hover/drop:bg-transparent rounded-sm bg-transparent rounded-b-none`}
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
        {/** Dropdown menu (appears when hovered) */}
        <div className="absolute hidden group-hover/drop:block group-hover/drop:text-dropdown-foreground *:bg-dropdown bg-popover-foreground w-fit -mt-[1px] pt-[1px] rounded-[3px] heavy-shadow dropdown-menu z-10">
          <div
            id={`${name} dropdown content`}
            className={`overflow-hidden min-w-fit w-full rounded-[3px] `}
          >
            <Tab
              name={name}
              className={` group-hover/drop:bg-dropdown text-white rounded-b-none border-b-1  group-hover/drop:border-menu-primary `}
            >
              {icon_src && (
                <Image
                  src={icon_src}
                  alt="Profile Picture"
                  className="outline-menu-primary -outline-offset-1 outline-1 outline rounded-full"
                  width={32}
                  height={32}
                />
              )}
            </Tab>
            <ul className="*:dropdown rounded-b-[3px] divide-menu-primary z-10 font-normal capitalize  overflow-hidden w-full *:w-full *:whitespace-nowrap py-1">
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
