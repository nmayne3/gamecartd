import Link from "next/link";
import BoxArt from "./boxart";
import { Game } from "@/igdb/interfaces";

const RowGames = ({ games, limit }: { games: Array<Game>; limit?: number }) => {
  if (!games) return;
  if (!limit) {
    limit = games.length;
  }
  const size = limit < 7 ? "big" : "small";
  return (
    <div className="flex flex-row h-full w-full place-items-center justify-between gap-2 py-2">
      {games.slice(0, limit).map((game) => (
        <Link href={`/game/${game.slug}`} key={game.slug} className="w-full">
          <BoxArt game={game} size={size} />
        </Link>
      ))}
    </div>
  );
};

export default RowGames;
