import Searchbar from "@/components/lists/searchgame";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Game } from "@prisma/client";
import { MouseEventHandler, useState } from "react";

/**
 *
 * Dialog window for selecting a favorite game
 *
 */

export const FavoriteGameDialog = ({
  onSelect,
  displayButton,
}: {
  onSelect: (game_slug: string) => Promise<void>;
  displayButton: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full h-full"> </DialogTrigger>
      <AddButton
        className={`${displayButton == false ? "hidden" : ""}`}
        onClick={() => setOpen(true)}
      />
      <DialogContent className="divide-y">
        <DialogHeader>
          <DialogTitle> {`Pick a favorite game `} </DialogTitle>
          <DialogDescription>{""}</DialogDescription>
        </DialogHeader>
        <label>
          Name of Film
          <Searchbar
            className="rounded-l-sm"
            onClick={(slug: string) => {
              onSelect(slug);
              setOpen(false);
            }}
          />
        </label>
      </DialogContent>
    </Dialog>
  );
};

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
