"use server";
import prisma from "@/lib/prisma";
import { getSession } from "../auth/[...nextauth]/auth";
import { Game } from "@/igdb/interfaces";
import { Prisma, User } from "@prisma/client";
import { fetchGame } from "@/igdb/api";
import { makeURLSafe } from "@/hooks/urlsafe";

type GameWithReviewCount = Prisma.GameGetPayload<{
  include: {
    developers: true | false;
    publishers: true;
    platforms: true;
    genres: true;
    user_ratings: true;
    user_reviews: { include: { _count: { select: { likedBy: true } } } };
    artworks: true;
    screenshots: true;
    GameMode: true;
  };
}>;

type Include = {
  developers?: boolean;
  publishers?: boolean;
  platforms?: boolean;
  genres?: boolean;
  user_ratings?: boolean;
  user_reviews?: boolean;
  artworks?: boolean;
  screenshots?: boolean;
  GameMode?: boolean;
};

export async function AddToPlayed(slug: string) {
  const session = await getSession();
  console.log("adding game to played list");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.game.update({
    where: {
      slug: slug,
    },
    data: {
      users: {
        connect: {
          email: session?.user?.email,
        },
      },
    },
  });
  console.log("Game added to user list");
  return result;
}

export async function RemoveFromPlayed(slug: string, user_id: string) {
  /*
  const session = await getSession();
  console.log("removing game from played list...");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
    */
  const result = await prisma.game.update({
    where: { slug: slug },
    data: {
      users: {
        disconnect: { id: user_id },
      },
    },
  });
  console.log("Game removed from played list");
  return result;
}

export async function AddToLiked(slug: string) {
  const session = await getSession();
  console.log("adding game to liked");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.game.update({
    where: {
      slug: slug,
    },
    data: {
      likedBy: {
        connect: {
          email: session?.user?.email,
        },
      },
    },
  });
  console.log("Game added to liked");
  return result;
}

export async function RemoveFromLiked(slug: string) {
  const session = await getSession();
  console.log("removing game from liked...");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.game.update({
    where: { slug: slug },
    data: {
      likedBy: {
        disconnect: { email: session.user.email },
      },
    },
  });
  console.log("Game removed from liked");
  return result;
}

export async function AddToBacklog(slug: string) {
  const session = await getSession();
  console.log("adding game to backlog");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.game.update({
    where: {
      slug: slug,
    },
    data: {
      backloggedBy: {
        connect: {
          email: session?.user?.email,
        },
      },
    },
  });
  console.log("Game added to backlog");
  return result;
}

export async function RemoveFromBacklog(slug: string) {
  const session = await getSession();
  console.log("removing game from backlog...");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return;
  }
  const result = await prisma.game.update({
    where: { slug: slug },
    data: {
      backloggedBy: {
        disconnect: { email: session.user.email },
      },
    },
  });
  console.log("Game removed from backlog");
  return result;
}

// Checks if a game's data is stale and needs to be refreshed
function checkStale(updatedAt: Date) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return updatedAt < weekAgo;
}

export async function GetGame(
  slug: string,
  include: Include = {
    developers: false,
    publishers: false,
    platforms: false,
    genres: false,
    user_ratings: false,
    user_reviews: false,
    artworks: false,
    screenshots: false,
    GameMode: false,
  }
) {
  const result = await prisma.game.findUnique({
    where: { slug: slug },
    include: {
      developers: include.developers,
      publishers: include.publishers,
      platforms: include.platforms,
      genres: include.genres,
      user_ratings: include.user_ratings,
      user_reviews: include.user_reviews
        ? { include: { _count: { select: { likedBy: true } } } }
        : false,
      artworks: include.artworks,
      screenshots: include.screenshots,
      GameMode: include.GameMode,
    },
  });
  return result;
}

/** Checks if game exists in db based off of slug, otherwise fetches game from igdb and adds game to db before returning */
export async function GetGameCombo(
  slug: string,
  include: Include = {
    developers: false,
    publishers: false,
    platforms: false,
    genres: false,
    user_ratings: false,
    user_reviews: false,
    artworks: false,
    screenshots: false,
    GameMode: false,
  }
) {
  const result = await GetGame(slug, include);
  if (!result || result.updatedAt == null || checkStale(result.updatedAt)) {
    return AddGame(slug);
  }
  return result;
}

export async function CheckPlayed(slug: string, user_id: string) {
  const result = await prisma.game.findUniqueOrThrow({
    where: {
      slug: slug,
    },
    select: {
      _count: {
        select: {
          users: {
            where: { email: user_id },
          },
          likedBy: {
            where: { email: user_id },
          },
          backloggedBy: {
            where: { email: user_id },
          },
        },
      },
    },
  });

  return [
    result._count.users > 0,
    result._count.likedBy > 0,
    result._count.backloggedBy > 0,
  ];
}

export async function GetUser(slug: string) {
  const user = await prisma.user.findUnique({
    where: {
      slug: slug,
    },
  });

  return user;
}

export async function GetUserFromID(id: string) {
  const user = await prisma.user.findUnique({ where: { id: id } });

  return user;
}

// Creates a review for a given game,
export async function CreateReview({
  content,
  gameId,
}: {
  content: string;
  gameId: string;
}) {
  const session = await getSession();
  console.log("adding game to played list");
  if (session?.user?.email == null) {
    console.log("user email == null. Returning...");
    return null;
  }

  // fetches user along with their rating and likes
  const author = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ratings: { where: { gameId: gameId } },
      _count: { select: { likedGames: { where: { id: gameId } } } },
    },
  });
  if (!author) {
    console.log("user not found.");
    return null;
  }

  const constructedRating =
    author.ratings.length > 0 ? author.ratings[0].rating : null;

  // Creates review with score and liked status at the time of rating
  const review = await prisma.review.create({
    data: {
      content: content,
      authorId: author.id,
      gameId: gameId,
      rating: constructedRating,
      liked: author._count.likedGames > 0,
    },
  });

  return review;
}

/**
 * Adds or updates a game in our database with recent data from the IGDB
 *
 * @param slug unique url-safe slug value of the game we are updating
 * @returns updated game value
 */
export async function AddGame(
  slug: string,
  include: Include = {
    developers: false,
    publishers: false,
    platforms: false,
    genres: false,
    user_ratings: false,
    user_reviews: false,
    artworks: false,
    screenshots: false,
    GameMode: false,
  }
) {
  const game = await fetchGame(slug);
  const first_release_date = game.first_release_date
    ? new Date(game.first_release_date * 1000)
    : null;
  //const lead_developer = game.involved_companies[0];

  //console.log(`DATE: ${lead_developer.company.start_date}`);

  const constructed_screenshots = game.screenshots
    ? {
        connectOrCreate: game.screenshots.map((image) => {
          return {
            where: { image_id: image.image_id },
            create: {
              width: image.width,
              height: image.height,
              image_id: image.image_id,
              url: `https://images.igdb.com/igdb/image/upload/t_1080p/${image.image_id}.jpg`,
            },
          };
        }),
      }
    : {};

  const constructed_artworks = game.artworks
    ? {
        connectOrCreate: game.artworks.map((image) => {
          return {
            where: { image_id: image.image_id },
            create: {
              width: image.width,
              height: image.height,
              image_id: image.image_id,
              url: `https://images.igdb.com/igdb/image/upload/t_1080p/${image.image_id}.jpg`,
            },
          };
        }),
      }
    : {};

  const updatedGame = await prisma.game.upsert({
    where: {
      slug: game.slug,
    },
    create: {
      name: game.name,
      slug: game.slug,
      first_release_date: first_release_date,
      cover: game.cover ? game.cover.image_id : undefined,
      tags: game.themes?.map((a) => a.name),
      summary: game.summary,
      genres: {
        connectOrCreate: game.genres
          ? game.genres.map((genre) => {
              return {
                where: {
                  slug: genre.slug,
                },
                create: {
                  name: genre.name,
                  slug: genre.slug ? genre.slug : genre.name.toLowerCase(),
                },
              };
            })
          : [],
      },
      developers: {
        connectOrCreate: game.involved_companies
          ? game.involved_companies
              .filter((comapny) => comapny.developer)
              .map((involved_company) => {
                return {
                  where: {
                    slug: involved_company.company.slug,
                  },
                  create: {
                    name: involved_company.company.name,
                    description: involved_company.company.description,
                    country: involved_company.company.country,
                    logo: involved_company.company.logo?.image_id
                      ? involved_company.company.logo?.image_id
                      : null,
                    founded: involved_company.company.start_date
                      ? new Date(involved_company.company.start_date * 1000)
                      : null,
                    slug: involved_company.company.slug,
                  },
                };
              })
          : [],
      },
      publishers: {
        connectOrCreate: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.publisher)
              .map((involved_company) => {
                return {
                  where: {
                    slug: involved_company.company.slug,
                  },
                  create: {
                    name: involved_company.company.name,
                    description: involved_company.company.description,
                    country: involved_company.company.country,
                    logo: involved_company.company.logo?.image_id
                      ? involved_company.company.logo?.image_id
                      : null,
                    founded: involved_company.company.start_date
                      ? new Date(involved_company.company.start_date * 1000)
                      : null,
                    slug: involved_company.company.slug,
                  },
                };
              })
          : [],
      },
      supporting_devs: {
        connectOrCreate: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.supporting)
              .map((involved_company) => {
                return {
                  where: {
                    slug: involved_company.company.slug,
                  },
                  create: {
                    name: involved_company.company.name,
                    description: involved_company.company.description,
                    country: involved_company.company.country,
                    logo: involved_company.company.logo?.image_id
                      ? involved_company.company.logo?.image_id
                      : null,
                    founded: involved_company.company.start_date
                      ? new Date(involved_company.company.start_date * 1000)
                      : null,
                    slug: involved_company.company.slug,
                  },
                };
              })
          : [],
      },
      platforms: {
        connectOrCreate: game.platforms
          ? game.platforms.map((platform) => {
              return {
                where: {
                  slug: platform.slug,
                },
                create: {
                  name: platform.name,
                  slug: platform.slug,
                  abbreviation: platform.abbreviation,
                  alternative_name: platform.alternative_name,
                  generation: platform.generation,
                  summary: platform.summary,
                  url: platform.url,
                  platformFamily: platform.platform_family
                    ? {
                        connectOrCreate: {
                          where: {
                            slug: platform.platform_family.slug
                              ? platform.platform_family.slug
                              : platform.platform_family.name.toLowerCase(),
                          },
                          create: {
                            name: platform.platform_family?.name,
                            slug: platform.platform_family.slug
                              ? platform.platform_family.slug
                              : platform.platform_family.name.toLowerCase(),
                          },
                        },
                      }
                    : {},
                  platformLogo: platform.platform_logo
                    ? {
                        connectOrCreate: {
                          where: {
                            image_id: platform.platform_logo.image_id,
                          },
                          create: {
                            image_id: platform.platform_logo.image_id,
                            animated: platform.platform_logo.animated
                              ? platform.platform_logo.animated
                              : false,
                            alpha_channel: platform.platform_logo.alpha_channel
                              ? platform.platform_logo.alpha_channel
                              : false,
                            height: platform.platform_logo.height,
                            width: platform.platform_logo.width,
                            url: platform.platform_logo.url
                              ? platform.platform_logo.url
                              : "",
                          },
                        },
                      }
                    : {},
                },
              };
            })
          : [],
      },
      GameMode: {
        connectOrCreate: game.game_modes
          ? game.game_modes.map((mode) => {
              return {
                where: { slug: mode.slug ? mode.slug : makeURLSafe(mode.name) },
                create: {
                  name: mode.name,
                  slug: mode.slug ? mode.slug : makeURLSafe(mode.name),
                },
              };
            })
          : [],
      },
      keywords: game.keywords
        ? game.keywords.map((descriptor) => descriptor.name)
        : [],
      artworks: constructed_artworks,
      screenshots: constructed_screenshots,
      alternate_names: game.alternative_names
        ? game.alternative_names.map((entry) => entry.name)
        : [],
    },
    update: {
      name: game.name,
      first_release_date: first_release_date,
      cover: game.cover ? game.cover.image_id : undefined,
      tags: game.themes?.map((a) => a.name),
      summary: game.summary,
      genres: {
        connectOrCreate: game.genres
          ? game.genres.map((genre) => {
              return {
                where: {
                  slug: genre.slug,
                },
                create: {
                  name: genre.name,
                  slug: genre.slug ? genre.slug : genre.name.toLowerCase(),
                },
              };
            })
          : [],
      },
      developers: {
        connectOrCreate: game.involved_companies
          ? game.involved_companies
              .filter((comapny) => comapny.developer)
              .map((involved_company) => {
                return {
                  where: {
                    slug: involved_company.company.slug,
                  },
                  create: {
                    name: involved_company.company.name,
                    description: involved_company.company.description,
                    country: involved_company.company.country,
                    logo: involved_company.company.logo?.image_id
                      ? involved_company.company.logo?.image_id
                      : null,
                    founded: involved_company.company.start_date
                      ? new Date(involved_company.company.start_date * 1000)
                      : null,
                    slug: involved_company.company.slug,
                  },
                };
              })
          : [],
      },
      publishers: {
        connectOrCreate: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.publisher)
              .map((involved_company) => {
                return {
                  where: {
                    slug: involved_company.company.slug,
                  },
                  create: {
                    name: involved_company.company.name,
                    description: involved_company.company.description,
                    country: involved_company.company.country,
                    logo: involved_company.company.logo?.image_id
                      ? involved_company.company.logo?.image_id
                      : null,
                    founded: involved_company.company.start_date
                      ? new Date(involved_company.company.start_date * 1000)
                      : null,
                    slug: involved_company.company.slug,
                  },
                };
              })
          : [],
      },
      supporting_devs: {
        connectOrCreate: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.supporting)
              .map((involved_company) => {
                return {
                  where: {
                    slug: involved_company.company.slug,
                  },
                  create: {
                    name: involved_company.company.name,
                    description: involved_company.company.description,
                    country: involved_company.company.country,
                    logo: involved_company.company.logo?.image_id
                      ? involved_company.company.logo?.image_id
                      : null,
                    founded: involved_company.company.start_date
                      ? new Date(involved_company.company.start_date * 1000)
                      : null,
                    slug: involved_company.company.slug,
                  },
                };
              })
          : [],
      },
      platforms: {
        connectOrCreate: game.platforms
          ? game.platforms.map((platform) => {
              return {
                where: {
                  slug: platform.slug,
                },
                create: {
                  name: platform.name,
                  slug: platform.slug,
                  abbreviation: platform.abbreviation,
                  alternative_name: platform.alternative_name,
                  generation: platform.generation,
                  summary: platform.summary,
                  url: platform.url,
                  platformFamily: platform.platform_family
                    ? {
                        connectOrCreate: {
                          where: {
                            slug: platform.platform_family.slug
                              ? platform.platform_family.slug
                              : platform.platform_family.name.toLowerCase(),
                          },
                          create: {
                            name: platform.platform_family?.name,
                            slug: platform.platform_family.slug
                              ? platform.platform_family.slug
                              : platform.platform_family.name.toLowerCase(),
                          },
                        },
                      }
                    : {},
                  platformLogo: platform.platform_logo
                    ? {
                        connectOrCreate: {
                          where: {
                            image_id: platform.platform_logo.image_id,
                          },
                          create: {
                            image_id: platform.platform_logo.image_id,
                            animated: platform.platform_logo.animated
                              ? platform.platform_logo.animated
                              : false,
                            alpha_channel: platform.platform_logo.alpha_channel
                              ? platform.platform_logo.alpha_channel
                              : false,
                            height: platform.platform_logo.height,
                            width: platform.platform_logo.width,
                            url: platform.platform_logo.url
                              ? platform.platform_logo.url
                              : "",
                          },
                        },
                      }
                    : {},
                },
              };
            })
          : [],
      },
      GameMode: {
        connectOrCreate: game.game_modes
          ? game.game_modes.map((mode) => {
              return {
                where: { slug: mode.slug ? mode.slug : makeURLSafe(mode.name) },
                create: {
                  name: mode.name,
                  slug: mode.slug ? mode.slug : makeURLSafe(mode.name),
                },
              };
            })
          : [],
      },
      keywords: game.keywords
        ? game.keywords.map((descriptor) => descriptor.name)
        : [],
      artworks: constructed_artworks,
      screenshots: constructed_screenshots,
      alternate_names: game.alternative_names
        ? game.alternative_names.map((entry) => entry.name)
        : [],
    },
    include: {
      developers: include.developers,
      publishers: include.publishers,
      platforms: include.platforms,
      genres: include.genres,
      user_ratings: include.user_ratings,
      user_reviews: include.user_reviews
        ? { include: { _count: { select: { likedBy: true } } } }
        : false,
      artworks: include.artworks,
      screenshots: include.screenshots,
      GameMode: include.GameMode,
    },
  });
  console.log("Updated Game and Company listings");
  //  console.log(updatedGame);
  return updatedGame;
}

// Creates/Overwrites a user's rating for a game
export async function rateGame(
  user_id: string,
  game_id: string,
  score: number
) {
  console.log("Intiating Rating...");
  const rating = await prisma.rating.upsert({
    where: { userId_gameId: { userId: user_id, gameId: game_id } },
    create: {
      userId: user_id,
      gameId: game_id,
      rating: score,
    },
    update: {
      rating: score,
    },
  });
  console.log("Rating ended");
  return rating;
}
