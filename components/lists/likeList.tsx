"use client";

import { AddListToLiked, RemoveListFromLiked } from "@/app/api/lists/actions";
import { List } from "@prisma/client";
import { useSession } from "next-auth/react";
import { startTransition, useOptimistic, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

export const ListLikeButton = ({
  list,
  initialState,
}: {
  list: List;
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
      const response = await RemoveListFromLiked(list.slug);
    } else {
      const response = await AddListToLiked(list.slug);
    }
    setLiked(!liked);
    setIsFetching(false);
  };
  const user = useSession().data?.user;
  if (user) {
    return (
      <button
        className="flex flex-row items-center place-content-center group"
        onClick={async () => await handleChange()}
        disabled={user ? false : true}
      >
        {optimsticLiked && (
          <FaHeart
            className={`fill-accent-orange m-2`}
            style={{ scale: 1.2 }}
          />
        )}
        {!optimsticLiked && <FaHeart className="m-2" style={{ scale: 1.2 }} />}
        <div className=" group-hover:text-white">
          {!optimsticLiked && "Like this List?"}
          {optimsticLiked && (
            <div>
              <div className="group-hover:hidden">{"You Liked this List"}</div>
              <div className="hidden group-hover:block">{"Remove"}</div>
            </div>
          )}
        </div>
      </button>
    );
  } else {
    return <div> Sign in to create or like lists </div>;
  }
};
