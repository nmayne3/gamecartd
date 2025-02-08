import { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const UserNameBadge = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row gap-1 place-items-center">
      {user.image && (
        <Link href={`/user/${user.slug}`} className="rounded-full">
          <Image
            src={user.image}
            alt="Profile Picture"
            className="w-5 h-5 border-opacity-100 border-white outline-white/10 -outline-offset-1  outline-1 outline rounded-full aspect-square"
            width={32}
            height={32}
          />
        </Link>
      )}
      <Link
        href={`/user/${user.slug}`}
        className="text-header-light-grey/85 hover:text-header-light-grey text-xs"
      >
        {user.name}{" "}
      </Link>
    </div>
  );
};

export default UserNameBadge;
