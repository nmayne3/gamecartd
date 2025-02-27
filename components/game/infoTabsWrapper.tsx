import { GetGame } from "@/app/api/games/actions";
import { Suspense } from "react";
import { InfoTabs } from "../infotabs";
import { SpinnerIcon } from "../icons";

const InfoTabsWrapper = async ({ slug }: { slug: string }) => {
  const game = await GetGame(slug, {
    platforms: true,
    GameMode: true,
    genres: true,
    developers: true,
    publishers: true,
  });
  if (!game) {
    throw "No game was found for rendering infotabs";
  }
  return <InfoTabs game={game} />;
};

export default InfoTabsWrapper;
