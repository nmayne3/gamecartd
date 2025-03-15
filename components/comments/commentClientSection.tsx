"use client";

import { Section, SectionHeader } from "../section";
import DisplayComment, { PlaceholderComment } from "./displayComment";
import { useState } from "react";
import { List, Prisma, Review } from "@prisma/client";
import CommentForm from "./commentForm";

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: true;
  };
}>;

const CommentClientSection = ({
  initialComments,
  replyingTo,
  type,
}: {
  initialComments: CommentWithAuthor[];
  replyingTo: List | Review;
  type: "review" | "list";
}) => {
  const [comments, setComments] = useState(initialComments);

  return (
    <div>
      <Section
        header={
          comments.length > 0 ? `${comments.length} Comments` : `Comment?`
        }
      >
        {comments.map((comment) => (
          <DisplayComment key={comment.id} comment={comment} />
        ))}
      </Section>
      <CommentForm
        type={type}
        replyingTo={replyingTo}
        className="border-t-1 "
        setComments={setComments}
      />
    </div>
  );
};

export default CommentClientSection;
