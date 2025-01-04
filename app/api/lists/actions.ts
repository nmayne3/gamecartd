"use server";

import prisma from "@/lib/prisma";
import { getSession } from "../auth/[...nextauth]/auth";

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

