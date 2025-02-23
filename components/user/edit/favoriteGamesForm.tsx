"use client";

import { Game } from "@prisma/client";
import BoxArt from "../../boxartalt";

import SortableGameList from "./sortableGameList";
import { Field } from "react-hook-form";
import { MutableRefObject } from "react";

/**
 *
 * Renders and handles favorite games form for use in User Settings
 *
 */

const FavortieGamesForm = ({
  games,
  favoritesRef,
}: {
  games: Game[];
  favoritesRef: MutableRefObject<
    | {
        name: string;
        id: string;
        slug: string;
        summary: string | null;
        cover: string | null;
        first_release_date: Date | null;
        tags: string[];
      }[]
    | undefined
  >;
}) => {
  console.log(games.length);

  return (
    <div className="">
      <label className="flex flex-row place-content-between items-baseline font-semibold text-lg">
        {`Favorite Games`}
        <small className="text-trimary/85 font-normal">
          {" "}
          Drag posters to reorder.{" "}
        </small>
      </label>
      <div className="flex fbun ddelex-row gap-3">
        <SortableGameList favorites={games} favoritesRef={favoritesRef} />
      </div>
    </div>
  );
};

export default FavortieGamesForm;
