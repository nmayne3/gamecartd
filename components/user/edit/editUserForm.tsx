"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../ui/input";
import { Game, Prisma, User } from "@prisma/client";
import { Textarea } from "../../ui/textarea";
import FavoriteGamesForm from "./favoriteGamesForm";
import { useRef, useState } from "react";
import { updateProfile } from "@/app/api/user/actions";
import { toast } from "@/hooks/use-toast";
import Button from "@/components/button";
import { revalidatePath } from "next/cache";

/**
 *
 * Primary form for the User Settings page.
 * Has fields for editing a user's name, username, URL,
 * location, website, bio, and Favorite Games
 *
 * @param user The current active user editing their profile
 *
 * @returns React Form for editing a user's profile on the Settings Page
 */

type UserWithFavorites = Prisma.UserGetPayload<{
  include: {
    favoriteGames: { include: { game: true } };
  };
}>;

const EditUserForm = ({ user }: { user: UserWithFavorites }) => {
  const favorites = user.favoriteGames.map((listing) => listing.game);
  const refGames = useRef<Game[]>();

  const FormSchema = z.object({
    name: z.string().max(100, "Review must be no more than 100 characters"),
    givenName: z.string().optional(),
    lastName: z.string().optional(),
    slug: z.string(),
    bio: z
      .string()
      .max(240, "Review must be no more than 240 characters")
      .optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    games: z
      .object({
        name: z.string(),
        summary: z.string().nullish(),
        id: z.string(),
        slug: z.string(),
        cover: z.string().nullish(),
        first_release_date: z.date().nullish(),
        tags: z.string().array(),
      })
      .array(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("");
    const profile = await updateProfile(
      user.id,
      data.name,
      data.givenName,
      data.lastName,
      data.slug,
      data.bio,
      data.website,
      data.location,
      refGames.current
    );
    if (profile) {
      toast({
        title: "Profile " + data.name + "  Updated ✅",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error: ❌",
        description: "Failed to update profile",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-24 min-h-fit h-full pb-4">
        <section
          id="Text Inputs"
          className="flex flex-col gap-4 basis-1/2 w-full *:w-full "
        >
          <label htmlFor="username">
            {"Username"}
            <Input
              id="username"
              defaultValue={user.name}
              {...form.register("name")}
            />
          </label>
          <div className="flex flex-row place-content-between *:basis-1/2 gap-2">
            <label htmlFor="given name">
              {"Given name"}
              <Input
                id="given name"
                defaultValue={user.givenName ? user.givenName : ""}
                {...form.register("givenName")}
              />
            </label>
            <label htmlFor="family name">
              {"Family name"}
              <Input
                id="family name"
                defaultValue={user.lastName ? user.lastName : ""}
                {...form.register("lastName")}
              />
            </label>
          </div>
          <label htmlFor="custom url">
            {`Custom URL`}
            <Input
              id="custom url"
              defaultValue={user.slug}
              {...form.register("slug")}
            />
          </label>
          <div className="flex flex-row place-content-between *:basis-1/2 gap-2">
            <label htmlFor="location">
              {" "}
              {"Location"}
              <Input
                id="location"
                defaultValue={user.location ? user.location : ""}
                {...form.register("location")}
              />
            </label>
            <label htmlFor="website">
              {" "}
              {"Website"}
              <Input
                id="website"
                defaultValue={user.website ? user.website : ""}
                {...form.register("website")}
              />
            </label>
          </div>
          <label htmlFor="bio"> {"Bio"}</label>
          <Textarea
            id="bio"
            className="h-32"
            defaultValue={user.bio ? user.bio : ""}
            placeholder=""
            {...form.register("bio")}
          />
        </section>
        <section id="Favorite Games" className="basis-1/2 w-full">
          <Controller
            name="games"
            control={form.control}
            defaultValue={favorites}
            render={({ field }) => {
              return (
                <FavoriteGamesForm games={favorites} favoritesRef={refGames} />
              );
            }}
          ></Controller>
        </section>
      </div>
      <button className="button text-sm font-bold !bg-accent-green !text-white">
        {" "}
        Save Changes{" "}
      </button>
    </form>
  );
};

export default EditUserForm;
