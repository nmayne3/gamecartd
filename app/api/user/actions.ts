"use server";

import { makeURLSafe } from "@/hooks/urlsafe";
import prisma from "@/lib/prisma";
import { Game } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

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
  password?: string,
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

  var encrypted_password = null;
  if (password) encrypted_password = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: name ? name : {},
      password: encrypted_password,
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

export const createUser = async (
  email: string,
  username: string,
  password: string
) => {
  const default_profile_pic =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const ideal_slug = makeURLSafe(username);

  const dupes = await prisma.list.findMany({
    where: {
      slug: { contains: ideal_slug },
    },
  });

  // Append number of duplicates to keep slugs unique
  const slug = dupes.length ? ideal_slug + "-" + dupes.length : ideal_slug;

  const encrypted_password = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email: email,
      name: username,
      password: encrypted_password,
      slug: slug,
      image: default_profile_pic,
    },
  });

  return createdUser;
};
