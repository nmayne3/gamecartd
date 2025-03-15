import Backdrop from "@/components/backdrop";
import BoxArt from "@/components/boxartalt";
import { InteractionPanel } from "@/components/game/interactionPanel";
import { SpinnerIcon } from "@/components/icons";
import InteractionPanelWrapper from "@/components/interactionpanel";
import { ReviewCard, StarRating } from "@/components/reviewcardalt";
import ProfileBadge from "@/components/user/ProfileBadge";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import { FaBoxesStacked, FaEye, FaHeart } from "react-icons/fa6";
import Image from "next/image";
import { Section } from "@/components/section";
import { LikeButton } from "@/components/reviewbuttons";
import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import CommentForm from "@/components/comments/commentForm";
import CommentSection from "@/components/comments/commentSection";

/**
 *
 * This is the page for an individual review
 */
const ReviewPage = async ({
  params,
}: {
  params: { slug: string; id: string; count: string };
}) => {
  const review = await prisma.review.findFirst({
    where: {
      Game: { slug: params.id },
      author: { slug: params.slug },
      logCount: +params.count,
    },
    include: {
      Game: { include: { screenshots: true } },
      author: true,
      _count: { select: { likedBy: true } },
      likedBy: true,
    },
  });

  if (!review) {
    return <div> UHH OHHHHH</div>;
  }
  const session = await getSession();
  const user = session?.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { likedPosts: true },
      })
    : undefined;
  const game = review.Game;
  const bg = game.screenshots ? game.screenshots[0] : undefined;
  const first_release_date = game.first_release_date;
  const initialLikeCount = review._count.likedBy;
  const initialLikedState = user
    ? user.likedPosts.map((post) => post.id).includes(review.id)
    : false;

  console.log("initialState from page: " + initialLikedState);

  return (
    <main className="flex min-h-screen flex-col m-auto w-full gap-8">
      {/** Backdrop Image Container */}

      <Backdrop bg={bg} name={game.name} />
      {/** Content */}
      <div
        className={`w-full md:flex md:flex-row max-w-3xl lg:max-w-screen-lg ${
          bg ? "-mt-64" : "mt-20"
        }  mx-auto place-items-start justify-self-center gap-12 h-fit p-8 lg:p-8 pb-4 z-10`}
      >
        <div className="md:basis-3/4 w-full">
          <div className="flex flex-row gap-12 w-full">
            {/** Boxart LEFT SIDE */}
            <figure className="hidden md:flex flex-col basis-1/5 flex-shrink-0 h-fit md:sticky md:top-4">
              <Link href={`/game/${game.slug}/`}>
                <BoxArt game={game} hoverEffect={true} />
              </Link>
            </figure>
            {/** Info Middle Column */}
            <section className="flex flex-col text-xs xl:text-medium pb-12 md:basis-4/5 w-full">
              <div
                id="Game Info / box art (mobile view)"
                className="flex flex-row justify-between w-full"
              >
                <header
                  id="Review Header"
                  className="flex flex-col items-start justify-center w-full"
                >
                  <span
                    id="Author info"
                    className="text-sm flex flex-row gap-1 place-items-center border-b-1 pb-2 mb-2 border-border w-full"
                  >
                    {review.author.image && (
                      <Link
                        href={`/user/${review.author.slug}`}
                        className="rounded-full"
                      >
                        <Image
                          src={review.author.image}
                          alt="Profile Picture"
                          className="w-6 h-6 border-opacity-100 border-white outline-white/10 -outline-offset-1  outline-1 outline rounded-full aspect-square profile-badge"
                          width={24}
                          height={24}
                        />
                      </Link>
                    )}
                    Review by
                    <h4 className="text-header-light-grey font-normal hover:text-cyan-400">
                      {/** User Name */}
                      <Link href={`/user/${review.author.slug}`} className="">
                        {review.author.name}
                      </Link>
                    </h4>
                  </span>
                  <div className="flex md:justify-start md:flex-row gap-2 md:items-baseline md:flex-wrap md:basis-full py-2">
                    <Link href={`/game/${game.slug}/`}>
                      <h1
                        id="Game Name"
                        className="font-dm-serif font-black text-2xl hover:text-cyan-500"
                      >
                        {" "}
                        {game.name}{" "}
                      </h1>
                    </Link>
                    <h2 className="flex flex-col-reverse md:flex-row gap-1 text-sm flex-shrink-0 xl:text-lg">
                      {/** Release Date */}
                      <time id="Release Year" className="text-discrete-grey">
                        {first_release_date && first_release_date.getFullYear()}
                      </time>
                    </h2>
                  </div>
                  {review.rating && <StarRating rating={review.rating} />}

                  <small className="py-3  text-menu-primary">
                    {" "}
                    {`Played ${review.createdAt.toLocaleDateString("en-uk", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}`}{" "}
                  </small>
                </header>
                <figure className="md:hidden basis-1/4 pl-4 pb-4">
                  <Link href={`/game/${game.slug}/`}>
                    <BoxArt game={game} hoverEffect={true} className="" />
                  </Link>
                </figure>
              </div>
              {/** Description Section */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-4">
                  {/** Game Description */}
                  <section id="Description">
                    {review.content && <p className=""> {review.content} </p>}
                  </section>
                  <div className="text-small">
                    <LikeButton
                      review={review}
                      initialState={initialLikedState}
                      initialCount={initialLikeCount}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/** Review Section */}
          <CommentSection type="review" replyingTo={review} />
        </div>
        {/** Right Side Column */}
        <aside className="basis-1/4 w-full">
          <Suspense
            fallback={
              <InteractionPanelWrapper className="p-2">
                {" "}
                Loading...{" "}
              </InteractionPanelWrapper>
            }
          >
            <InteractionPanel game={game} />
          </Suspense>
        </aside>
      </div>
    </main>
  );
};

export default ReviewPage;
