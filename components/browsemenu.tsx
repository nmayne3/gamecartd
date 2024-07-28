import { FaAngleDown } from "react-icons/fa6";

const BrowseMenu = () => {
  return (
    <div className="flex flex-row bg-primary/25 outline-1 outline outline-dark-grey divide-x divide-dark-grey rounded-sm ">
      <DropdownTab name="Year" />
      <DropdownTab name="Rating" />
      <Tab name="Popular"> </Tab>
      <Tab name="Genre"> </Tab>
      <Tab name="Service"> </Tab>
      <Tab name="Other"> </Tab>
    </div>
  );
};

export default BrowseMenu;

const DropdownTab = ({ name }: { name: string }) => {
  return (
    <div id={`${name} dropdown tab`} className="group">
      <Tab name={name} className={`group group-hover:bg-dark-grey`}></Tab>
      <div
        id={`${name} dropdown content`}
        className={`hidden group-hover:block`}
      >
        <ul className="bg-secondary rounded-b-sm p-2 absolute divide-y divide-dark-grey z-10 drop-shadow-md capitalize">
          <li>All</li>
          <li>Upcoming</li>
          <li>2020s</li>
        </ul>
      </div>
    </div>
  );
};

const Listing = ({ name }: { name: string }) => {
  return <li id={`${name}`} className="hover:bg-inherit/hover"></li>;
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
        className={`bg-transparent uppercase flex flex-row p-2 place-items-center gap-1`}
      >
        {name}
        <FaAngleDown />
      </div>
    </div>
  );
};
