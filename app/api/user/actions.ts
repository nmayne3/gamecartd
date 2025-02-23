"use server";

import prisma from "@/lib/prisma";
import { Game } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 *
 * @param id ID of the user we are updating
 * @param name username of the user we are updating
 * @param givenName first name of the user we are updating
 * @param lastName
 * @param slug
 * @param bio
 * @param website
 * @param location
 * @param favoriteGames
 * @returns updated User object
 */

export const updateProfile = async (
  id: string,
  name?: string,
  givenName?: string,
  lastName?: string,
  slug?: string,
  bio?: string,
  website?: string,
  location?: string,
  favoriteGames?: Game[]
) => {
  favoriteGames?.map((game) => console.log(game));
  console.log(id);

  await prisma.favoriteGame.deleteMany({ where: { userid: id } });

  const gamesArray = favoriteGames
    ? await prisma.favoriteGame.createManyAndReturn({
        data: favoriteGames.map((game, index) => {
          return {
            userid: id,
            gameid: game.id,
            rank: index.toString(),
          };
        }),
      })
    : {};

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: name ? name : {},
      givenName: givenName ? givenName : null,
      lastName: lastName ? lastName : null,
      slug: slug ? slug : {},
      bio: bio ? bio : null,
      website: website ? website : null,
      location: location ? location : null,
      favoriteGames: {
        connect: favoriteGames?.map((game) => {
          return {
            userid_gameid: { userid: id, gameid: game.id },
          };
        }),
      },
    },
  });
  revalidatePath("/user/[slug]");

  return updatedUser;
};
