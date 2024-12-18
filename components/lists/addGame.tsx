"use client";
import { Game } from "@prisma/client";
import BoxArt from "../boxartalt";
import { GetGameCombo } from "@/app/api/games/actions";
import { MutableRefObject, useRef, useState } from "react";
import Searchbar from "./searchgame";
import React from "react";
import Button from "../button";
import { Input } from "../ui/input";

const MARK = "✕";

const AddGame = ({
  refGames,
  ranked,
}: {
  refGames: MutableRefObject<any>;
  ranked?: boolean;
}) => {
  // Todo: Add inital games included in slug
  console.log(refGames);
  const createInitialGames = () => {
    const initialGames = Array<Game>();
    return initialGames;
  };

  const [games, setGames] = useState(createInitialGames);

  const addGameToList = async (slug: string) => {
    console.log("pushing games...");
    const game = await GetGameCombo(slug);
    setGames([game, ...games]);
    console.log(games);
  };

  const removeGameFromList = (index: number) => {
    const gamesList = [...games];
    gamesList.splice(index, 1);
    setGames(gamesList);
  };
  // Checks render?
  refGames.current = games;

  ranked = ranked ? ranked : false;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      usernameInput: HTMLInputElement;
    };
    formElements.usernameInput.value;
  }

  function stopPropagate(callback: () => void) {
    return (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      callback();
    };
  }

  return (
    <section id="Add a Game" className="h-full">
      <div className="flex place-content-between items-center">
        <div className="flex items-center py-4">
          <label className="bg-accent-green rounded-md rounded-r-none uppercase p-1 border border-accent-green border-b-accent-green-alt ">
            {" "}
            Add a Game{" "}
          </label>{" "}
          <Searchbar
            onClick={addGameToList}
            className="rounded-l-none h-full"
          />
        </div>
      </div>

      <ul className="border rounded-md border-border divide-y">
        {games.length < 1 && (
          <div className="text-center *:font-sans p-20">
            <h1 className="font-medium text-xl"> {`Your list is empty.`} </h1>
            <small className="text-menu-primary">
              {" "}
              {`Add games using the field above, or from a game's page.`}{" "}
            </small>
          </div>
        )}
        {games.map((game, index) => {
          return (
            <li
              key={index}
              className="flex flex-row p-3 h-20 place-content-between "
            >
              <div className="flex flex-row">
                {ranked && (
                  <div className="place-content-center mr-3 text-center">
                    <Input
                      className="aspect-square max-h-full max-w-full rounded-md text-center"
                      type="text"
                      defaultValue={(index + 1).toString()}
                      onKeyDown={(e) => {
                        console.log("stroking that shit");
                        if (e.code == "Enter") {
                          e.preventDefault();
                          console.log(Number(e.currentTarget.value));
                          setGames(
                            games.toSpliced(
                              Number(e.currentTarget.value) - 1,
                              0,
                              games.splice(index, 1)[0]
                            )
                          );
                          e.stopPropagation();
                          e.currentTarget.value = (index + 1).toString();
                        }
                      }}
                    />
                  </div>
                )}
                <div className="">
                  <BoxArt game={game} className="" />
                </div>
                <div className="px-3 inline-flex flex-row gap-1 items-baseline">
                  <h1 className="text-2xl"> {game.name} </h1>{" "}
                  <h2 className="">
                    {game.first_release_date
                      ? `${game.first_release_date.getFullYear()}`
                      : ""}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeGameFromList(index)}
                className="self-center text-border hover:text-orange-300"
              >
                {" "}
                {MARK}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AddGame;
