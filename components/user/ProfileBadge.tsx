import { Prisma, User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

type UserWithCounts = Prisma.UserGetPayload<{
  include: {
    _count: { select: { games: true; reviews: true } };
  };
}>;

const ProfileBadge = ({ user }: { user: UserWithCounts }) => {
  return (
    <div className="flex flex-row gap-1 place-items-center border-b-1 border-dark-grey py-2">
      {user.image && (
        <Link href={`/user/${user.slug}`} className="rounded-full">
          <Image
            src={user.image}
            alt="Profile Picture"
            className="w-9 h-9 border-opacity-100 border-white outline-white/10 -outline-offset-1  outline-1 outline rounded-full aspect-square profile-badge"
            width={32}
            height={32}
          />
        </Link>
      )}
      <div className="px-1">
        <Link
          href={`/user/${user.slug}`}
          className="text-neutral-50 font-semibold hover:text-header-light-grey"
        >
          {user.name}{" "}
        </Link>
        <span className="flex flex-row place-items-baseline text-xs text-menu-primary">
          <Link
            href={`/user/${user.slug}/games`}
            className="hover:text-trimary"
          >
            {`${user._count.games} games`}
          </Link>
          <small className="text-xs">{`, ${user._count.reviews} reviews`}</small>
        </span>
      </div>
    </div>
  );
};

export default ProfileBadge;
