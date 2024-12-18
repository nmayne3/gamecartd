import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import { Section } from "@/components/section";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { ReviewCard } from "@/components/reviewcard";
import Link from "next/link";
import { Game, Prisma, Review } from "@prisma/client";
import BoxArt from "@/components/boxartalt";
import { ReviewCardUserPage } from "@/components/reviewcardalt";
import { ListGames } from "@/components/displaylist";
import { FaCalendar } from "react-icons/fa6";
import { RatingsChart } from "@/components/ratingschart";

type ReviewWithGame = Prisma.ReviewGetPayload<{
  include: { Game: true };
}>;

const UserPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      slug: slug,
    },
    include: {
      games: true,
      lists: true,
      reviews: {
        include: { Game: true, _count: { select: { likedBy: true } } },
      },
      backlog: true,
      ratings: true,
    },
  });
  console.log(user);
  if (!user) throw "Ahh no user!!";
  return (
    <main className="">
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />
      {/** Header Row */}
      <div className="bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x w-full h-full p-12">
        <div className="flex min-h-screen flex-col md:max-w-3xl lg:max-w-screen-lg w-full m-auto items-center gap-8">
          {/** User Card */}
          <div
            id="User Card"
            className="flex flex-row  w-full mx-auto gap-8 h-fit p-4 lg:p-0 lg:pb-4 pb-4 z-10 place-content-between"
          >
            {/** Name and Info */}
            <div className="flex flex-row gap-4">
              {user?.image && (
                <Image
                  className="profile-badge size-24"
                  src={user?.image}
                  alt="User Image"
                  width={128}
                  height={128}
                ></Image>
              )}
              <div className="flex flex-col">
                <h1> {user.name} </h1>
                <div> oh i am fun!</div>
                <div> Links: yeehaw </div>
              </div>
            </div>
            {/** Scorecard */}
            <div className="flex flex-row w-fit  divide-x-1 divide-discrete-grey place-items-center text-sm uppercase">
              <Link
                id="Game Counter"
                href={`${user.slug}/games`}
                className="place-items-center w-full px-2"
              >
                <h1 className="">{user.games.length}</h1>
                <h2 className="text-xs ">{"Games"}</h2>
              </Link>
              <div
                id="Review Counter"
                className="place-items-center w-full px-2"
              >
                <h1>{user.reviews.length}</h1>
                <h2 className="text-xs">{"Reviews"}</h2>
              </div>
              <div id="List Counter" className="place-items-center px-2 ">
                <h1>{user.lists.length}</h1>
                <h2 className="text-xs">{"Lists"}</h2>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-16">
            {/** Left Side */}
            <div
              id="Left Side"
              className="basis-2/3 flex flex-col gap-6 flex-shrink-0"
            >
              <Section header="Favorite Games">
                <RowGames games={user.games} limit={4}></RowGames>
              </Section>
              <Section header="Recent Games">
                <RowGames games={user.games} limit={4}></RowGames>
              </Section>
              {user.reviews.length > 0 && (
                <div>
                  <Section header="Recent Reviews" className="flex flex-col">
                    {user.reviews
                      .toSorted((a, b) => {
                        if (a.createdAt < b.createdAt) {
                          return 1;
                        } else if (a.createdAt > b.createdAt) {
                          return -1;
                        } else {
                          return 0;
                        }
                      })
                      .slice(0, 2)
                      .map((review) => (
                        <ReviewCardUserPage
                          key={review.id}
                          user={user}
                          review={review}
                        />
                      ))}
                  </Section>
                  <Section header="Popular Reviews" className="flex flex-col">
                    {user.reviews
                      .toSorted((a, b) => {
                        if (a._count.likedBy < b._count.likedBy) {
                          return 1;
                        } else if (a._count.likedBy > b._count.likedBy) {
                          return -1;
                        } else {
                          return 0;
                        }
                      })
                      .slice(0, 2)
                      .map((review) => (
                        <ReviewCardUserPage
                          key={review.id}
                          user={user}
                          review={review}
                        />
                      ))}
                  </Section>
                </div>
              )}
            </div>
            {/** Right Side */}
            <div
              id="Right Side"
              className="flex flex-col gap-6 basis-1/3 flex-grow-0"
            >
              {user.backlog.length > 0 && (
                <Section
                  header="Backlog"
                  href={`/user/${user.id}/backlog/`}
                  className="h-48"
                  more={user.backlog.length.toString()}
                >
                  <Link href={`/user/${user.id}/backlog/`}>
                    <ListGames backlog={user.backlog} />
                  </Link>
                </Section>
              )}
              <Diary reviews={user.reviews} />
              <Section header="Ratings" className="">
                <RatingsChart ratings={user.ratings} className="my-2" />
              </Section>
            </div>
          </div>
        </div>
        {!user && <div>No user found??</div>}
      </div>
    </main>
  );
};

export default UserPage;

const RowGames = ({ games, limit }: { games: Array<Game>; limit?: number }) => {
  if (!games) return;
  const size = limit || games.length < 7 ? "big" : "small";
  return (
    <div
      className={`flex flex-row h-auto place-items-center gap-2 py-2 ${
        limit && games.length >= limit ? "justify-between" : "justify-normal"
      }`}
    >
      {games.slice(0, limit).map((game) => (
        <Link href={`/game/${game.slug}`} key={game.slug} className="w-fit">
          <BoxArt game={game} size={size} className="max-h-72 max-w-fit" />
        </Link>
      ))}
    </div>
  );
};

const Diary = ({ reviews }: { reviews: Array<ReviewWithGame> }) => {
  const postsByMonth = new Array<Array<ReviewWithGame>>();
  const sortedReviews = reviews
    .toSorted((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      else if (a.createdAt > b.createdAt) return -1;
      else return 0;
    })
    .slice(0, 10);
  console.log(sortedReviews.length);

  console.log("Filling postsByMonth");
  for (let i = 0; i < sortedReviews.length; i++) {
    //  console.log("beginning loop at i == " + i);
    const tempFiltered = sortedReviews.filter((review) => {
      console.log(
        review.createdAt.getMonth() +
          " == " +
          sortedReviews.at(i)?.createdAt.getMonth()
      );
      return (
        review.createdAt.getMonth() == sortedReviews.at(i)?.createdAt.getMonth()
      );
    });
    //console.log("temp has been filtered");
    //console.log(tempFiltered);
    i += tempFiltered.length - 1;
    postsByMonth.push(tempFiltered);
  }
  console.log("Finished filling postsByMonth");
  return (
    <Section header="Diary" more={reviews.length.toString()}>
      <ol className="divide-y">
        {postsByMonth.map((month, idx, months) => (
          <li key={idx} className="flex flex-row py-2">
            <h4 className="basis-12 text-cyan calendar-fill flex-shrink-0 flex-grow-0 place-items-start ">
              {" "}
              {month.at(0)?.createdAt.toLocaleString(undefined, {
                month: "short",
              })}{" "}
            </h4>{" "}
            <dl className="text-list flex flex-col gap-2">
              {month.map((entry) => (
                <div
                  className="grid grid-cols-[25px_minmax(0px,_1fr)] gap-2"
                  key={entry.id}
                >
                  <dt className="place-content-start text-right text-popover">
                    {entry.createdAt.getDay()}
                  </dt>
                  <dd className="">
                    <Link
                      className="hover:text-cyan-400"
                      href={`/game/${entry.Game.slug}`}
                    >
                      {" "}
                      {entry.Game.name}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </Section>
  );
};
