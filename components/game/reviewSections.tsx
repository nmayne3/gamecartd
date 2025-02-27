import prisma from "@/lib/prisma";
import { ReviewCardGamePage } from "../reviewcardalt";
import { Section } from "../section";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export const PopularReviews = async ({ gameId }: { gameId: string }) => {
  const reviews = await prisma.review.findMany({
    where: { gameId: gameId },
    include: { _count: { select: { likedBy: true } } },
    orderBy: { likedBy: { _count: "desc" } },
    take: 3,
  });
  return (
    <div>
      {reviews.length > 0 && (
        <Section header="Popular Reviews">
          {reviews.map((review) => (
            <Suspense fallback={<PlaceholderReviewGamePage />}>
              <ReviewCardGamePage key={review.id} review={review} />
            </Suspense>
          ))}
        </Section>
      )}
    </div>
  );
};

export const RecentReviews = async ({ gameId }: { gameId: string }) => {
  const reviews = await prisma.review.findMany({
    where: { gameId: gameId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return (
    <div>
      {reviews.length > 0 && (
        <Section header="Popular Reviews">
          {reviews.map((review) => (
            <Suspense fallback={<PlaceholderReviewGamePage />}>
              <ReviewCardGamePage key={review.id} review={review} />
            </Suspense>
          ))}
        </Section>
      )}
    </div>
  );
};

export const PlaceholderReviewGamePage = () => {
  return (
    <section
      id="Placeholder Review"
      className="flex flex-row py-4 w-full min-h-fit h-40"
    >
      {/** Profile Image / Left */}
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      {/** Review section / Right */}
      <div className="flex flex-col justify-start gap-3 px-4 text-sm w-full">
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
