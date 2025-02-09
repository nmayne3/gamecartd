import prisma from "@/lib/prisma";
import { SectionHeader } from "@/components/section";
import PageButtons from "@/components/pagebutton";
import Link from "next/link";
import { ListGames } from "@/components/lists/displaylist";

// Page for browsing a user's created lists
const ListsPage = async ({ params }: { params: { slug: string } }) => {
  const user_slug = params.slug;

  // need to take first 5 games of list in order to display game
  const user = await prisma.user.findUniqueOrThrow({
    where: { slug: user_slug },
    include: {
      lists: { include: { games: { include: { game: true }, take: 5 } } },
    },
  });
  const lists = user.lists;
  console.log(lists);
  return (
    <main className="w-full">
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />
      <div className="bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x w-full h-full">
        <div className="flex flex-row w-full h-full max-w-screen-lg justify-self-center py-8 gap-8">
          <section className="h-full w-full flex flex-col basis-3/4 justify-self-center  divide-y divide-secondary ">
            {/** Header with Filter Menu */}
            <SectionHeader title="Lists"> </SectionHeader>
            {/** Table of Lists */}
            <div className="flex flex-col place-items-center divide-y">
              {lists.map((list) => (
                <div key={list.slug} className="w-full flex flex-row py-4">
                  <Link
                    key={list.slug}
                    href={`/list/${list.slug}`}
                    className="basis-1/3"
                  >
                    <ListGames
                      className="max-h-full"
                      games={list.games}
                    ></ListGames>
                  </Link>
                  <div className="px-4">
                    <Link
                      key={list.slug}
                      href={`/list/${list.slug}`}
                      className="basis-1/3"
                    >
                      <h2 className="text-xl font-semibold text-neutral-50">
                        {" "}
                        {list.name}{" "}
                      </h2>
                    </Link>
                    <small className="text-discrete-grey/85 font-light">
                      {" "}
                      {`${list.games.length} games`}{" "}
                    </small>
                    <p> {list.description} </p>
                  </div>
                </div>
              ))}
            </div>
            {/** Next / Previous Page Buttons */}
            <PageButtons />
          </section>
          {/** Side section */}
          <div className="rounded-sm bg-slate-600 mx-auto basis-1/4 w-full h-fit text-center py-3 text-header-light-grey/90 font-light text-xs ">
            <Link href={"/list/new"}>Start a new list...</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListsPage;
