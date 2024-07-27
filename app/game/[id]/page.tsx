import Image from "next/image";
import "@/app/styles/home.css";
import BoxArt from "@/components/boxart";
import { Game, Picture, Descriptor, Company } from "@/igdb/interfaces";
import { getAccessToken, client_id } from "@/igdb/auth";
import { InfoTabs } from "@/components/infotabs";
import { Section } from "@/components/section";
import { ReviewCard } from "@/components/reviewcard";
import RowGames from "@/components/rowgames";

const GamePage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  console.log(id);
  const game = await GetGame(id);
  const bg = GetBackgroundImage(game);
  const first_release_date = new Date(game.first_release_date * 1000);
  const developer_name = await GetDeveloperName(game);
  for (const genre of game.genres) {
    console.log(genre.name);
  }
  return (
    <main className="flex min-h-screen flex-col max-w-screen-xl m-auto items-center gap-8">
      {/** Backdrop Image Container */}
      <section
        id="Backdrop Image Container"
        className="h-fit max-w-[1200px] bg-cover bg-top bg-no-repeat mask"
      >
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${bg.image_id}.jpg`}
          width={bg.width}
          height={bg.height}
          alt={game.name}
          className="z-0 object-cover aspect-video fade-in w-[1200px]"
        />
      </section>
      {/** Content */}
      <div className="flex flex-row max-w-3xl -mt-48 mx-auto place-items-start gap-8 h-fit pb-4 z-10">
        {/** Boxart LEFT SIDE */}
        <figure className="basis-1/4 flex-shrink-0 h-fit">
          <BoxArt game={game} />
        </figure>
        {/** Info Middle Column */}
        <div className="flex flex-col text-xs w-fit mx-auto gap-4 basis-3/4 ">
          {/** Name and developer */}
          <header
            id="Game Header"
            className="flex flex-row gap-2 items-baseline flex-wrap"
          >
            {/** NAME */}
            <h1 className="font-serif font-black text-2xl"> {game.name} </h1>
            <h2 className="flex flex-row gap-1 text-sm flex-shrink-0 ">
              <time id="Release Year" className="text-white text-sm ">
                {first_release_date.getFullYear()}
              </time>
              {/** Developer Name */} Developed by{" "}
              <div id="Developer Name" className="text-white">
                {developer_name}{" "}
              </div>
            </h2>
          </header>
          {/** Description */}
          <section className="flex flex-row gap-8">
            {/** Tagline */}
            <div className="flex flex-col basis-2/3 gap-4">
              <div className="">
                <div className="uppercase flex flex-row gap-2 flex-wrap pb-2">
                  {/** Do keywords as a tagline / Header? */}
                  {game.keywords &&
                    game.keywords.slice(0, 3).map((keyword) => (
                      <h3 key={keyword.id} className="uppercase">
                        {" "}
                        {keyword.name}.{" "}
                      </h3>
                    ))}
                </div>
                <p className=""> {game.summary} </p>
              </div>
              <div>
                <InfoTabs game={game} />
              </div>
            </div>
            {/** Right Side Column */}
            <aside className="basis-1/3">
              <div className="flex w-full bg-secondary rounded-t-sm-md justify-center outline outline-0.5 outline-primary p-2">
                {" "}
                Sign in to log, rate or review{" "}
              </div>
              <div className="flex w-full bg-secondary rounded-b-sm-md justify-center outline outline-0.5 outline-primary p-2">
                Share
              </div>
              <div className="flex w-full flex-row border-b border-secondary justify place-content-between uppercase items-baseline pt-4">
                <div className="text-sm"> Ratings </div>
                <div className="text-xs text-secondary"> 9 Fans </div>
              </div>
            </aside>
          </section>
          <Section header="Popular Reviews">
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
          </Section>
          <Section header="Recent Reviews">
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
          </Section>
          <Section header="Similar Games">
            <RowGames games={game.similar_games} limit={5}></RowGames>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default GamePage;

const GetGame = async (id: string): Promise<Game> => {
  const access_token = getAccessToken();
  console.log(
    `No slug city\nClient-ID: ${client_id}\nAuthorization: Bearer ${access_token}`
  );
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": client_id,
      Authorization: "Bearer " + access_token,
    },
    body: `fields *, similar_games.cover.*, similar_games.name, similar_games.slug, platforms.name, game_localizations.name, game_localizations.region.name, alternative_names.name, game_modes.name, keywords.name, themes.name, cover.*, artworks.*, screenshots.*, genres.*, involved_companies.*, involved_companies.company.name; where slug = "${id}"; limit 1;`,
  });
  const clone = await response.clone().json();
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
};

const GetDeveloperName = async (game: Game) => {
  let name = "";
  for (const company of await game.involved_companies) {
    if (company.developer == true) {
      name = company.company.name;
    }
  }
  return name;
};

const GetBackgroundImage = (game: Game): Picture => {
  if (game.artworks) {
    return game.artworks[0];
  } else if (game.screenshots) {
    return game.screenshots[0];
  }
  return game.cover;
};
