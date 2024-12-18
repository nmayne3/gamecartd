export interface Game {
  artworks: Array<Picture>;
  keywords: Array<Descriptor>;
  genres: Array<Descriptor>;
  name: string;
  summary: string;
  involved_companies: InvolvedCompany[];
  first_release_date: number;
  cover: Picture;
  slug: string;
  themes: Array<Descriptor>;
  platforms: Array<Platform>;
  game_modes: Array<Descriptor>;
  game_localizations: Array<Localizations>;
  alternative_names: Array<Descriptor>;
  similar_games: Array<Game>;
  screenshots: Array<Picture>;
}

export interface Localizations {
  id: number;
  name: string;
  region: Descriptor;
}

export interface Picture {
  alpha_channel?: boolean;
  animated?: boolean;
  image_id: string;
  height: number;
  width: number;
  url?: string;
}

export interface Descriptor {
  id: number;
  name: string;
  slug?: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  description: string;
  games: Game[];
  country: number;
  logo: Picture;
  start_date: number;
}

export interface InvolvedCompany {
  developer?: boolean;
  publisher?: boolean;
  porting?: boolean;
  supporting?: boolean;
  company: Company;
}

export interface Platform {
  id?: string;
  abbreviation?: string; // An abbreviation of the platform name
  alternative_name?: string; //	An alternative name for the platform
  generation?: number; //	The generation of the platform
  name: string; // The name of the platform
  platform_family?: Descriptor; // 	Reference ID for Platform Family	The family of platforms this one belongs to
  platform_logo?: Picture; // Reference ID for Platform Logo	The logo of the first Version of this platform
  slug: string; //	A url-safe, unique, lower-case version of the name
  summary?: string; //	The summary of the first Version of this platform
  url?: string; //	The website address (URL) of the item
}
