import Image from "next/image";
import "@/app/styles/home.css";
import BoxArt from "@/components/boxart";
import { Game, Picture, Descriptor, Company } from "@/igdb/interfaces";
import { getAccessToken, client_id } from "@/igdb/auth";
import { InfoTabs } from "@/components/infotabs";
import { Section } from "@/components/section";
import { ReviewCard } from "@/components/reviewcard";
import Link from "next/link";

const GamePage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  console.log(id);
  const game = await GetGame(id);
  const bg = game.artworks[0];
  const first_release_date = new Date(game.first_release_date * 1000);
  const developer = await GetDeveloper(game);
  for (const genre of game.genres) {
    console.log(genre.name);
  }
  return (
    <main className="flex min-h-screen flex-col max-w-screen-xl m-auto items-center gap-8">
      {/** Backdrop Image Container */}
      <div className="h-fit max-w-[1200px] bg-cover bg-top bg-no-repeat mask  object-cover">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${bg.image_id}.jpg`}
          width={bg.width}
          height={bg.height}
          alt={game.name}
          className="z-0 object-cover aspect-video fade-in"
        />
      </div>
      {/** Content */}
      <div className="flex flex-row max-w-3xl -mt-48 mx-auto place-items-start gap-8 h-fit pb-4 z-10">
        {/** Boxart LEFT SIDE */}
        <div className="basis-1/4 h-fit">
          <BoxArt game={game} />
        </div>
        {/** Info Middle Column */}
        <div className="flex flex-col text-xs w-fit mx-auto gap-4 basis-3/4">
          {/** Name and developer */}
          <div className="flex flex-row gap-2 items-baseline flex-wrap">
            {/** NAME */}
            <h1 className="font-serif font-black text-2xl"> {game.name} </h1>
            {/** Release Date */}

            <h2 className="flex flex-row gap-1 text-sm flex-shrink-0">
              <div className="text-white text-sm ">
                {" "}
                {first_release_date.getFullYear()}{" "}
              </div>
              {/** Developer Name */} Developed by{" "}
              <div className="text-white">{developer.name} </div>
            </h2>
          </div>
          {/** Description */}
          <div className="flex flex-row gap-8">
            {/** Tagline */}
            <div className="flex flex-col basis-2/3 gap-4">
              <div className="">
                <div className="uppercase flex flex-row gap-2 pb-2">
                  {/** Do keywords as a tagline / Header? */}
                  {game.keywords &&
                    game.keywords.map((keyword) => (
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
            <div className="basis-1/3">
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
            </div>
          </div>
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
    body: `fields *, similar_games.cover.*, similar_games.name, similar_games.slug, platforms.name, game_localizations.name, game_localizations.region.name, alternative_names.name, game_modes.name, keywords.name, themes.name, cover.*, artworks.*, genres.*, involved_companies.*, involved_companies.company.name; where slug = "${id}"; limit 1;`,
  });
  const clone = await response.clone().json();
  console.log(response.status);
  // Authorization Error
  if (response.status == 401 || response.status == 400) {
    // Refresh token
    console.log(await response.json());
    throw new Error("AHHH SLUGS");

    GetGame(id);
  }
  const game = await response.json();
  console.log(game);
  return await game[0];
};

const GetDeveloper = async (game: Game) => {
  let dev_id = 0;
  for (const company of await game.involved_companies) {
    if (company.developer == true) {
      dev_id = company.company.id;
    }
  }
  const response = await fetch("https://api.igdb.com/v4/companies", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": client_id,
      Authorization: "Bearer " + (await getAccessToken()),
    },
    body: `fields *; where id = ${dev_id};`,
  });
  console.log("Get Dev Status: ", response.status);
  const dev = await response.json();
  console.log(dev);
  return await dev[0];
};

const RowGames = ({ games, limit }: { games: Array<Game>; limit?: number }) => {
  if (!games) return;
  return (
    <div className="flex flex-row h-auto justify-between gap-2 py-2">
      {games.slice(0, limit).map((game) => (
        <Link href={`/game/${game.slug}`}>
          <BoxArt key={game.slug} game={game} />
        </Link>
      ))}
    </div>
  );
};
