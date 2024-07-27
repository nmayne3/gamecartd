import { FaMagnifyingGlass } from "react-icons/fa6";

const Searchbar = () => {
  return (
    <div className="search-bar z-10 w-32 h-6 flex flex-row place-items-center rounded-full text-trimary bg-opacity-25 pointer-events-none bg-header-light-grey active:bg-white  focus-within:bg-white group-hover:bg-opacity-100">
      <input
        name="SearchField"
        type="text"
        id="search"
        className="w-full h-full pl-3 outline-none bg-transparent rounded-full group/search pointer-events-auto active:bg-white peer"
      />
      <FaMagnifyingGlass className="mr-2.5 ml-1 scale-[140%] fill-header-light-grey group-hover:fill-trimary peer-focus:fill-trimary ">
        {" "}
      </FaMagnifyingGlass>
    </div>
  );
};

export default Searchbar;
