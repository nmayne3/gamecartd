import { Comment, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: true;
  };
}>;

const DisplayComment = ({ comment }: { comment: CommentWithAuthor }) => {
  return (
    <div className="flex flex-row w-full place-content-between py-3">
      <div
        id="Author info"
        className="flex flex-row place-content-between basis-auto h-11"
      >
        {comment.author.image && (
          <Link href={`/user/${comment.author.slug}/`}>
            <Image
              width={24}
              height={24}
              src={comment.author.image}
              alt={`${comment.author.name}'s profile picture`}
              className="profile-badge h-fit"
            />
          </Link>
        )}
        <div className="px-2 text-xs">
          <Link
            href={`/user/${comment.author.slug}/`}
            className="font-semibold hover:brightness-125"
          >
            {comment.author.name}
          </Link>
          {}
        </div>
      </div>
      <span id="Comment content" className="basis-3/4 text-small">
        {" "}
        {comment.content}{" "}
      </span>
    </div>
  );
};

export default DisplayComment;

export const PlaceholderComment = () => {
  return (
    <div className="flex flex-row w-full place-content-between py-3">
      <div
        id="Author info"
        className="flex flex-row place-content-between basis-auto h-11"
      >
        <Skeleton className="w-6 h-6 rounded-full" />
        <div className="px-2 text-xs py-1">
          <Skeleton className="h-3 w-20" />
          {}
        </div>
      </div>
      <span id="Comment content" className="basis-3/4 text-sm py-1">
        {" "}
        <Skeleton className="h-4 w-56" />
      </span>
    </div>
  );
};
