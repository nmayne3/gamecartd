import Image, { StaticImageData } from "next/image";
import BGImage from "@/assets/kindsofkindness.jpg";
import BoxArt from "@/components/boxart";
import "@/app/styles/home.css";
import { FaEye, FaHeart } from "react-icons/fa6";
import Link from "next/link";
import RowGames from "@/components/rowgames";
import { getAccessToken } from "@/igdb/auth";
import { client_id } from "@/igdb/keys";
import { Section, SectionHeader } from "@/components/section";
import { GetGames } from "@/igdb/api";
import { GetReleaseYear } from "@/igdb/helpers";
import Backdrop from "@/components/backdrop";
import { getSession } from "./api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { ListBlock } from "@/components/displaylist";
import { ReviewCard } from "@/components/reviewcardalt";
import ProfileBadge from "@/components/user/ProfileBadge";

export default async function Home() {
  // Get games from IGDB to ensure they are always up to date
  const FeaturedGames = await GetGames({
    fields:
      "name, slug, first_release_date, aggregated_rating, aggregated_rating_count, cover.*, artworks.*",
    filter: "first_release_date > 1704096000 & aggregated_rating_count >= 3",
    sort: "aggregated_rating desc",
    limit: 6,
  });
  const bgGame = FeaturedGames[0];
  const bg = bgGame.artworks[0];

  // Get user info
  const session = await getSession();
  const user = session?.user.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { likedPosts: true },
      })
    : null;

  const popularLists = await prisma.list.findMany({
    include: {
      author: true,
      games: { include: { game: true } },
      _count: { select: { likedBy: true } },
    },
    orderBy: { likedBy: { _count: "desc" } },
    take: 3,
  });

  const popularReviews = await prisma.review.findMany({
    include: {
      Game: true,
      author: true,
      _count: { select: { likedBy: true } },
      likedBy: true,
    },
    orderBy: { likedBy: { _count: "desc" } },
    take: 6,
  });

  const popularUsers = await prisma.user.findMany({
    include: {
      _count: { select: { games: true, reviews: true } },
      reviews: true,
    },
    take: 6,
  });
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
          <Link href={`/game/${bgGame.slug}`}>
            {bgGame.name}
            {` (${GetReleaseYear(bgGame)})`}
          </Link>
        </figcaption>
      </figure>
      {/** Content */}
      <div className="flex flex-col max-w-screen-lg w-5/6 gap-6 items-center -mt-52 z-10">
        {!session && (
          <div className="flex flex-col gap-6 items-center">
            <div className="z-10 w-full max-w-5xl items-center justify-between text-3xl font-black flex flex-col font-dm-serif">
              {" "}
              <h1> {`Track games you've played.`} </h1>
              <h1> {`Save those you want to try.`} </h1>
              <h1> {`Tell your friends what's good.`} </h1>
            </div>
            <Link
              href="/login"
              className="flex rounded-md py-2 px-4 bg-accent-green hover:brightness-90"
            >
              <h1 className="font-bold">{`Get started - it's free!`}</h1>
            </Link>
            <div className="text-sm"> The social network for game lovers. </div>
          </div>
        )}
        {session && (
          <div className="items-center text-center">
            <h1> Welcome {session.user?.name}, </h1>
            <h2> {`Here's what we've been playing.`} </h2>
          </div>
        )}

        <div className="flex flex-row gap-8 h-fit w-fit">
          <RowGames games={FeaturedGames} />
        </div>
        <div className="flex flex-row gap-16">
          {/** Left Side */}
          <Section header={"Popular Reviews this week"} className="basis-3/4">
            {popularReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Section>
          {/** Right side */}
          <div className="basis-1/4">
            <SectionHeader title="Popular Lists" className="divide-y-0" />{" "}
            {popularLists.map((list) => (
              <ListBlock key={list.slug} id={list.slug} list={list} />
            ))}{" "}
            <Section header="Popular Reviewers" className="basis-1/4 py-12">
              {popularUsers.map((user) => (
                <ProfileBadge key={user.slug} user={user} />
              ))}
            </Section>
          </div>
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
