"use client";

import { Game, List, Prisma } from "@prisma/client";
import { Section } from "./section";
import Image from "next/image";
import UserNameBadge from "./user/userNameBadge";
import { FaHeart } from "react-icons/fa6";
import Link from "next/link";

type ListWithGames = Prisma.ListGetPayload<{
  include: {
    games: { include: { game: true } };
    author: true;
    _count: { select: { likedBy: true } };
  };
}>;

export const ListGames = ({
  games,
  className,
}: {
  games: ({
    game: {
      id: string;
      name: string;
      slug: string;
      tags: string[];
      summary: string | null;
      cover: string | null;
      first_release_date: Date | null;
    };
  } & {
    id: string;
    description: string | null;
    gameId: string;
    listId: string;
    createdAt: Date;
  })[];
  className?: string;
}) => {
  const placeholders = [];
  for (let i = 0; i < 5 - games.length; i++) {
    placeholders.push(
      <li
        key={`placeholder-${i}`}
        id="list placeholder"
        className="w-fit h-full shadow-2xl bg-zinc-900"
        style={{ aspectRatio: 81.06 / 108.09, zIndex: 5 - games.length - i }}
      >
        <div
          className={`rounded-sm-md h-full object-cover  aspec outline outline-0.5 outline-dark-grey`}
        >
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
        className="grid grid-cols-5  justify-between rounded-sm-md shadow-xl mr-8 relative"
      >
        {games.slice(0, 5).map((entry, index) => {
          console.log(index);
          const game = entry.game;
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

export const BacklogGames = ({ backlog }: { backlog: Game[] }) => {
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

// Component which displays list preview alongside name and info
export const ListBlock = ({
  list,
  id,
}: {
  list: ListWithGames;
  id?: string;
}) => {
  return (
    <div className="flex flex-col w-full py-2" id={id}>
      <Link href={`/list/${list.slug}`}>
        <ListGames games={list.games} />
      </Link>
      <div className="w-full">
        <Link href={`/list/${list.slug}`}>
          <h2 className="font-semibold text-neutral-50"> {list.name} </h2>
        </Link>
        <span className="flex flex-row gap-2 place-items-center">
          <UserNameBadge user={list.author} />
          <small className="text-xs text-menu-primary">
            {" "}
            {`${list.games.length} games`}{" "}
          </small>
          {list._count.likedBy > 0 && (
            <div className="flex flex-row gap-1 items-center">
              <FaHeart className="fill-menu-primary scale-80" />
              <small className="text-xs text-menu-primary">
                {" "}
                {list._count.likedBy}{" "}
              </small>
            </div>
          )}
        </span>
      </div>
    </div>
  );
};
