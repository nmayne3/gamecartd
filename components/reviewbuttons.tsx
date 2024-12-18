"use client";

import { LikePost, UnlikePost } from "@/app/api/posts/actions";
import { Review } from "@prisma/client";
import { useState, useOptimistic } from "react";
import { FaHeart } from "react-icons/fa6";
import { SpinnerIcon } from "./icons";

export const LikeButton = ({
  review,
  initialState,
  initialCount,
}: {
  review: Review;
  initialState: boolean;
  initialCount: number;
}) => {
  const [liked, setLiked] = useState(initialState);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [optimisticCount, setOptimisticCount] = useOptimistic(likeCount);

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

  return (
    <div className="flex flex-row gap-2">
      <button
        className="flex flex-row place-items-center group gap-1"
        onClick={handleChange}
      >
        <div>
          <FaHeart
            className={`${optimisticLiked ? "fill-accent-orange" : ""}`}
          />
        </div>
        <div className="group-hover:text-white">
          {!optimisticLiked && "Like"}
          {optimisticLiked && (
            <div>
              <div className="">{"Liked"}</div>
            </div>
          )}
        </div>
      </button>
      <span> {`${optimisticCount} likes`}</span>
    </div>
  );
};
