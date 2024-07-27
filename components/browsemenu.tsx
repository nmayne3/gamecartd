import { FaAngleDown } from "react-icons/fa6";

const BrowseMenu = () => {
  return (
    <div className="flex flex-row bg-primary/25 outline-1 outline outline-dark-grey divide-x divide-dark-grey rounded-sm ">
      <Tab name="Year"> </Tab>
      <Tab name="Rating"> </Tab>
      <Tab name="Popular"> </Tab>
      <Tab name="Genre"> </Tab>
      <Tab name="Service"> </Tab>
      <Tab name="Other"> </Tab>
    </div>
  );
};

export default BrowseMenu;

const Tab = ({
  name,
  children,
}: {
  name: string;
  children?: React.ReactNode;
}) => {
  return (
    <div>
      <div className="bg-transparent uppercase flex flex-row p-2 place-items-center gap-1">
        {name}
        <FaAngleDown />
      </div>
    </div>
  );
};
