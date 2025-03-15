"use server";

import prisma from "@/lib/prisma";
import { List, Review } from "@prisma/client";

export async function createComment(
  comment: string,
  replyingTo: Review | List,
  type: "list" | "review",
  authorId: string
) {
  const result = await prisma.comment.create({
    data: {
      content: comment,
      authorId: authorId,
      reviewId: type == "review" ? replyingTo.id : undefined,
      listId: type == "list" ? replyingTo.id : undefined,
    },
    include: { author: true },
  });
  console.log("Comment posted: " + result);
  return result;
}
