"use client";

import { Game, List, Prisma } from "@prisma/client";
import { Section } from "../section";
import Image from "next/image";
import UserNameBadge from "../user/userNameBadge";
import { FaHeart } from "react-icons/fa6";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Suspense, useState } from "react";
import BoxArt from "../boxartalt";

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
  big,
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
  big?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);

  // set default to false
  big = big ? big : false;

  const placeholders = [];
  for (let i = 0; i < 5 - games.length; i++) {
    placeholders.push(
      <li
        key={`placeholder-${i}`}
        id="list placeholder"
        className={`w-full h-full shadow-2xl bg-zinc-900 ${
          big == true ? "min-w-[calc(100%+8rem)]" : "min-w-[calc(100%+2rem)]"
        }`}
        style={{ aspectRatio: 81.06 / 108.09, zIndex: 5 - games.length - i }}
      >
        <div
          className={`rounded-sm-md h-full object-cover outline outline-0.5 outline-dark-grey heavy-shadow`}
        >
          {" "}
          {""}
        </div>
      </li>
    );
  }
  return (
    <div className="relative bg-zinc-900 w-full h-full">
      <ul
        id="List Images"
        style={{}}
        className={`grid grid-cols-5 justify-between h-full w-full rounded-sm-md shadow-xl ${
          big == true
            ? "mr-32 max-w-[calc(100%-8rem)]"
            : "mr-8 max-w-[calc(100%-2rem)]"
        } relative`}
      >
        {games.slice(0, 5).map((entry, index) => {
          console.log(index);
          const game = entry.game;
          return (
            <li
              className={`rounded-sm-md outline outline-0.5 outline-dark-grey bg-zinc-900  ${
                big == true
                  ? "min-w-[calc(100%+8rem)]"
                  : "min-w-[calc(100%+2rem)]"
              } w-fit h-full ${
                big == true ? "-mr-32 left-32" : "-mr-8 left-8"
              }  `}
              style={{ zIndex: 5 - index }}
              key={game.slug}
            >
              <Suspense fallback={<BoxArt />}>
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_${"big_2x"}/${
                    game.cover
                  }.jpg`}
                  height={374}
                  width={264}
                  alt={game.name}
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  className={`w-full h-full object-cover heavy-shadow`}
                  onLoad={(e) => setLoaded(true)}
                  style={{
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)",
                  }}
                />
              </Suspense>
            </li>
          );
        })}
        {placeholders}
      </ul>
      <div
        id="Outline"
        style={{ zIndex: 10 }}
        className="smooth-transition outline outline-0.5 outline-dark-grey rounded-sm-md hover:-outline-offset-2 hover:outline-2 hover:outline-accent-green absolute top-0 bottom-0 w-full h-full"
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
  big,
}: {
  list: ListWithGames;
  id?: string;
  big?: boolean;
}) => {
  big = big ? big : false;
  return (
    <div className="flex flex-col w-full h-full py-2" id={id}>
      <Link className="w-full h-full" href={`/list/${list.slug}`}>
        <ListGames big={big} games={list.games} />
      </Link>
      <div className="w-full h-full">
        <Link href={`/list/${list.slug}`}>
          <h2
            className={`font-semibold text-neutral-50 ${big ? "text-lg" : ""}`}
          >
            {" "}
            {list.name}{" "}
          </h2>
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

export const ListWithDescription = ({ list }: { list: ListWithGames }) => {
  return (
    <div key={list.slug} className="w-full flex flex-row py-4">
      <Link key={list.slug} href={`/list/${list.slug}`} className="basis-1/3">
        <ListGames className="max-h-full" games={list.games}></ListGames>
      </Link>
      <div className="px-4">
        <Link key={list.slug} href={`/list/${list.slug}`} className="basis-1/3">
          <h2 className="text-xl font-semibold text-neutral-50">
            {" "}
            {list.name}{" "}
          </h2>
        </Link>
        <small className="text-discrete-grey/85 font-light">
          {" "}
          {`${list.games.length} games`}{" "}
        </small>
        <p> {list.description} </p>
      </div>
    </div>
  );
};

export const PlaceholderList = () => {
  return (
    <div className="flex flex-col w-full py-2 gap-1">
      <Skeleton className="w-full h-24" />
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="w-36 h-5 " />
        <span className="flex flex-row gap-2 place-items-center w-full">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-40 h-3" />
        </span>
      </div>
    </div>
  );
};

export const PlaceholderListsAside = () => {
  return (
    <div className="w-full">
      <PlaceholderList />
      <PlaceholderList />
      <PlaceholderList />
    </div>
  );
};

export const PlaceholderListWithDescription = () => {
  return (
    <div className="w-full flex flex-row py-4">
      <Skeleton className="w-56 h-24" />
      <div className="px-4 flex flex-col gap-1">
        <Skeleton className="w-24 h-7" />
        <Skeleton className="w-12 h-3" />
        <Skeleton className="w-72 h-4" />
      </div>
    </div>
  );
};
