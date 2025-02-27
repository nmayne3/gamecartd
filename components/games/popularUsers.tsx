import prisma from "@/lib/prisma";
import { ReviewCard } from "../reviewcardalt";
import { Review } from "@prisma/client";
import ProfileBadge from "../user/ProfileBadge";
import { Skeleton } from "../ui/skeleton";

const PopularUsers = async () => {
  const popularUsers = await prisma.user.findMany({
    include: {
      _count: { select: { games: true, reviews: true } },
      reviews: true,
    },
    take: 6,
  });
  return (
    <div className="flex flex-col divide-y-1">
      {popularUsers.map((user) => (
        <ProfileBadge key={user.slug} user={user} />
      ))}
    </div>
  );
};

export default PopularUsers;

export const PlaceholderUser = () => {
  return (
    <div className="flex flex-col divide-y-1 ">
      <div className="flex flex-row gap-1 place-items-center border-b-1 border-dark-grey py-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="px-1 flex flex-col gap-2 py-1">
          <Skeleton className="w-24 h-5 " />
          <span className="flex flex-row gap-1 place-items-baseline text-xs text-menu-primary">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-14 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
