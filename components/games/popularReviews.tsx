import prisma from "@/lib/prisma";
import { ReviewCard } from "../reviewcardalt";
import { Review } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { getSession } from "@/app/api/auth/[...nextauth]/auth";

const PopularReviews = async () => {
  const session = await getSession();
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { slug: session?.user.slug },
        include: { likedPosts: true },
      })
    : undefined;
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
    <div className="flex flex-col divide-y-1 divide-dark-grey">
      {popularReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          user={user ? user : undefined}
        />
      ))}
    </div>
  );
};

export default PopularReviews;

export const PlaceholderReview = () => {
  return (
    <section
      id="Placeholder Review"
      className="flex flex-row py-4 w-full min-h-fit h-40"
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
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-96 h-5" />
        </div>
        {/** Number of likes on the review */}
        <Skeleton className="flex flex-row gap-2 place-items-center text-xs w-20 h-3"></Skeleton>
      </div>
    </section>
  );
};

export const PlaceholderReviews = () => {
  return (
    <div className="flex flex-col divide-y-1 divide-dark-grey">
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
      <PlaceholderReview />
    </div>
  );
};
