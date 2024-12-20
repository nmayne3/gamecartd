"use client";

import {
  FaEye,
  FaHeart,
  FaRegHeart,
  FaRegCalendarPlus,
  FaCalendarMinus,
} from "react-icons/fa6";
import { IoEye, IoEyeOutline } from "react-icons/io5";
import { Game } from "@prisma/client";
import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { useState, useOptimistic, startTransition } from "react";
import {
  AddToBacklog,
  AddToLiked,
  AddToPlayed,
  CheckPlayed,
  RemoveFromBacklog,
  RemoveFromLiked,
  RemoveFromPlayed,
} from "@/app/api/games/actions";
import { SpinnerIcon } from "./icons";

const PlayedButton = ({
  game,
  initialState,
}: {
  game: Game;
  initialState: boolean;
}) => {
  const [played, setPlayed] = useState(initialState);
  const [optimsticPlayed, setOptimistic] = useOptimistic(played);

  const session = useSession();
  const user_id = session.data?.user.id;
  if (!user_id) {
    throw "No user id what in the hell boss";
  }

  const handleChange = async () => {
    startTransition(() => {
      setOptimistic(!played);
    });

    const response = played
      ? await RemoveFromPlayed(game.slug, user_id)
      : await AddToPlayed(game.slug);

    setPlayed(!played);
  };
  return (
    <button
      className="flex flex-col place-items-center group"
      onClick={async () => await handleChange()}
      disabled={user_id ? false : true}
    >
      {optimsticPlayed ? (
        <IoEye
          style={{ scale: 2.1 }}
          className={`m-2 fill-accent-green scale-200`}
        />
      ) : (
        <IoEyeOutline className="m-2" style={{ scale: 2.1 }} />
      )}

      <div className="group-hover:text-white">
        <div>
          <div
            className={`${optimsticPlayed ? "group-hover:hidden" : ""}`}
          >{`Play${optimsticPlayed ? "ed" : ""}`}</div>
          <div
            className={`hidden ${optimsticPlayed ? "group-hover:block" : ""}`}
          >
            {"Remove"}
          </div>
        </div>
      </div>
    </button>
  );
};

export default PlayedButton;

export const LikeButton = ({
  game,
  initialState,
}: {
  game: Game;
  initialState: boolean;
}) => {
  const [liked, setLiked] = useState(initialState);
  const [optimsticLiked, setOptimistic] = useOptimistic(liked);

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async () => {
    setError(null);
    setIsFetching(true);
    startTransition(() => {
      setOptimistic(!liked);
    });
    if (liked) {
      const response = await RemoveFromLiked(game.slug);
    } else {
      const response = await AddToLiked(game.slug);
    }
    setLiked(!liked);
    setIsFetching(false);
  };
  const user = useSession().data?.user;
  return (
    <button
      className="flex flex-col place-items-center group"
      onClick={async () => await handleChange()}
      disabled={user ? false : true}
    >
      {optimsticLiked && (
        <FaHeart className={`fill-accent-orange m-2`} style={{ scale: 1.8 }} />
      )}
      {!optimsticLiked && <FaRegHeart className="m-2" style={{ scale: 1.8 }} />}
      <div className="group-hover:text-white">
        {!optimsticLiked && "Like"}
        {optimsticLiked && (
          <div>
            <div className="group-hover:hidden">{"Liked"}</div>
            <div className="hidden group-hover:block">{"Remove"}</div>
          </div>
        )}
      </div>
    </button>
  );
};

export const BacklogButton = ({
  game,
  initialState,
}: {
  game: Game;
  initialState: boolean;
}) => {
  const [backlogged, setBacklogged] = useState(initialState);
  const [optimsticBacklogged, setOptimistic] = useOptimistic(backlogged);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async () => {
    setError(null);
    setIsFetching(true);
    setOptimistic(!backlogged);
    if (backlogged) {
      const response = await RemoveFromBacklog(game.slug);
    } else {
      const response = await AddToBacklog(game.slug);
    }
    setBacklogged(!backlogged);
    setIsFetching(false);
  };
  const user_id = useSession().data?.user.id;
  return (
    <button
      className="flex flex-col place-items-center group"
      onClick={handleChange}
      disabled={user_id ? false : true}
    >
      <div className="">
        {optimsticBacklogged && (
          <FaCalendarMinus
            className={`fill-cyan-500 m-2`}
            style={{ scale: 1.8 }}
          />
        )}
        {!optimsticBacklogged && (
          <FaRegCalendarPlus className="m-2" style={{ scale: 1.8 }} />
        )}
      </div>
      <div className="group-hover:text-white">
        {!optimsticBacklogged && "Backlog"}
        {optimsticBacklogged && (
          <div>
            <div className="group-hover:hidden">{"Backlog"}</div>
            <div className="hidden group-hover:block">{"Remove"}</div>
          </div>
        )}
      </div>
    </button>
  );
};
