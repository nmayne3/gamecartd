import Image, { StaticImageData } from "next/image";
import BGImage from "@/assets/kindsofkindness.jpg";
import Poster from "@/assets/poster.jpg";
import BoxArt from "@/components/boxart";
import "@/app/styles/home.css";
import { FaEye, FaHeart } from "react-icons/fa6";
const auth = require("@/igdb/auth");

const TopFive = async () => {
  var games = Array();

  await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": auth.client_id,
      Authorization: "Bearer " + auth.access_token,
    },
    body: "fields name, first_release_date, aggregated_rating, aggregated_rating_count, cover.*; where first_release_date > 1704096000 & aggregated_rating_count >= 3; sort aggregated_rating desc; limit 5;",
  })
    .then((response) => {
      console.log("Response Status: ", response.status);
      return response.json();
    })
    .then((data) => {
      for (const game of data) {
        console.log(game.name);
        console.log(typeof game);
      }
      games = data;
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });

  return (
    <div className="flex flex-row gap-8 h-fit w-fit">
      {games.map((game) => (
        <div className="object-scale-downs poster w-24 " key={game.id}>
          <BoxArt game={game}>
            <StatCard />
          </BoxArt>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col max-w-screen-2xl items-center gap-8">
      {/** Backdrop Image Container */}
      <div className="h-fit max-w-[1200px] fade-in bg-cover bg-top bg-no-repeat mask -z-10">
        <Image src={BGImage} alt={"Kinds of Kindness"} className="z-0" />
      </div>
      {/** Content */}
      <div className="flex flex-col w-5/6 gap-6 items-center -mt-72">
        <div className=" basis-4/5 mb-12 -rotate-90 -mr-4 self-end text-xs z-50 text-discrete-grey brightness-50 font-light">
          {" "}
          Kinds of Kindness (2024){" "}
        </div>
        <div className="z-10 w-full max-w-5xl items-center justify-between text-3xl font-black flex flex-col  font-serif">
          {" "}
          <h1> Track films you've watched. </h1>
          <h1> Save those you want to see. </h1>
          <h1> Tell your friends what's good. </h1>
        </div>
        <div className="flex rounded-md py-2 px-4 bg-accent-green hover:brightness-90">
          <h1 className="font-bold">Get started - it's free!</h1>
        </div>
        <div className="text-sm">
          {" "}
          The social network for film lovers. Also avaialable on{" "}
        </div>
        <TopFive />
        <div> </div>
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
