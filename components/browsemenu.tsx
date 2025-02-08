"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { MouseEventHandler, useCallback } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { DropdownTab } from "./dropdown";

const BrowseMenu = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleButton = useCallback(
    ({ inParams }: { inParams?: { param: string; value: string }[] }) => {
      {
        /** These variable names are a mess... I should change them later */
      }
      const params = new URLSearchParams(searchParams);
      console.log("params: " + params.toString());
      if (!inParams) return;
      for (const pair of inParams) {
        params.set(pair.param, pair.value);
      }
      replace(`/games/browse/?${params.toString()}`);
    },
    [searchParams, replace]
  );

  const Listing = ({
    children,
    param,
    value,
  }: {
    children: React.ReactNode;
    param?: string;
    value?: string;
  }) => {
    return (
      <li>
        <button
          className="dropdown-link w-full h-full text-start hover:text-white py-0.5"
          onClick={() => {
            if (param && value)
              handleButton({ inParams: [{ param: param, value: value }] });
          }}
          value={""}
        >
          {" "}
          {children}{" "}
        </button>
      </li>
    );
  };

  return (
    <div
      className={`flex flex-row bg-primary/25 outline-1 outline outline-dark-grey divide-x divide-dark-grey rounded-sm text-xs ${className}`}
    >
      <DropdownTab name="Year">
        <Listing
          param="filter"
          value={`first_release_date > ${Math.trunc(Date.now() / 1000)}`}
        >
          {" "}
          Upcoming{" "}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            2024
          )} & first_release_date <= ${Math.trunc(Date.now())}`}
        >
          {" "}
          This Year{" "}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            2020
          )} & first_release_date <= ${Math.trunc(Date.now() / 1000)}`}
        >
          {`2020's`}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            2010
          )} & first_release_date < ${getTime(2020)}`}
        >
          {" "}
          {`2010's`}{" "}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            2000
          )} & first_release_date < ${getTime(2010)}`}
        >
          {" "}
          {`2000's`}{" "}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            1990
          )} & first_release_date < ${getTime(2000)}`}
        >
          {" "}
          {`1990's`}{" "}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            1980
          )} & first_release_date < ${getTime(1990)}`}
        >
          {" "}
          {`1980's`}{" "}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            1970
          )} & first_release_date < ${getTime(1980)}`}
        >
          {" "}
          {`1970's`}
        </Listing>
        <Listing
          param="filter"
          value={`first_release_date >= ${getTime(
            1960
          )} & first_release_date < ${getTime(1970)}`}
        >
          {" "}
          {`1960's`}
        </Listing>
      </DropdownTab>

      <DropdownTab name="Rating">
        <Listing param="sort" value="desc">
          Highest First
        </Listing>
        <Listing param="sort" value="asc">
          Lowest First
        </Listing>
      </DropdownTab>

      <DropdownTab name="Popular"> </DropdownTab>
      <DropdownTab name="Genre">
        <Listing param="filter" value="genres = [2]">
          {" "}
          Point & Click{" "}
        </Listing>
        <Listing param="filter" value="genres = [4]">
          {" "}
          Fighting{" "}
        </Listing>
        <Listing param="filter" value="genres = [5]">
          {" "}
          Shooter{" "}
        </Listing>
        <Listing param="filter" value="genres = [7]">
          Music
        </Listing>
        <Listing param="filter" value="genres = [8]">
          {" "}
          Platformer{" "}
        </Listing>
        <Listing param="filter" value="genres = [9]">
          {" "}
          Puzzle{" "}
        </Listing>
        <Listing param="filter" value="genres = [10]">
          {" "}
          Racing{" "}
        </Listing>
        <Listing param="filter" value="genres = [11]">
          {" "}
          RTS{" "}
        </Listing>
        <Listing param="filter" value="genres = [12]">
          {" "}
          RPG{" "}
        </Listing>
        <Listing param="filter" value="genres = [13]">
          {" "}
          Simulator{" "}
        </Listing>
        <Listing param="filter" value="genres = [14]">
          {" "}
          Sport{" "}
        </Listing>
        <Listing param="filter" value="genres = [15]">
          {" "}
          Strategy{" "}
        </Listing>
        <Listing param="filter" value="genres = [16]">
          {" "}
          Turn-Based Strategy{" "}
        </Listing>
        <Listing param="filter" value="genres = [24]">
          {" "}
          Tactical{" "}
        </Listing>
        <Listing param="filter" value="genres = [25]">
          {" "}
          {`Hack & Slash / Beat 'em up`}{" "}
        </Listing>
        <Listing param="filter" value="genres = [26]">
          {" "}
          Trivia{" "}
        </Listing>
        <Listing param="filter" value="genres = [30]">
          {" "}
          Pinball{" "}
        </Listing>
        <Listing param="filter" value="genres = [31]">
          {" "}
          Adventure{" "}
        </Listing>
        <Listing param="filter" value="genres = [32]">
          {" "}
          Indie{" "}
        </Listing>
        <Listing param="filter" value="genres = [33]">
          {" "}
          Arcade{" "}
        </Listing>
        <Listing param="filter" value="genres = [34]">
          {" "}
          Visual Novel{" "}
        </Listing>
        <Listing param="filter" value="genres = [35]">
          {" "}
          Card & Board Game{" "}
        </Listing>
        <Listing param="filter" value="genres = [36]">
          {" "}
          MOBA{" "}
        </Listing>
      </DropdownTab>
      <DropdownTab name="Platform"> </DropdownTab>
    </div>
  );
};

export default BrowseMenu;

const getTime = (Year: number, Month?: number, Day?: number) => {
  Month = Month || 1;
  Day = Day || 1;
  return Math.trunc(new Date(Year, Month, Day).getTime() / 1000);
};
