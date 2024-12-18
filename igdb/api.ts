"use server";

import { getAccessToken } from "./auth";
import { Game } from "@/igdb/interfaces";

export const GetGame = async (id: string): Promise<Game> => {
  const access_token = getAccessToken();
  if (
    process.env.client_id === undefined ||
    process.env.client_secret === undefined
  ) {
    throw new Error("Invalid env vars");
  }

  console.log(
    `Getting Game\nClient-ID: ${process.env.client_id}\nAuthorization: Bearer ${access_token}`
  );
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.client_id,
      Authorization: "Bearer " + access_token,
    },
    body: `fields *, similar_games.cover.*, similar_games.name, similar_games.slug, platforms.name, game_localizations.name, game_localizations.region.name, alternative_names.name, game_modes.name, keywords.name, themes.name, cover.*, artworks.*, screenshots.*, genres.*, involved_companies.*, involved_companies.company.name, involved_companies.company.logo.*; where slug = "${id}"; limit 1;`,
  });
  const clone = await response.clone().json();
  console.log(response.status);
  // Authorization Error
  if (response.status == 401 || response.status == 400) {
    // Refresh token
    console.log(await response.json());
    throw new Error("AHHH SLUGS");

    GetGame(id);
  }
  const game = await response.json();

  //console.log(game);
  console.log(game.involved_companies[0]);
  return await game[0];
};

export const GetGames = async ({
  endpoint,
  fields,
  filter,
  sort,
  limit,
  offset,
}: {
  endpoint?: string;
  fields: string;
  filter?: string;
  sort?: string;
  limit: number;
  offset?: number;
}): Promise<Array<Game>> => {
  const access_token = getAccessToken();

  if (
    process.env.client_id === undefined ||
    process.env.client_secret === undefined
  ) {
    throw new Error("Invalid env vars");
  }

  console.log(
    `Getting Game\nClient-ID: ${process.env.client_id}\nAuthorization: Bearer ${access_token}`
  );
  endpoint = endpoint ? endpoint : "games";
  offset = offset ? offset : 0;
  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.client_id,
      Authorization: "Bearer " + access_token,
    },
    body: `fields ${fields}; where ${filter}; sort ${sort}; limit ${limit}; offset ${offset};`,
  });

  console.log(response.status);
  if (response.status != 200) {
    console.log(await response.clone().json());
  }
  const games = await response.json();
  console.log(await games);
  return await games;
};

export const SearchGame = async ({
  search,
  fields,
  filter,
  limit,
}: {
  search: string;
  fields: string;
  filter?: string;
  limit: number;
}): Promise<Array<Game>> => {
  const access_token = getAccessToken();
  if (
    process.env.client_id === undefined ||
    process.env.client_secret === undefined
  ) {
    throw new Error("Invalid env vars");
  }

  console.log(
    `Getting Game\nClient-ID: ${process.env.client_id}\nAuthorization: Bearer ${access_token}`
  );

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.client_id,
      Authorization: "Bearer " + access_token,
    },
    body: `fields ${fields}; where version_parent = null & name ~ *"${search}"*; sort rating desc; limit ${limit};`,
  });

  console.log(response.status);
  if (response.status != 200) {
    console.log(await response.clone().json());
  }
  const games = await response.json();
  console.log(games);
  return games;
};

{
  /** This search function sucks ass... replace it lol */
}
export const fetchSearchResults = async (search: string) => {
  console.log(`Searching for ${search}`);
  const games = await SearchGame({
    fields: `name, slug, first_release_date`,
    search: `${search}`,
    limit: 5,
  });
  return games;
};

export const fetchGame = async (slug: string) => {
  const access_token = getAccessToken();

  if (
    process.env.client_id === undefined ||
    process.env.client_secret === undefined
  ) {
    throw new Error("Invalid env vars");
  }

  console.log(
    `No slug city\nClient-ID: ${process.env.client_id}\nAuthorization: Bearer ${access_token}`
  );
  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.client_id,
      Authorization: "Bearer " + access_token,
    },
    body: `fields *, similar_games.cover.*, similar_games.name, similar_games.slug, platforms.*, platforms.platform_logo.*, platforms.platform_family.*, game_localizations.name, game_localizations.region.name, alternative_names.name, game_modes.name, keywords.name, themes.name, cover.*, artworks.*, screenshots.*, genres.*, involved_companies.*, involved_companies.company.*, involved_companies.company.logo.*; where slug = "${slug}"; limit 1;`,
  });
  const clone = await response.clone().json();
  console.log(response.status);
  // Authorization Error
  if (response.status == 401 || response.status == 400) {
    // Refresh token
    console.log(await response.json());
    throw new Error("AHHH SLUGS");
  }
  const game = await response.json();
  console.log(game);
  return await game[0];
};
