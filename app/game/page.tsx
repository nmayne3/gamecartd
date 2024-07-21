import Image from "next/image";
import "@/app/styles/home.css";
import BoxArt from "@/components/boxart";
import "@/igdb/interfaces";

const auth = require("@/igdb/auth");

const GamePage = async () => {
  const game = await GetGame();
  const bg = game.artworks[0];
  const first_release_date = new Date(game.first_release_date * 1000);
  const developer = await GetDeveloper(game);
  for (const genre of game.genres) {
    console.log(genre.name);
  }
  return (
    <main className="flex min-h-screen flex-col max-w-screen-xl m-auto items-center gap-8">
      {/** Backdrop Image Container */}
      <div className="h-fit max-w-[1200px] fade-in bg-cover bg-top bg-no-repeat mask -z-10 object-cover">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_1080p/${bg.image_id}.jpg`}
          width={bg.width}
          height={bg.height}
          alt={game.name}
          className="z-0 object-cover aspect-video"
        />
      </div>
      {/** Content */}
      <div className="flex flex-row max-w-3xl -mt-48 mx-auto place-items-start gap-8 h-fit pb-4">
        {/** Boxart LEFT SIDE */}
        <div className="basis-1/4 h-fit">
          <BoxArt game={game} />
        </div>
        {/** Info RIGHT SIDE */}
        <div className="flex flex-col text-xs  w-fit mx-auto gap-4 basis-3/4">
          {/** Name and developer */}
          <div className="flex flex-row gap-2 items-baseline">
            <h1 className="font-serif font-black text-2xl"> {game.name} </h1>
            <h2 className="text-white text-sm">
              {" "}
              {first_release_date.getFullYear()}{" "}
            </h2>
            <h2 className="flex flex-row gap-1 text-sm">
              {" "}
              Developed by <div className="text-white">{developer.name} </div>
            </h2>
          </div>
          {/** Description */}
          <div className="flex flex-row gap-8">
            {/** Tagline */}
            <div className="flex flex-col basis-2/3 gap-4">
              <div className="">
                <div className="uppercase flex flex-row gap-2 pb-2">
                  {/** Do keywords as a tagline / Header? */}
                  {game.keywords.map((keyword) => (
                    <h3 key={keyword.id} className="uppercase">
                      {" "}
                      {keyword.name}.{" "}
                    </h3>
                  ))}
                </div>
                <p className=""> {game.summary} </p>
              </div>
              <div>
                <div className="flex flex-row pb-0.5 gap-2 w-full border-b border-secondary uppercase">
                  <div> Cast </div>
                  <div> Teams </div>
                  <div> Details </div>
                  <div> Genres </div>
                  <div> Releases </div>
                </div>
                <div className="flex flex-col">
                  {" "}
                  <DetailList
                    sectionTitle={"Genres"}
                    descriptors={game.genres}
                  ></DetailList>{" "}
                  <DetailList
                    sectionTitle="Tags"
                    descriptors={game.keywords}
                  ></DetailList>
                </div>
              </div>
            </div>
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
        </div>
      </div>
    </main>
  );
};

export default GamePage;

const GetGame = async (): Promise<Game> => {
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": auth.client_id,
      Authorization: "Bearer " + auth.access_token,
    },
    body: "fields *, keywords.name, cover.*, artworks.*, genres.*, involved_companies.*; where first_release_date > 1704096000 & aggregated_rating_count >= 3; sort aggregated_rating desc; limit 5;",
  });
  console.log(response.status);
  const game = await response.json();
  console.log(game[4]);
  return await game[2];
};

const GetBackground = async (game: Game) => {
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": auth.client_id,
      Authorization: "Bearer " + auth.access_token,
    },
    body: "fields name, first_release_date, aggregated_rating, aggregated_rating_count, cover.*; where first_release_date > 1704096000 & aggregated_rating_count >= 3; sort aggregated_rating desc; limit 5;",
  });
};

const GetDeveloper = async (game: Game) => {
  let dev_id = 0;
  for (const company of await game.involved_companies) {
    if (company.developer == true) {
      dev_id = company.company;
    }
  }
  const response = await fetch("https://api.igdb.com/v4/companies", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": auth.client_id,
      Authorization: "Bearer " + auth.access_token,
    },
    body: `fields *; where id = ${dev_id};`,
  });
  console.log("Get Dev Status: ", response.status);
  const dev = await response.json();
  console.log(dev);
  return await dev[0];
};

interface Game {
  artworks: Array<Picture>;
  keywords: Array<Descriptor>;
  genres: Array<Descriptor>;
  name: string;
  summary: string;
  involved_companies: Company[];
  first_release_date: number;
  cover: Picture;
}

interface Picture {
  image_id: string;
  height: number;
  width: number;
}

interface Descriptor {
  id: number;
  name: string;
}

interface Company {
  developer?: boolean;
  company: number;
}

const DetailList = ({
  sectionTitle,
  descriptors,
}: {
  sectionTitle: string;
  descriptors: Array<Descriptor>;
}) => {
  return (
    <div className="flex flex-row w-full gap-2 items-baseline baseline py-2">
      {/** descriptor type */}
      <div className="flex flex-row basis-2/5 gap-1 uppercase text-secondary max-w-full flex-shrink-0">
        {" "}
        {sectionTitle}
        <div className="w-full border-dotted border-0 border-secondary border-b mb-0.5">
          {" "}
        </div>
      </div>
      <div className="basis-3/5 flex flex-row gap-1 flex-wrap capitalize">
        {" "}
        {descriptors.map((descriptor: Descriptor) => (
          <div
            key={descriptor.id}
            className="bg-secondary rounded-sm-md p-1 shadow-inner whitespace-nowrap"
          >
            {" "}
            {descriptor.name}{" "}
          </div>
        ))}{" "}
      </div>
    </div>
  );
};
