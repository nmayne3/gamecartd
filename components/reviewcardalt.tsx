"use server";

import Image from "next/image";
import { FaHeart, FaStar, FaComment, FaStarHalfStroke } from "react-icons/fa6";
import ProfilePicture from "@/assets/archie.jpg";
import { Review, User } from "@prisma/client";
import { GetUser, GetUserFromID } from "@/app/api/games/actions";
import Link from "next/link";
import BoxArt from "./boxartalt";
import prisma from "@/lib/prisma";
import { LikeButton } from "./reviewbuttons";
import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import { Suspense } from "react";

export const ReviewCardGamePage = async ({ review }: { review: Review }) => {
  const user = await GetUserFromID(review.authorId);
  if (!user) {
    throw new Error("User not found");
  }
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: review.gameId },
    include: { _count: { select: { likedBy: { where: { id: user.id } } } } },
  });

  const session = await getSession();

  const constructedSelect = session?.user?.email
    ? { likedBy: { where: { email: session?.user?.email } } }
    : { likedBy: true };

  const likedReviews = await prisma.review.findUnique({
    where: { id: review.id },
    select: {
      _count: {
        select: constructedSelect,
      },
      likedBy: true,
    },
  });

  // User is signed in
  const initialLikedState = session?.user?.email
    ? likedReviews
      ? likedReviews._count.likedBy > 0
      : false
    : false;

  const initialLikeCount = likedReviews?.likedBy.length;

  const likedGame = game._count.likedBy > 0;

  const rating = await prisma.rating.findUnique({
    where: { userId_gameId: { userId: user.id, gameId: game.id } },
  });

  return (
    <section className="flex flex-row">
      {/** Profile Image / Left */}
      {user.image && (
        <Link href={`/user/${user.slug}`} className="rounded-full">
          <Image
            src={user.image}
            alt="Profile Picture"
            className="w-10 h-10 border-opacity-100 border-white outline-white/10 -outline-offset-1  outline-1 outline rounded-full aspect-square my-4"
            width={32}
            height={32}
          />
        </Link>
      )}
      {/** Review section / Right */}
      <div className="flex flex-col justify-start gap-4 p-4 text-sm">
        {/** Review Header */}
        <span className="text-xs flex flex-row gap-1 place-items-center">
          Review by
          <h4 className="text-header-light-grey font-medium hover:text-cyan-400">
            {/** User Name */}
            <Link href={`/user/${user.slug}`} className="">
              {user.name}
            </Link>
          </h4>
          {/** Star Rating */}
          {rating && <StarRating rating={rating.rating} />}
          {/** CHECK IF USER LIKED THE MOVIE */}
          {likedGame && <FaHeart className="fill-accent-orange" />}
          {/** Number of comments on review */}
          <h4 className="flex flex-row place-items-center gap-0.5">
            <FaComment className="fill-discrete-grey" />
            {"10"}
          </h4>
        </span>
        {/** Review text */}
        <p className=""> {review.content}</p>
        {/** Number of likes on the review */}
        <LikeButton
          review={review}
          initialState={initialLikedState}
          initialCount={initialLikeCount || 0}
        />
      </div>
    </section>
  );
};

export const ReviewCardUserPage = async ({
  user,
  review,
}: {
  user: User;
  review: Review;
}) => {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: review.gameId },
    include: { _count: { select: { likedBy: { where: { id: user.id } } } } },
  });

  const session = await getSession();

  // User is signed in
  const constructedSelect = session?.user?.email
    ? { likedBy: { where: { email: session?.user?.email } } }
    : { likedBy: true };

  const likedReviews = await prisma.review.findUniqueOrThrow({
    where: { id: review.id },
    select: {
      _count: {
        select: constructedSelect,
      },
      likedBy: true,
    },
  });

  // User is signed in
  const initialLikedState = session?.user?.email
    ? likedReviews._count.likedBy > 0
    : false;

  const initialLikeCount = likedReviews.likedBy.length;

  const likedGame = game._count.likedBy > 0;

  const rating = await prisma.rating.findUnique({
    where: { userId_gameId: { userId: user.id, gameId: game.id } },
  });

  return (
    <section id="Review Card" className="flex flex-row py-4">
      {/** Profile Image / Left */}
      {user.image && (
        <Link href={`/game/${game.slug}`} className="w-20 h-fit flex-shrink-0">
          <BoxArt game={game} />
        </Link>
      )}
      {/** Review section / Right */}
      <div className="flex flex-col justify-start gap-3 px-4 text-sm">
        {/** Review Header */}
        <h2 className="font-dm-serif font-semibold text-white text-xl">
          {" "}
          <Link href={`/game/${game.slug}`} className="hover:text-cyan-400">
            {game.name}{" "}
          </Link>
          {game.first_release_date && (
            <small className="font-sans font-light text-discrete-grey">{`${game.first_release_date.getFullYear()}`}</small>
          )}
        </h2>
        {/** Review Scoreboard */}
        <span className="flex flex-row gap-2 place-items-center text-discrete-grey/70">
          {/** Star Rating */}
          {rating && <StarRating rating={rating.rating} />}
          {/** CHECK IF USER LIKED THE GAME */}
          {likedGame && <FaHeart className="fill-accent-orange" />}
          {/** Review Date */}
          <small>
            {" "}
            {`Played ${review.createdAt.toLocaleDateString("en-gb", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}{" "}
          </small>
          {/** Number of comments on review */}
          <h4 className="flex flex-row place-items-center gap-0.5">
            <FaComment className="fill-discrete-grey" />
            {"10"}
          </h4>
        </span>
        {/** Review text */}
        <p className="text-md"> {review.content}</p>
        {/** Number of likes on the review */}
        <span className="flex flex-row gap-2 place-items-center text-xs">
          <LikeButton
            review={review}
            initialState={initialLikedState}
            initialCount={initialLikeCount}
          />
        </span>
      </div>
    </section>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0.5; i < rating; i++) {
    stars.push(<FaStar className="fill-accent-green-alt" key={i} />);
  }
  if (rating - stars.length) {
    stars.push(
      <FaStarHalfStroke className="fill-accent-green-alt" key={stars.length} />
    );
  }
  return <div className="flex flex-row gap-0">{stars}</div>;
};
