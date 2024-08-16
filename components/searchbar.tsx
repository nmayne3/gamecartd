import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Game } from "@/igdb/interfaces";
import { GetGames, SearchGame, fetchSearchResults } from "@/igdb/api";
import debounce from "lodash.debounce";
import { GetReleaseYear } from "@/igdb/helpers";
import Link from "next/link";

const Searchbar = () => {
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
    <section className="">
      <div className="peer group search-bar z-10 w-32 h-6 flex flex-row place-items-center rounded-full text-trimary bg-opacity-25 pointer-events-none bg-header-light-grey active:bg-white group-active:bg-white focus-within:bg-white group-hover:bg-opacity-100">
        <input
          onChange={debounceResults}
          name="SearchField"
          type="text"
          id="search"
          className="w-full h-full pl-3 outline-none bg-transparent rounded-full pointer-events-auto group-active:bg-white active:bg-white peer"
        />
        <FaMagnifyingGlass className="mr-2.5 ml-1 scale-[140%] fill-header-light-grey group-hover:fill-trimary peer-focus:fill-trimary">
          {" "}
        </FaMagnifyingGlass>
      </div>
      {resultingGames.length > 0 && (
        <div className="absolute mt-1 hidden peer-focus-within:block hover:block drop-shadow-md">
          <ul className="bg-menu-primary divide-y text-xxs divide-dark-grey rounded-md capitalize overflow-hidden">
            {resultingGames.map((game) => (
              <Link key={game.name} href={`/game/${game.slug}`}>
                <SearchResult>
                  {" "}
                  {`${game.name} (${GetReleaseYear(game)})`}{" "}
                </SearchResult>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Searchbar;

const SearchResult = ({
  children,
}: {
  children?: React.ReactNode | string;
}) => {
  return (
    <li className="bg-transparent hover:bg-accent-green text-white font-normal p-2">
      {" "}
      {children}{" "}
    </li>
  );
};
