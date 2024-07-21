export interface Game {
  artworks: Array<Picture>;
  keywords: Array<Descriptor>;
  genres: Array<Descriptor>;
  name: string;
  summary: string;
  involved_companies: Company[];
  first_release_date: number;
  cover: Picture;
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
  company: number;
}
