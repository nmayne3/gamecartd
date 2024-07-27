import { getAccessToken, client_id } from "./auth";
import { Game } from "@/igdb/interfaces"

export const GetGame = async (id: string): Promise<Game> => {
    const access_token = getAccessToken();
    console.log(
      `Getting Game\nClient-ID: ${client_id}\nAuthorization: Bearer ${access_token}`
    );
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id,
        Authorization: "Bearer " + access_token,
      },
      body: `fields *, similar_games.cover.*, similar_games.name, similar_games.slug, platforms.name, game_localizations.name, game_localizations.region.name, alternative_names.name, game_modes.name, keywords.name, themes.name, cover.*, artworks.*, screenshots.*, genres.*, involved_companies.*, involved_companies.company.name; where slug = "${id}"; limit 1;`,
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
    console.log(game);
    return await game[0];
  };
  
export const GetGames = async ({fields, filter, sort, limit}: {fields: string, filter?: string, sort?: string, limit: number}): Promise<Array<Game>> => {
    const access_token = getAccessToken();
    console.log(
      `Getting Game\nClient-ID: ${client_id}\nAuthorization: Bearer ${access_token}`
    );
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id,
        Authorization: "Bearer " + access_token,
      },
      body: `fields ${fields}; where ${filter}; sort ${sort}; limit ${limit};`
    });

    console.log(response.status);
    if(response.status != 200) {
        console.log(await response.clone().json())
    }
    const games = await response.json();
    console.log(games);
    return games;
}
  