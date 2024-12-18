"use server";

import { getSession } from "../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";

export const LikePost = async (id: string) => {
  const session = await getSession();
  const user = session?.user;
  if (!user?.email) {
    throw new Error("invalid user");
  }
  console.log("Liking post...");
  const result = prisma.review.update({
    where: { id: id },
    data: {
      likedBy: { connect: { email: user?.email } },
    },
  });
  if (!result) {
    return;
  }
  console.log("Post liked.");
  return result;
};

export const UnlikePost = async (id: string) => {
  const session = await getSession();
  const user = session?.user;
  if (!user?.email) {
    throw new Error("invalid user");
  }
  console.log("Unliking post...");
  const result = prisma.review.update({
    where: { id: id },
    data: {
      likedBy: { disconnect: { email: user?.email } },
    },
  });
  if (!result) {
    return;
  }
  console.log("Post unliked.");
  return result;
};

export const getPostsFromGame = async (gameId: string) => {
  const result = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: {
      user_reviews: {
        include: {
          _count: {},
        },
      },
    },
  });
};
