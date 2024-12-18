"use client";

import { Game } from "@prisma/client";
import { Section } from "./section";
import Image from "next/image";

export const ListGames = ({ backlog }: { backlog: Game[] }) => {
  const placeholders = [];
  for (let i = 0; i < 5 - backlog.length; i++) {
    placeholders.push(
      <li
        key={`placeholder-${i}`}
        id="list placeholder"
        className="w-fit h-full shadow-2xl bg-zinc-900"
        style={{ aspectRatio: 81.06 / 108.09, zIndex: 5 - backlog.length - i }}
      >
        <div className="rounded-sm-md h-full object-cover  aspec outline outline-0.5 outline-dark-grey">
          {" "}
          {""}
        </div>
      </li>
    );
  }
  return (
    <div className="relative bg-zinc-900">
      <ul
        id="List Images"
        style={{}}
        className="grid grid-cols-5 my-2 justify-between rounded-sm-md shadow-xl mr-8 relative"
      >
        {backlog.slice(0, 5).map((game, index) => {
          console.log(index);
          return (
            <li
              className={` w-fit -mr-8 left-8 shadow-2xl `}
              style={{ zIndex: 5 - index }}
              key={game.slug}
            >
              <Image
                src={`https://images.igdb.com/igdb/image/upload/t_cover_${"big_2x"}/${
                  game.cover
                }.jpg`}
                height={374}
                width={264}
                alt={game.name}
                className={`rounded-sm-md h-full w-full object-cover `}
              />
            </li>
          );
        })}
        {placeholders}
      </ul>
      <div
        id="Outline"
        style={{ zIndex: 10 }}
        className="smooth-transition outline outline-0.5 outline-dark-grey rounded-sm-md hover:-outline-offset-2 hover:outline-2 hover:outline-accent-green absolute top-0 bottom-0 w-full"
      />
    </div>
  );
};
