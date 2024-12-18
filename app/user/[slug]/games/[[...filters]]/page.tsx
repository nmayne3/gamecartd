import RowGames from "@/components/rowgames";
import { GetGames } from "@/igdb/api";
import { Game } from "@/igdb/interfaces";
import Link from "next/link";
import BoxArt from "@/components/boxartalt";
import BrowseMenu from "@/components/browsemenu";
import { useMemo } from "react";
import { SectionHeader } from "@/components/section";
import Button from "@/components/button";
import PageButtons from "@/components/pagebutton";
import type { Metadata } from "next";
import { GetUser } from "@/app/api/games/actions";
import prisma from "@/lib/prisma";
import { tree } from "next/dist/build/templates/app-page";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export const metadata: Metadata = {
  title: "Games • Gamecartd",
  description: "Get your game on",
};

const BrowsePage = async ({
  params,
}: {
  params: {
    slug: string;
    filters: string;
  };
}) => {
  const user_slug = params.slug;
  console.log(user_slug);

  const slugs = params.filters;
  const Params = separateParameters(slugs);
  const constructedWhere = Params.get("genres")
    ? {
        genres: {
          some: {
            slug: { contains: Params.get("genres") },
          },
        },
      }
    : {};

  const constructedBy =
    Params.get("rating") == "asc"
      ? { user_rating: "asc" }
      : { user_rating: "desc" };

  const user = await prisma.user.findUnique({
    where: {
      slug: user_slug,
    },
    include: {
      games: {
        where: constructedWhere,
      },
    },
  });

  console.log(user?.games);
  const games = user?.games ? user.games : [];
  console.log(games);

  return (
    <main className="w-full">
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />
      <div className="bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x w-full h-full">
        <section className="max-w-screen-lg h-full w-full flex flex-col justify-self-center mx-auto divide-y divide-secondary py-8">
          {/** Header with Filter Menu */}
          <SectionHeader title="Games">
            {" "}
            <FiltersMenubar userSlug={user_slug} />
          </SectionHeader>
          {/** Table of Games */}
          <div className="grid grid-cols-12 grid-flow-row gap-2 place-items-center py-2 ">
            {games.map((game) => (
              <div key={game.slug} className="h-full w-full ">
                <Link key={game.slug} href={`/game/${game.slug}`}>
                  <BoxArt game={game} size="small"></BoxArt>
                </Link>
              </div>
            ))}
          </div>
          {/** Next / Previous Page Buttons */}
          <PageButtons />
        </section>
      </div>
    </main>
  );
};

export default BrowsePage;

const Games = ({
  games,
  rowCount,
}: {
  games: Array<Game>;
  rowCount?: number;
}) => {
  rowCount = rowCount ? rowCount : 6;

  const rowGames = [];
  const gamesPerRow = games.length / rowCount;
  for (let i = 0; i < rowCount; i++) {
    const start = i * gamesPerRow;
    const end = start + gamesPerRow;
    rowGames.push(<RowGames games={games.slice(start, end)} />);
  }

  return <div>{rowGames}</div>;
};

const separateParameters = (slugs: string) => {
  console.log("Separating Params");
  const Params = new Map<string, string>();
  if (!slugs) {
    console.log("no params???");
    return Params;
  }
  const start = slugs[0] == "popular" ? 1 : 0;
  for (let i = start; i < slugs.length - 1; i++) {
    Params.set(slugs[i], slugs[++i]);
  }

  console.log("printing params...");
  for (const [key, value] of Params) {
    console.log(`${key}: ${value}`);
  }
  console.log("\nprinting completed.");
  return Params;
};

class QueryParam {
  field: String;
  value: String;
  constructor(field: string, value?: string) {
    this.field = field;
    this.value = value ? value : "";
  }
}

function slugToAPI(param: QueryParam) {
  switch (param.field) {
    case "decade":
      return;
    case "genres":
      return;
    case "by":
      return;
    case "this":
      return;
  }
}

const FiltersMenubar = async ({ userSlug }: { userSlug: string }) => {
  const genres = await prisma.genre.findMany({
    select: {
      name: true,
      slug: true,
    },
  });

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger> Year </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger> Rating </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Ascending</MenubarItem>
          <MenubarItem>Descending</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger> Genre </MenubarTrigger>
        <MenubarContent>
          {genres.map((genre) => {
            return (
              <MenubarItem key={genre.slug}>
                <Link href={`/user/${userSlug}/games/genres/${genre.slug}/`}>
                  {genre.name}
                </Link>
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
