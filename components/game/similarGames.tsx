import { Suspense } from "react";
import RowGames from "../rowgames";
import { fetchGame } from "@/igdb/api";
import { Skeleton } from "../ui/skeleton";

const SimilarGames = async ({ slug }: { slug: string }) => {
  const game = await fetchGame(slug);
  return (
    <Suspense fallback={<Skeleton />}>
      <RowGames games={game.similar_games} limit={5}></RowGames>
    </Suspense>
  );
};

export default SimilarGames;
