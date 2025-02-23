"use client";

import {
  ChangeEvent,
  CSSProperties,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Game } from "@/igdb/interfaces";
import { GetGames, SearchGame, fetchSearchResults } from "@/igdb/api";
import debounce from "lodash.debounce";
import { GetReleaseYear } from "@/igdb/helpers";
import Link from "next/link";
import { Input } from "../ui/input";

const Searchbar = ({
  className,
  onClick,
  style,
}: {
  className?: string;
  onClick?: (game: string) => void;
  style?: CSSProperties;
}) => {
  const [inputElem, setInputElem] = useState("");
  const [resultingGames, setResultingGames] = useState(Array<Game>);

  const handleSearch = async (input: string) => {
    console.log(input);
    setInputElem(input);
    if (input == "") {
      setResultingGames([]);
      return;
    }
    const games = await fetchSearchResults(input);
    setResultingGames(games);
  };

  useEffect(() => {
    return () => {
      debounceResults.cancel();
    };
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  }, []);

  const debounceResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, [handleChange]);

  return (
    <div className="w-72 h-full">
      <Input
        onChange={debounceResults}
        name="SearchField"
        type="text"
        id="search"
        placeholder="Enter name of game..."
        className={`w-full h-full pl-3 input-field peer ${className}`}
        style={style}
      />
      {resultingGames.length > 0 && (
        <div className="absolute pt-1 hidden peer-focus-within:block hover:block drop-shadow-md max-w-72 z-10">
          <ul className="bg-menu-primary divide-y text-xs divide-dark-grey rounded-md capitalize overflow-hidden w-full z-10">
            {resultingGames.map((game) => {
              if (onClick) {
                return (
                  <SearchResult
                    key={game.slug}
                    onClick={() => {
                      onClick(game.slug);
                    }}
                  >
                    {" "}
                    {`${game.name} (${GetReleaseYear(game)})`}{" "}
                  </SearchResult>
                );
              } else {
                return (
                  <li
                    key={game.slug}
                    className="w-full bg-transparent hover:bg-accent-green text-white font-light  z-50 "
                  >
                    <Link
                      className={`w-full block p-2`}
                      href={`/game/${game.slug}`}
                    >
                      {`${game.name} (${GetReleaseYear(game)})`}{" "}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchbar;

const SearchResult = ({
  children,
  onClick,
}: {
  children?: React.ReactNode | string;
  onClick?: MouseEventHandler<HTMLLIElement>;
}) => {
  return (
    <li
      onClick={onClick}
      className="bg-transparent hover:bg-accent-green text-white font-normal p-2 z-50"
    >
      {" "}
      {children}{" "}
    </li>
  );
};
