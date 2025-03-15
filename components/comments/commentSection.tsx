import prisma from "@/lib/prisma";
import { Section, SectionHeader } from "../section";
import DisplayComment from "./displayComment";
import { useState } from "react";
import CommentClientSection from "./commentClientSection";
import { List, Review } from "@prisma/client";

/**
 *
 * Server component for comment section in which we fetch the comments
 * and pass it to our client component to be displayed
 * @returns
 */

const CommentSection = async ({
  replyingTo,
  type,
}: {
  replyingTo: List | Review;
  type: "list" | "review";
}) => {
  const initialComments = await prisma.comment.findMany({
    where: {
      reviewId: type == "review" ? replyingTo.id : undefined,
      listId: type == "list" ? replyingTo.id : undefined,
    },
    include: {
      author: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <CommentClientSection
      initialComments={initialComments}
      replyingTo={replyingTo}
      type={type}
    />
  );
};

export default CommentSection;
