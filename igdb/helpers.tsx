import { Game } from "./interfaces";

export const GetReleaseYear = (game: Game): number => {
  const first_release_date = new Date(game.first_release_date * 1000);

  return first_release_date.getFullYear();
};
