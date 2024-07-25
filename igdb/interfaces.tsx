export interface Game {
  artworks: Array<Picture>;
  keywords: Array<Descriptor>;
  genres: Array<Descriptor>;
  name: string;
  summary: string;
  involved_companies: Company[];
  first_release_date: number;
  cover: Picture;
  slug: string;
  themes: Array<Descriptor>;
  platforms: Array<Descriptor>;
  game_modes: Array<Descriptor>;
  game_localizations: Array<Localizations>;
  alternative_names: Array<Descriptor>;
  similar_games: Array<Game>;
}

export interface Localizations {
  id: number;
  name: string;
  region: Descriptor;
}

export interface Picture {
  image_id: string;
  height: number;
  width: number;
}

export interface Descriptor {
  id: number;
  name: string;
}

export interface Company {
  developer?: boolean;
  publisher?: boolean;
  porting?: boolean;
  supporting?: boolean;
  company: Descriptor;
}
