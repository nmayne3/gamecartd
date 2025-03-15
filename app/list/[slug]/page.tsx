import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import BoxArt from "@/components/boxartalt";
import Backdrop from "@/components/backdrop";
import InteractionPanelWrapper from "@/components/interactionpanel";
import { ListLikeButton } from "@/components/lists/likeList";
import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import CommentSection from "@/components/comments/commentSection";

const ListPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const session = await getSession();
  const email = session?.user.email;
  const list = await prisma.list.findUniqueOrThrow({
    where: { slug: slug },
    include: {
      author: true,
      games: { include: { game: true } },
      likedBy: { where: { email: email ? email : "" } },
    },
  });

  const author = list.author;
  const games = list.games;
  if (author == null) throw new Error("no author");
  return (
    <main className="min-h-fit">
      <Backdrop />
      <div className="flex flex-row max-w-3xl lg:max-w-screen-lg mx-auto *:z-10 h-full bg-background py-8 gap-8">
        <div
          id="List Panel"
          className="flex flex-col divide-y min-h-fit h-full basis-3/4"
        >
          <div id="Author Info" className="flex flex-row gap-2 py-2">
            {author && author.image && (
              <Link href={`/user/${author.slug}`} className="rounded-full">
                <Image
                  src={author.image}
                  alt="Profile Picture"
                  className="profile-badge"
                  width={24}
                  height={24}
                />
              </Link>
            )}
            <span className="text-sm flex flex-row gap-1 place-items-center">
              List by
              <h4 className="text-header-light-grey font-semibold hover:text-cyan-400 ">
                {/** User Name */}
                <Link href={`/user/${author.slug}`} className="">
                  {author.name}
                </Link>
              </h4>
            </span>
          </div>
          <div className="flex flex-col gap-4 py-3">
            <h1 className="font-sans font-medium text-2xl"> {list.name} </h1>
            <p> {list.description} </p>
            <div className="grid grid-cols-5 grid-flow-row gap-2 place-items-center py-2 pb-12 min-h-fit">
              {games.map((entry, index) => (
                <div
                  key={entry.game.slug}
                  className="h-full w-full min-h-fit py-2"
                >
                  <Link key={entry.game.slug} href={`/game/${entry.game.slug}`}>
                    <BoxArt game={entry.game} size="big"></BoxArt>
                  </Link>
                  <div>
                    {list.ranked && (
                      <div className="text-center h-full text-neutral-50 text-sm py-1">
                        {" "}
                        {index + 1}{" "}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>{" "}
            <CommentSection replyingTo={list} type="list" />
          </div>
        </div>
        <InteractionPanelWrapper>
          {}{" "}
          <ListLikeButton list={list} initialState={list.likedBy.length > 0} />
          {author.email == email && (
            <Link href={`/list/${slug}/edit`}>
              {" "}
              Edit or delete this list...{" "}
            </Link>
          )}
          <div>Share</div>
        </InteractionPanelWrapper>
      </div>
    </main>
  );
};

export default ListPage;
