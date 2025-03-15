import "@/app/styles/home.css";
import BoxArt from "@/components/boxartalt";
import { InfoTabs } from "@/components/infotabs";
import { Section } from "@/components/section";
import { GetGameCombo } from "@/app/api/games/actions";
import { FaEye, FaHeart, FaBoxesStacked } from "react-icons/fa6";
import Backdrop from "@/components/backdrop";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerIcon } from "@/components/icons";
import { Artwork, Screenshots } from "@prisma/client";
import SimilarGames from "@/components/game/similarGames";
import {
  PopularReviews,
  RecentReviews,
} from "@/components/game/reviewSections";
import { InteractionPanel } from "@/components/game/interactionPanel";
import InteractionPanelWrapper from "@/components/interactionpanel";
import InfoTabsWrapper from "@/components/game/infoTabsWrapper";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params

  const id = params.id;
  const game = await GetGameCombo(id, {
    artworks: true,
    screenshots: true,
    developers: true,
  });
  const first_release_date = game.first_release_date;

  return {
    title: `${game.name} (${first_release_date?.getFullYear()})`,
  };
  // Query returns User or null
}

const GamePage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  console.log(id);
  const game = await GetGameCombo(id, {
    artworks: true,
    screenshots: true,
    developers: true,
  });
  const bg = GetBackgroundImage(game);
  const first_release_date = game.first_release_date;
  const developer_name = game.developers.length
    ? game.developers[0].name
    : null;

  return (
    <main className="flex min-h-screen flex-col m-auto w-full gap-8">
      {/** Backdrop Image Container */}

      <Backdrop bg={bg} name={game.name} />
      {/** Content */}
      <div
        className={`w-full md:flex md:flex-row max-w-3xl lg:max-w-screen-lg ${
          bg ? "-mt-48" : "mt-20"
        }  mx-auto place-items-start justify-self-center gap-8 h-fit p-4 lg:p-0 lg:pb-4 pb-4 z-10`}
      >
        {/** Boxart LEFT SIDE */}
        <figure className="hidden md:flex flex-col basis-1/4 flex-shrink-0 h-fit md:sticky md:top-4">
          <BoxArt game={game} hoverEffect={false} />
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
              <BoxArt game={game} hoverEffect={false} />
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
              <Suspense fallback={<SpinnerIcon />}>
                <InfoTabsWrapper slug={id} />
              </Suspense>
            </div>
            {/** Right Side Column */}
            <aside className="basis-1/3">
              <Suspense
                fallback={
                  <InteractionPanelWrapper className="p-2">
                    {" "}
                    Loading...{" "}
                  </InteractionPanelWrapper>
                }
              >
                <InteractionPanel game={game} />
              </Suspense>
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
          <Suspense
            fallback={<SpinnerIcon className="place-self-center m-auto" />}
          >
            <PopularReviews gameId={game.id} />
          </Suspense>
          <Suspense
            fallback={<SpinnerIcon className="place-self-center m-auto" />}
          >
            <RecentReviews gameId={game.id} />
          </Suspense>

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

const GetBackgroundImage = (game: {
  id: string;
  name: string;
  slug: string;
  cover: string | null;
  first_release_date: Date | null;
  tags: string[];
  screenshots: Screenshots[];
  artworks: Artwork[];
}) => {
  if (game.screenshots && game.screenshots.length) {
    return game.screenshots[0];
  } else if (game.artworks && game.artworks.length) {
    return game.artworks[0];
  } else if (game.cover)
    return { image_id: game.cover, height: 1080, width: 1920 };
  return undefined;
};
