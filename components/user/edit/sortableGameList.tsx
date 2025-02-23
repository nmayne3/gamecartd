import React, { MutableRefObject, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  restrictToHorizontalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { SortableItem } from "../../ui/dnd-kit/sortableItem";
import { Game } from "@prisma/client";
import BoxArt from "../../boxartalt";
import { DnDItem } from "../../ui/dnd-kit/item";
import FavoriteGameListing from "./favoriteGameListing";
import { GetGameCombo } from "@/app/api/games/actions";

type ListItem = {
  id: UniqueIdentifier;
  game?: Game;
};

const SortableGameList = ({
  favorites,
  favoritesRef,
}: {
  favorites: Game[];
  favoritesRef: MutableRefObject<
    | {
        name: string;
        id: string;
        slug: string;
        summary: string | null;
        cover: string | null;
        first_release_date: Date | null;
        tags: string[];
      }[]
    | undefined
  >;
}) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeGame, setActiveGame] = useState<Game | undefined>();

  // Make initial games accept empty strings so it gets mapped and is compatible with SortableContext
  const [games, setGames] = useState(() => {
    const initialItems = Array<ListItem>(
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    );
    favorites.slice(0, 4).map((game, index) => {
      initialItems[index].game = game;
    });
    return initialItems;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    })
  );

  favoritesRef.current = games
    .map((listing) => listing.game)
    .filter((game) => game != undefined);

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={games.map((game) => game.id)}
        strategy={horizontalListSortingStrategy}
      >
        {games.map((game, index) => {
          return (
            <div className={`w-full h-full`} key={index}>
              <SortableItem key={game.id} props={{ id: game.id }}>
                <FavoriteGameListing
                  games={games}
                  setGames={setGames}
                  listing={game}
                  isActive={game.id == activeId}
                />
              </SortableItem>
            </div>
          );
        })}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <DnDItem>
            <BoxArt game={activeGame} hoverEffect={false} />
          </DnDItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id);

    const oldIndex = games.map((game) => game.id).indexOf(active.id);
    setActiveGame(games[oldIndex].game);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log("active: " + active.id);
    if (over) console.log("over: " + over.id);

    if (over && active.id !== over.id) {
      setGames((games) => {
        const oldIndex = games.map((game) => game.id).indexOf(active.id);
        const newIndex = games.map((game) => game.id).indexOf(over.id);
        console.log("Swapping items " + oldIndex + ", " + newIndex);
        favorites = arrayMove(favorites, oldIndex, newIndex);
        const moved = arrayMove(games, oldIndex, newIndex);

        return moved;
      });
    }

    setActiveId(null);
    setActiveGame(undefined);
  }
};

export default SortableGameList;
