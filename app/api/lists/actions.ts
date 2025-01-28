"use server";

import prisma from "@/lib/prisma";
import { getSession } from "../auth/[...nextauth]/auth";
import { makeURLSafe } from "@/hooks/urlsafe";
import { redirect, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const addGameToList = (game_slug: string, list_id: string) => {};

export const createList = async (
  name: string,
  description?: string,
  game_ids?: string[],
  ranked?: boolean
) => {
  console.log("creating list...");
  const session = await getSession();
  const user_id = session?.user?.id ? session.user.id : "";
  const ideal_slug = makeURLSafe(name);

  // Find lists with similar slugs
  const dupes = await prisma.list.findMany({
    where: {
      slug: { contains: ideal_slug },
    },
  });

  // Append number of duplicates to keep slugs unique
  const slug = dupes.length ? ideal_slug + "-" + dupes.length : ideal_slug;

  const constructed_games = game_ids
    ? {
        createMany: {
          data: game_ids.map((game_id) => {
            return { gameId: game_id };
          }),
        },
      }
    : {};

  const result = await prisma.list.create({
    data: {
      name: name,
      slug: slug,
      description: description ? description : "",
      authorId: user_id,
      games: constructed_games,
      ranked: ranked,
    },
  });
  console.log("list created");
  console.log(result);

  return result;
};

// Server action used to update a list's details
export const updateList = async (
  name: string,
  slug: string,
  description?: string,
  game_ids?: string[],
  ranked?: boolean
) => {
  console.log("creating list...");
  const session = await getSession();
  const user_id = session?.user?.id ? session.user.id : "";

  const constructed_games = game_ids
    ? {
        deleteMany: {},
        createMany: {
          data: game_ids.map((game_id) => {
            return { gameId: game_id };
          }),
        },
      }
    : {};

  const result = await prisma.list.update({
    where: { slug: slug },
    data: {
      name: name,
      description: description ? description : "",
      authorId: user_id,
      games: constructed_games,
      ranked: ranked,
    },
  });
  console.log("list created");
  console.log(result);
  return result;
};

export async function AddListToLiked(slug: string) {
  const session = await getSession();
  console.log("adding list to liked");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.list.update({
    where: {
      slug: slug,
    },
    data: {
      likedBy: {
        connect: {
          email: session?.user?.email,
        },
      },
    },
  });
  console.log("List added to liked");
  return result;
}

export async function RemoveListFromLiked(slug: string) {
  const session = await getSession();
  console.log("removing list from liked...");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.list.update({
    where: { slug: slug },
    data: {
      likedBy: {
        disconnect: { email: session.user.email },
      },
    },
  });
  console.log("List removed from liked");
  return result;
}
