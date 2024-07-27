import Image, { StaticImageData } from "next/image";
import BGImage from "@/assets/kindsofkindness.jpg";
import BoxArt from "@/components/boxart";
import "@/app/styles/home.css";
import { FaEye, FaHeart } from "react-icons/fa6";
import Link from "next/link";
import RowGames from "@/components/rowgames";
import { getAccessToken, client_id } from "@/igdb/auth";
import { Section } from "@/components/section";
import { ReviewCard } from "@/components/reviewcard";
import { GetGames } from "@/igdb/api";
import { GetReleaseYear } from "@/igdb/helpers";

export default async function Home() {
  const FeaturedGames = await GetGames({
    fields:
      "name, slug, first_release_date, aggregated_rating, aggregated_rating_count, cover.*, artworks.*",
    filter: "first_release_date > 1704096000 & aggregated_rating_count >= 3",
    sort: "aggregated_rating desc",
    limit: 6,
  });
  const bgGame = FeaturedGames[0];
  const bg = bgGame.artworks[0];

  return (
    <main className="flex min-h-screen flex-col max-w-screen-2xl items-center gap-8 mx-auto">
      {/** Backdrop Image Container */}
      <div className="h-fit max-w-[1200px] bg-cover bg-top bg-no-repeat mask">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${bg.image_id}.jpg`}
          width={bg.width}
          height={bg.height}
          alt={bgGame.name}
          className="z-0 object-cover aspect-video fade-in w-[1200px]"
        />
      </div>
      {/** Content */}
      <div className="flex flex-col max-w-screen-lg w-5/6 gap-6 items-center -mt-72 z-10">
        <div className=" basis-4/5 mb-12 -rotate-90 -mr-24 self-end text-xs z-50 text-discrete-grey brightness-50 font-light">
          {" "}
          {"Kinds of Kindness"} {`(${GetReleaseYear(bgGame)})`}
        </div>
        <div className="z-10 w-full max-w-5xl items-center justify-between text-3xl font-black flex flex-col  font-serif">
          {" "}
          <h1> Track games you've played. </h1>
          <h1> Save those you want to try. </h1>
          <h1> Tell your friends what's good. </h1>
        </div>
        <div className="flex rounded-md py-2 px-4 bg-accent-green hover:brightness-90">
          <h1 className="font-bold">Get started - it's free!</h1>
        </div>
        <div className="text-sm">
          {" "}
          The social network for film lovers. Also avaialable on{" "}
        </div>
        <div className="flex flex-row gap-8 h-fit w-fit">
          <RowGames games={FeaturedGames} />
        </div>
        <div className="flex flex-row gap-16">
          <Section header={"Popular Reviews this week"} className="basis-4/5">
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
          </Section>
          <Section header="Popular Reviewers" className="basis-1/4"></Section>
        </div>
      </div>
    </main>
  );
}

{
  /** Stat Card used for quick stats such as views and favorites */
}
const StatCard = () => {
  return (
    <div className="flex flex-col bg-black bg-opacity-80 p-4 w-fit h-fit rounded-sm shadow-lg shadow-black items-center">
      <FaEye className="fill-accent-green"></FaEye>
      <div> {"6.9k"}</div>
      <FaHeart className="fill-accent-orange"></FaHeart>
      <div> {"3.4k"}</div>
    </div>
  );
};
