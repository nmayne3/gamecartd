import prisma from "@/lib/prisma";
import { ReviewCard } from "../reviewcardalt";
import { Review } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";

const PopularReviews = async () => {
  const popularReviews = await prisma.review.findMany({
    include: {
      Game: true,
      author: true,
      _count: { select: { likedBy: true } },
      likedBy: true,
    },
    orderBy: { likedBy: { _count: "desc" } },
    take: 6,
  });
  return (
    <div className="flex flex-col divide-y-1">
      {popularReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default PopularReviews;

export const PlaceholderReview = () => {
  return (
    <section
      id="Placeholder Review"
      className="flex flex-row py-4 w-full h-fit"
    >
      {/** Profile Image / Left */}
      <Skeleton className="w-20 h-28 flex-shrink-0"></Skeleton>
      {/** Review section / Right */}
      <div className="flex flex-col justify-start gap-3 px-4 text-sm w-full">
        {/** Review Header */}
        <Skeleton className="w-44 h-7 font-dm-serif font-semibold text-white text-xl">
          {" "}
        </Skeleton>
        {/** Review Scoreboard */}
        <Skeleton className="w-72 h-4" />
        {/** Review text */}
        <div className="w-full flex-col flex gap-1">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-96 h-6" />
        </div>
        {/** Number of likes on the review */}
        <Skeleton className="flex flex-row gap-2 place-items-center text-xs w-20 h-3"></Skeleton>
      </div>
    </section>
  );
};

export const PlaceholderReviews = () => {
  return (
    <div className="flex flex-col divide-y-1">
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
    </div>
  );
};
