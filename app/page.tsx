import Image, { StaticImageData } from "next/image";
import BGImage from "@/assets/kindsofkindness.jpg";
import BoxArt from "@/components/boxart";
import "@/app/styles/home.css";
import { FaEye, FaHeart } from "react-icons/fa6";
import Link from "next/link";
import RowGames from "@/components/rowgames";
import { getAccessToken } from "@/igdb/auth";
import { client_id } from "@/igdb/keys";
import { Section } from "@/components/section";
import { ReviewCard } from "@/components/reviewcard";
import { GetGames } from "@/igdb/api";
import { GetReleaseYear } from "@/igdb/helpers";
import Backdrop from "@/components/backdrop";

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
      <figure className="h-fit max-w-[1200px] bg-cover bg-top bg-no-repeat mask">
        <Backdrop bg={bg} name={bgGame.name}></Backdrop>
        <figcaption
          className="absolute text-xs text-discrete-grey/50 font-light z-50 rotate-180 top-1/3 right-10 "
          style={{ writingMode: "vertical-rl" }}
        >
          {" "}
          {bgGame.name}
          {` (${GetReleaseYear(bgGame)})`}
        </figcaption>
      </figure>
      {/** Content */}
      <div className="flex flex-col max-w-screen-lg w-5/6 gap-6 items-center -mt-52 z-10">
        <div className="z-10 w-full max-w-5xl items-center justify-between text-3xl font-black flex flex-col font-dm-serif">
          {" "}
          <h1> {`Track games you've played.`} </h1>
          <h1> {`Save those you want to try.`} </h1>
          <h1> {`Tell your friends what's good.`} </h1>
        </div>
        <div className="flex rounded-md py-2 px-4 bg-accent-green hover:brightness-90">
          <h1 className="font-bold">{`Get started - it's free!`}</h1>
        </div>
        <div className="text-sm"> The social network for game lovers. </div>
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
