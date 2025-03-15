"use client";

import { LikePost, UnlikePost } from "@/app/api/posts/actions";
import { Review } from "@prisma/client";
import { useState, useOptimistic } from "react";
import { FaHeart } from "react-icons/fa6";
import { SpinnerIcon } from "./icons";
import { useSession } from "next-auth/react";

export const LikeButton = ({
  review,
  initialState,
  initialCount,
}: {
  review: Review;
  initialState: boolean;
  initialCount: number;
}) => {
  console.log("InitialState: " + initialState);
  const [liked, setLiked] = useState(initialState);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [optimisticCount, setOptimisticCount] = useOptimistic(likeCount);

  console.log("liked: " + liked);

  const handleChange = async () => {
    setOptimisticLiked(!liked);
    if (liked) {
      setOptimisticCount(likeCount - 1);
      setLikeCount(likeCount - 1);
      const response = await UnlikePost(review.id);
    } else {
      setOptimisticCount(likeCount + 1);
      setLikeCount(likeCount + 1);

      const response = await LikePost(review.id);
    }
    setLiked(!liked);
  };

  const session = useSession();
  return (
    <div className="flex flex-row gap-2">
      <button
        className="flex flex-row place-items-center group gap-1"
        onClick={handleChange}
        disabled={session.data?.user ? false : true}
      >
        <div>
          <FaHeart
            className={`${optimisticLiked ? "fill-accent-orange" : ""}`}
          />
        </div>
        <div className="group-hover:text-white font-medium">
          {!optimisticLiked && "Like review"}
          {optimisticLiked && (
            <div>
              <div className="">{"Liked"}</div>
            </div>
          )}
        </div>
      </button>
      <span className="font-light"> {`${optimisticCount} likes`}</span>
    </div>
  );
};
