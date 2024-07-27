import Link from "next/link";
import BoxArt from "./boxart";
import { Game } from "@/igdb/interfaces";

const RowGames = ({ games, limit }: { games: Array<Game>; limit?: number }) => {
  if (!games) return;
  return (
    <div className="flex flex-row h-auto justify-between gap-2 py-2">
      {games.slice(0, limit).map((game) => (
        <Link href={`/game/${game.slug}`} key={game.slug}>
          <BoxArt game={game} />
        </Link>
      ))}
    </div>
  );
};

export default RowGames;
