import RowGames from "@/components/rowgames";
import { GetGames } from "@/igdb/api";
import { Game } from "@/igdb/interfaces";
import Link from "next/link";
import BoxArt from "@/components/boxart";
import BrowseMenu from "@/components/browsemenu";
import { useMemo } from "react";
import { SectionHeader } from "@/components/section";
import Button from "@/components/button";
import PageButtons from "@/components/pagebutton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games • Gamecartd",
  description: "Get your game on",
};

const BrowsePage = async ({
  searchParams,
}: {
  searchParams?: {
    endpoint?: string;
    filter?: string;
    by?: string;
    sort?: string;
    page?: number;
  };
}) => {
  const endpoint = searchParams?.endpoint ? searchParams.endpoint : "games";
  const filter = searchParams?.filter
    ? searchParams.filter
    : "version_parent = null";
  const sort = searchParams?.sort ? searchParams.sort : "desc";
  const by = searchParams?.by ? searchParams.by : "aggregated_rating";
  const displayPerPage = 72;
  const page = searchParams?.page ? searchParams.page : 1;
  const offset = (page - 1) * displayPerPage;
  const fields =
    endpoint == "games"
      ? "name, cover.*, slug, first_release_date"
      : "game.name, game.cover.*, game.slug, game.first_release_date";

  const games = await useMemo(
    () =>
      GetGames({
        endpoint: endpoint,
        fields: fields,
        filter: filter,
        sort: `${by} ${sort}`,
        limit: 72,
        offset: offset,
      }),
    [endpoint, fields, filter, by, sort, offset]
  );

  return (
    <main className="w-full">
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />
      <div className="bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x w-full h-full">
        <section className=" max-w-screen-lg h-full w-full flex flex-col justify-self-center mx-auto divide-y divide-secondary py-8">
          {/** Header with Filter Menu */}
          <SectionHeader title="Games">
            {" "}
            <BrowseMenu />{" "}
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
