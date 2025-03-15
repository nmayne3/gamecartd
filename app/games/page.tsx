import { GetGames } from "@/igdb/api";
import { Section, SectionHeader } from "@/components/section";
import RowGames from "@/components/rowgames";
import BrowseMenu from "@/components/browsemenu";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ReviewCard } from "@/components/reviewcardalt";
import ProfileBadge from "@/components/user/ProfileBadge";
import { Input } from "@/components/ui/input";
import Searchbar from "@/components/lists/searchgame";
import PopularReviews, {
  PlaceholderReviews,
} from "@/components/games/popularReviews";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PopularUsers, { PlaceholderUser } from "@/components/games/popularUsers";

export const metadata: Metadata = {
  title: "Games • Gamecartd",
  description: "Get your game on",
};

const GamesPage = async () => {
  const TopGames = await GetGames({
    fields:
      "name, slug, first_release_date, aggregated_rating, aggregated_rating_count, cover.*",
    filter: "first_release_date > 1704096000 & aggregated_rating_count >= 3",
    sort: "aggregated_rating desc",
    limit: 4,
  });

  const RecentReleases = await GetGames({
    fields:
      "name, slug, first_release_date, aggregated_rating, aggregated_rating_count, cover.*",
    filter: "first_release_date > 1704096000 & aggregated_rating_count >= 3",
    sort: "first_release_date desc",
    limit: 12,
  });

  return (
    <main className="">
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />

      <div className="w-full bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x">
        <div className="p-4  max-w-[1000px] mx-auto ">
          <div className="flex flex-row justify-between m-auto place-items-center uppercase text-xs my-8">
            <div className="flex flex-row place-items-center gap-2">
              Browse By
              <BrowseMenu />
            </div>
            <div className="flex flex-row items-center gap-2">
              {`Find a Game`}
              <Searchbar className="h-full" />
            </div>
          </div>

          <Section header="Top Games" className="pb-8">
            <RowGames games={TopGames} />
          </Section>

          <Section header="Recently Released">
            <RowGames games={RecentReleases} />
          </Section>

          <div className="flex flex-row gap-16 py-12">
            {/** Left Side */}
            <Section header={"Popular Reviews this week"} className="basis-3/4">
              <Suspense fallback={<PlaceholderReviews />}>
                <PopularReviews />
              </Suspense>
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

export default GamesPage;
