import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import PlayedButton, { BacklogButton, LikeButton } from "../playedbutton";
import ReviewWindow, { StarRating } from "../reviewwindow";
import { Game } from "@prisma/client";
import { CheckPlayed } from "@/app/api/games/actions";
import prisma from "@/lib/prisma";
import InteractionPanelWrapper from "../interactionpanel";

export const InteractionPanel = async ({ game }: { game: Game }) => {
  const session = await getSession();

  const [played, liked, backlogged] = session?.user.email
    ? await CheckPlayed(game.slug, session?.user.email)
    : [false];

  console.log("Game played: " + played);
  const rating = session?.user.id
    ? await prisma.rating.findUnique({
        where: { userId_gameId: { userId: session?.user.id, gameId: game.id } },
      })
    : null;

  return (
    <div className="w-full">
      {!session && (
        <InteractionPanelWrapper>
          <h4 className="flex w-full bg-secondary rounded-t-sm-md justify-center p-2">
            {" "}
            Sign in to log, rate or review{" "}
          </h4>
          <h4 className="flex w-full bg-secondary rounded-b-sm-md justify-center p-2">
            Share
          </h4>
        </InteractionPanelWrapper>
      )}
      {session && (
        <section
          id="Review/Interaction Table"
          className="flex flex-col bg-secondary rounded-sm place-content-center w-full divide-y-1 divide-primary text-sm"
        >
          <div className="grid grid-cols-3 w-full p-2">
            <PlayedButton game={game} initialState={played} />
            <LikeButton game={game} initialState={liked} />
            <BacklogButton game={game} initialState={backlogged} />
          </div>
          <div className="place-items-center place-content-center w-full text-center p-2">
            {"Rate"}
            <div className="flex flex-row gap-1 w-full place-content-center">
              {" "}
              <StarRating
                game={game}
                initialState={rating ? true : false}
                initialRating={rating ? rating.rating : 0}
              />{" "}
            </div>
          </div>
          <div className="place-items-center place-content-center w-full text-center p-2">
            <ReviewWindow
              game={game}
              rating={rating?.rating || 0}
              isRated={rating ? true : false}
            ></ReviewWindow>
          </div>
          <div className="place-items-center place-content-center w-full text-center p-2">
            {"Add to List"}
          </div>
        </section>
      )}
    </div>
  );
};
