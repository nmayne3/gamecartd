import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import BoxArt from "@/components/boxartalt";

const ListPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const list = await prisma.list.findUniqueOrThrow({
    where: { slug: slug },
    include: { author: true, games: { include: { game: true } } },
  });
  const author = list.author;
  const games = list.games;
  if (author == null) throw new Error("no author");

  return (
    <main className="min-h-fit">
      <div id="Header Filler Block" className="w-full h-12 bg-primary" />
      <div className="flex flex-row max-w-3xl lg:max-w-screen-lg mx-auto divide-x">
        <div id="List Panel" className="flex flex-col gap-2">
          <div id="Author Info" className="flex flex-row">
            {author && author.image && (
              <Link href={`/user/${author.slug}`} className="rounded-full">
                <Image
                  src={author.image}
                  alt="Profile Picture"
                  className="w-10 h-10 border-opacity-100 border-white outline-white/10 -outline-offset-1  outline-1 outline rounded-full aspect-square my-4"
                  width={32}
                  height={32}
                />
              </Link>
            )}
            <span className="text-xs flex flex-row gap-1 place-items-center">
              Review by
              <h4 className="text-header-light-grey font-medium hover:text-cyan-400">
                {/** User Name */}
                <Link href={`/user/${author.slug}`} className="">
                  {author.name}
                </Link>
              </h4>
            </span>
          </div>
          <div>
            <h1> {list.name} </h1>
            <p> {list.description} </p>
            <div>
              <div className="grid grid-cols-5 grid-flow-row gap-2 place-items-center py-2">
                {games.map((entry, index) => (
                  <div key={entry.game.slug} className="h-full w-full ">
                    <Link
                      key={entry.game.slug}
                      href={`/game/${entry.game.slug}`}
                    >
                      <BoxArt game={entry.game} size="big"></BoxArt>
                    </Link>
                    {list.ranked && (
                      <div className="text-center"> {index + 1} </div>
                    )}
                  </div>
                ))}
              </div>{" "}
            </div>
            <div></div>
          </div>
        </div>
        <aside id="Interaction Panel"></aside>
      </div>
    </main>
  );
};

export default ListPage;
