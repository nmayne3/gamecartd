"use server";

import prisma from "@/lib/prisma";
import { getSession } from "../auth/[...nextauth]/auth";
import { makeURLSafe } from "@/hooks/urlsafe";

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
