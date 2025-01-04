"use server";
import prisma from "@/lib/prisma";
import { getSession } from "../auth/[...nextauth]/auth";
import { Game } from "@/igdb/interfaces";
import { User } from "@prisma/client";
import { fetchGame } from "@/igdb/api";

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

export async function GetGame(slug: string) {
  const result = await prisma.game.findUnique({ where: { slug: slug } });
  return result;
}

/** Checks if game exists in db based off of slug, otherwise fetches game from igdb and adds game to db before returning */
export async function GetGameCombo(slug: string) {
  const result = await prisma.game.findUnique({ where: { slug: slug } });
  if (result) return result;
  const game = await fetchGame(slug);
  return AddGame(game);
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

  const author = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!author) {
    console.log("user not found.");
    return null;
  }

  const review = await prisma.review.create({
    data: {
      content: content,
      authorId: author.id,
      gameId: gameId,
    },
  });

  return review;
}

export async function AddGame(game: Game) {
  const first_release_date = game.first_release_date
    ? new Date(game.first_release_date * 1000)
    : null;
  const lead_developer = game.involved_companies[0];

  console.log(`DATE: ${lead_developer.company.start_date}`);

  const constructed_screenshots = game.screenshots
    ? {
        createMany: {
          data: game.screenshots.map((image) => {
            return {
              width: image.width,
              height: image.height,
              image_id: image.image_id,
              url: `https://images.igdb.com/igdb/image/upload/t_1080p/${image.image_id}.jpg`,
            };
          }),
        },
      }
    : {};

  const constructed_artworks = game.artworks
    ? {
        createMany: {
          data: game.artworks.map((image) => {
            return {
              width: image.width,
              height: image.height,
              image_id: image.image_id,
              url: `https://images.igdb.com/igdb/image/upload/t_1080p/${image.image_id}.jpg`,
            };
          }),
        },
      }
    : {};

  const newGame = await prisma.game.create({
    data: {
      name: game.name,
      slug: game.slug,
      first_release_date: first_release_date,
      cover: game.cover.image_id,
      tags: game.themes?.map((a) => a.name),
      summary: game.summary,
      genres: {
        connectOrCreate: game.genres.map((genre) => {
          return {
            where: {
              slug: genre.slug,
            },
            create: {
              name: genre.name,
              slug: genre.slug ? genre.slug : genre.name.toLowerCase(),
            },
          };
        }),
      },
      developers: {
        connectOrCreate: game.involved_companies
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
          }),
      },
      publishers: {
        connectOrCreate: game.involved_companies
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
          }),
      },
      supporting_devs: {
        connectOrCreate: game.involved_companies
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
          }),
      },
      platforms: {
        connectOrCreate: game.platforms.map((platform) => {
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
        }),
      },
      artworks: constructed_artworks,
      screenshots: constructed_screenshots,
    },
    include: {
      developers: true,
      screenshots: true,
      artworks: true,
      user_reviews: { include: { _count: { select: { likedBy: true } } } },
    },
  });
  console.log("Created Game and Company listings");
  console.log(newGame);
  return newGame;
}

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
