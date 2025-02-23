import BoxArt from "@/components/boxartalt";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Game } from "@prisma/client";
import { FavoriteGameDialog } from "./pickFavoriteDialog";
import { GetGameCombo } from "@/app/api/games/actions";
import { MouseEventHandler, useState } from "react";

type ListItem = {
  id: UniqueIdentifier;
  game?: Game;
};

/**
 *
 * Renders a game lisitng for the Favorite games form in the user settings page
 *
 * @param listing the ListItem (type which contains an id and game) being rendered
 * @param isActive boolean which tells us if the current List Item is active in drag n drop
 * @returns User Component for rendering list entry
 */

const FavoriteGameListing = ({
  listing,
  isActive,
  games,
  setGames,
}: {
  listing: ListItem;
  isActive: boolean;
  games: ListItem[];
  setGames: React.Dispatch<React.SetStateAction<ListItem[]>>;
}) => {
  const handleSelect = async (game_slug: string) => {
    const game = await GetGameCombo(game_slug);
    const index = games.map((game) => game.id).indexOf(listing.id);
    setGames(games.toSpliced(index, 1, { id: listing.id, game: game }));
  };

  const handleRemove = () => {
    const index = games.map((game) => game.id).indexOf(listing.id);
    setGames(games.toSpliced(index, 1, { id: listing.id, game: undefined }));
  };

  const RemoveButton = () => {
    const MARK = "✕";

    return (
      <button
        onClick={handleRemove}
        type="button"
        className="rounded-full scale-75  bg-menu-primary border-t-1 border-trimary hover:border-orange-100 hover:text-orange-100 aspect-square h-fit place-self-center place-content-center hover:bg-accent-orange pb-[2px] px-[2px] text-small text-foreground "
        style={{ lineHeight: 0, zIndex: 999 }}
      >
        <div className="m-auto">{`🗙`}</div>
      </button>
    );
  };

  const [open, setOpen] = useState(false);

  return (
    <div
      className={` draggable w-full group/item ${
        isActive ? "*:bg-transparent *:outline-none " : ""
      }`}
    >
      <BoxArt
        game={listing.game}
        hoverEffect={false}
        className={`${isActive ? "invisible" : ""}`}
      >
        {" "}
        <div
          className={`absolute top-0 left-0 place-content-center center w-full h-full *:hover:opacity-100 place-items-center ${
            isActive ? "hidden" : ""
          }`}
        >
          <FavoriteGameDialog
            displayButton={listing.game == undefined}
            onSelect={handleSelect}
          />
        </div>
        <div
          className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 invisible group-hover/item:${
            listing.game ? "visible" : "invisible"
          }`}
        >
          <RemoveButton />
        </div>
      </BoxArt>
    </div>
  );
};

export default FavoriteGameListing;

const AddButton = ({
  onClick,
  className,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full text-2xl bg-menu-primary border-trimary border-t-1 aspect-square h-fit place-self-center place-content-center p-1 font-black  text-foreground opacity-50 ${className}`}
      style={{ lineHeight: 0, borderStyle: "revert" }}
    >
      <div className="-translate-y-0.5">{`+`}</div>
    </button>
  );
};
