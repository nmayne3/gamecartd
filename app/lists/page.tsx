import { GetGames } from "@/igdb/api";
import { Section, SectionHeader } from "@/components/section";
import RowGames from "@/components/rowgames";
import BrowseMenu from "@/components/browsemenu";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ReviewCard } from "@/components/reviewcardalt";
import ProfileBadge from "@/components/user/ProfileBadge";
import Searchbar from "@/components/lists/searchgame";
import {
  ListBlock,
  ListWithDescription,
} from "@/components//lists/displaylist";
import Button from "@/components/button";
import Link from "next/link";
import PopularUsers, { PlaceholderUser } from "@/components/games/popularUsers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Lists • Gamecartd",
  description: "Get your game on",
};

const ListsPage = async () => {
  // Todo: Update schema to include when a like was made
  const popularLists = await prisma.list.findMany({
    include: {
      games: { include: { game: true } },
      author: true,
      _count: { select: { likedBy: true } },
    },
    orderBy: { likedBy: { _count: "desc" } },
    take: 3,
  });

  const recentLists = await prisma.list.findMany({
    include: {
      games: { include: { game: true } },
      author: true,
      _count: { select: { likedBy: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <main className="">
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />

      <div className="w-full bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x">
        <div className="p-4  max-w-[1000px] mx-auto ">
          <div className="flex flex-col gap-4 justify-between m-auto place-items-center uppercase text-center text-xs py-12">
            <h1 className="font-sans text-foreground normal-case font-thin">
              Collect, curate, and share. Lists are the perfect way to group
              games.
            </h1>
            <Button className="text-sm">
              <Link
                className="block w-full h-full px-4"
                href={`/list/new`}
              >{`Start your own list`}</Link>
            </Button>
          </div>

          <div className="py-6">
            <SectionHeader title="Popular Lists" />

            <div className="flex flex-row gap-8 ">
              {popularLists.map((list) => (
                <ListBlock big={true} key={list.slug} list={list} />
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-16 py-6">
            {/** Left Side */}
            <Section header={"Recent Lists"} className="basis-3/4">
              {recentLists.map((list) => (
                <ListWithDescription key={list.slug} list={list} />
              ))}
            </Section>
            {/** Right side */}
            <div className="basis-1/4">
              <Section header="Popular Reviewers" className="basis-1/4">
                <Suspense fallback={<PlaceholderUser />}>
                  <PopularUsers />
                </Suspense>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListsPage;
