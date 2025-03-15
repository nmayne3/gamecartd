import { Comment, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

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
