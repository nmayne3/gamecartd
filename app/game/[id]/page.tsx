import "@/app/styles/home.css";
import BoxArt from "@/components/boxartalt";
import { Game, Picture, Descriptor, Company } from "@/igdb/interfaces";
import { getAccessToken } from "@/igdb/auth";
import { InfoTabs } from "@/components/infotabs";
import { Section } from "@/components/section";
import RowGames from "@/components/rowgames";
import PlayedButton, {
  BacklogButton,
  LikeButton,
} from "@/components/playedbutton";
import { CheckPlayed, GetGameCombo } from "@/app/api/games/actions";
import {
  FaEye,
  FaHeart,
  FaBoxesStacked,
  FaRegCalendarPlus,
  FaStar,
} from "react-icons/fa6";
import Backdrop from "@/components/backdrop";
import type { Metadata } from "next";
import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { cache, Suspense } from "react";
import { SpinnerIcon } from "@/components/icons";
import ReviewWindow from "@/components/reviewwindow";
import { ReviewCardGamePage } from "@/components/reviewcardalt";
import { AddGame } from "@/app/api/games/actions";
import { StarRating } from "@/components/reviewwindow";
import { Artwork, Prisma, Screenshots } from "@prisma/client";
import SimilarGames from "@/components/game/similarGames";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params

  const id = params.id;
  const game = await GetGame(id);
  const first_release_date = game.first_release_date;

  return {
    title: `${game.name} (${first_release_date?.getFullYear()})`,
  };
  // Query returns User or null
}

const GamePage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  console.log(id);
  const game = await GetGameCombo(id, true);
  const bg = await GetBackgroundImage(game);
  const first_release_date = game.first_release_date;
  const developer_name = game.developers.length
    ? game.developers[0].name
    : null;
  const session = await getSession();
  const [played, liked, backlogged] = session?.user.id
    ? await CheckPlayed(id, session?.user.id)
    : [false];

  const reviews = game.user_reviews;

  const rating = session?.user.id
    ? await prisma.rating.findUnique({
        where: { userId_gameId: { userId: session?.user.id, gameId: game.id } },
      })
    : null;

  // Sorts reviews by date
  reviews.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else if (a.createdAt > b.createdAt) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <main className="flex min-h-screen flex-col max-w-screen-xl m-auto items-center gap-8">
      {/** Backdrop Image Container */}
      <section
        id="Backdrop Image Container"
        className="h-fit max-w-[1200px] aspect-video bg-cover bg-top bg-no-repeat mask"
      >
        {bg && <Backdrop bg={bg} name={game.name} />}
      </section>
      {/** Content */}
      <div className="md:flex md:flex-row max-w-3xl lg:max-w-screen-lg -mt-48 mx-auto place-items-start gap-8 h-fit p-4 lg:p-0 lg:pb-4 pb-4 z-10">
        {/** Boxart LEFT SIDE */}
        <figure className="hidden md:flex flex-col basis-1/4 flex-shrink-0 h-fit md:sticky md:top-4">
          <BoxArt game={game} />
          <span className="flex flex-row self-center text-xs items-center justify-center gap-2 p-2">
            <FaEye className="fill-accent-green" />
            {"427k"}
            <FaBoxesStacked className="fill-blue-400" />
            {"78k"}
            <FaHeart className="fill-accent-orange" />
            {"139k"}
          </span>
        </figure>
        {/** Info Middle Column */}
        <div className="flex flex-col text-xs xl:text-medium w-fit mx-auto gap-4 basis-3/4 ">
          <div className="flex flex-row justify-between">
            {/** Name and developer */}
            <header
              id="Game Header"
              className="flex flex-col items-start justify-center md:justify-start md:flex-row gap-2 md:items-baseline md:flex-wrap basis-2/3 md:basis-full"
            >
              {/** Name */}
              <h1
                id="Game Name"
                className="font-dm-serif font-black text-2xl xl:text-3xl"
              >
                {" "}
                {game.name}{" "}
              </h1>
              <h2 className="flex flex-col-reverse md:flex-row gap-1 text-sm flex-shrink-0 xl:text-lg">
                {/** Release Date */}
                <time id="Release Year" className="text-white">
                  {first_release_date && first_release_date.getFullYear()}
                </time>

                {/** Developer Name */}
                {developer_name && (
                  <div className="flex flex-col md:flex-row md:gap-1">
                    Developed by{" "}
                    <div id="Developer Name" className="text-white">
                      {developer_name}{" "}
                    </div>
                  </div>
                )}
              </h2>
            </header>
            <figure className="md:hidden basis-1/4">
              <BoxArt game={game} />
            </figure>
          </div>
          {/** Description Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col basis-2/3 gap-4">
              {/** Game Description */}
              <section id="Description">
                <div className="uppercase flex flex-row gap-2 flex-wrap pb-2">
                  {/** Do keywords as a tagline / Header? */}
                  {game.tags &&
                    game.tags.slice(0, 3).map((keyword) => (
                      <h3 key={keyword} className="uppercase">
                        {" "}
                        {keyword}.{" "}
                      </h3>
                    ))}
                </div>
                {game.summary && <p className=""> {game.summary} </p>}
              </section>
              <InfoTabs game={game} />
            </div>
            {/** Right Side Column */}
            <aside className="basis-1/3">
              {!session && (
                <section id="Logged out Review Buttons">
                  <h4 className="flex w-full bg-secondary rounded-t-sm-md justify-center outline outline-0.5 outline-primary p-2">
                    {" "}
                    Sign in to log, rate or review{" "}
                  </h4>
                  <h4 className="flex w-full bg-secondary rounded-b-sm-md justify-center outline outline-0.5 outline-primary p-2">
                    Share
                  </h4>
                </section>
              )}
              {session && (
                <section
                  id="Review/Interaction Table"
                  className="flex flex-col bg-secondary rounded-sm place-content-center w-full divide-y-1 divide-primary text-sm"
                >
                  <div className="grid grid-cols-3 w-full p-2">
                    <PlayedButton game={game} initialState={played} />

                    <LikeButton game={game} initialState={liked} />
                    <BacklogButton game={game} initialState={backlogged} />
                  </div>
                  <div className="place-items-center place-content-center w-full text-center p-2">
                    {"Rate"}
                    <div className="flex flex-row gap-1 w-full place-content-center">
                      {" "}
                      <StarRating
                        game={game}
                        initialState={rating ? true : false}
                        initialRating={rating ? rating.rating : 0}
                      />{" "}
                    </div>
                  </div>
                  <div className="place-items-center place-content-center w-full text-center p-2">
                    <ReviewWindow
                      game={game}
                      rating={rating?.rating || 0}
                      isRated={rating ? true : false}
                    ></ReviewWindow>
                  </div>
                  <div className="place-items-center place-content-center w-full text-center p-2">
                    {"Add to List"}
                  </div>
                </section>
              )}
              <section
                id="Quick Ratings"
                className="flex w-full flex-row border-b border-secondary justify place-content-between uppercase items-baseline pt-4"
              >
                <div className="text-sm"> Ratings </div>
                <div className="text-xs text-secondary"> 9 Fans </div>
              </section>
            </aside>
          </div>
          {/** Review Section */}
          {reviews.length > 0 && (
            <Section header="Popular Reviews">
              {reviews
                .toSorted((a, b) => {
                  if (a._count.likedBy < b._count.likedBy) {
                    return 1;
                  } else if (a._count.likedBy > b._count.likedBy) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
                .slice(0, 2)
                .map((review) => (
                  <ReviewCardGamePage key={review.id} review={review} />
                ))}
            </Section>
          )}
          {reviews.length > 0 && (
            <Section header="Recent Reviews">
              {reviews.slice(0, 3).map((review) => {
                return <ReviewCardGamePage key={review.id} review={review} />;
              })}
            </Section>
          )}

          <Section header="Similar Games">
            <Suspense fallback={<SpinnerIcon />}>
              <SimilarGames slug={id} />
            </Suspense>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default GamePage;

const GetGame3P = cache(async (id: string): Promise<Game> => {
  const access_token = getAccessToken();

  if (
    process.env.client_id === undefined ||
    process.env.client_secret === undefined
  ) {
    throw new Error("Invalid env vars");
  }

  console.log(
    `No slug city\nClient-ID: ${process.env.client_id}\nAuthorization: Bearer ${access_token}`
  );
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.client_id,
      Authorization: "Bearer " + access_token,
    },
    body: `fields *, similar_games.cover.*, similar_games.name, similar_games.slug, platforms.*, platforms.platform_logo.*, platforms.platform_family.*, game_localizations.name, game_localizations.region.name, alternative_names.name, game_modes.name, keywords.name, themes.name, cover.*, artworks.*, screenshots.*, genres.*, involved_companies.*, involved_companies.company.*, involved_companies.company.logo.*; where slug = "${id}"; limit 1;`,
  });
  console.log(response.status);
  // Authorization Error
  if (response.status == 401 || response.status == 400) {
    // Refresh token
    console.log(await response.json());
    throw new Error("AHHH SLUGS");
  }
  const game = await response.json();
  console.log(game);
  return await game[0];
});

const GetBackgroundImage = async (game: {
  id: string;
  name: string;
  slug: string;
  cover: string | null;
  first_release_date: Date | null;
  tags: string[];
  screenshots: Screenshots[];
  artworks: Artwork[];
}): Promise<Picture | null> => {
  if (game.screenshots.length) {
    return game.screenshots[0];
  } else if (game.artworks.length) {
    return game.artworks[0];
  } else if (game.cover)
    return { image_id: game.cover, height: 1080, width: 1920 };
  return null;
};

const GetGame = cache(async (id: string) => {
  const getGame = await prisma.game.findUnique({
    where: {
      slug: id,
    },
    include: {
      developers: true,
      user_ratings: true,
      user_reviews: { include: { _count: { select: { likedBy: true } } } },
      artworks: true,
      screenshots: true,
    },
  });
  if (!getGame) {
    const game = await GetGame3P(id);
    const newGame = await AddGame(game);
    return newGame;
  }
  return getGame;
});
