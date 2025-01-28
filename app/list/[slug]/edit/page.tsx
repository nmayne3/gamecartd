import { getSession } from "@/app/api/auth/[...nextauth]/auth";
import EditListForm from "@/components/lists/editList";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ListWithGames = Prisma.ListGetPayload<{
  include: { games: { include: { game: true } } };
}>;

const EditList = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const session = await getSession();
  const email = session?.user.email;
  const list = await prisma.list.findUniqueOrThrow({
    where: { slug: slug },
    include: {
      author: true,
      games: { include: { game: true } },
    },
  });
  return (
    <main>
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />
      <div className="bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x w-full h-full">
        <section className="max-w-screen-lg mx-auto py-8">
          <h1 className="font-sans font-light text-trimary w-full border-b pb-1">
            {" "}
            {`Edit List`}{" "}
          </h1>
          <EditListForm list={list} />
        </section>
      </div>
    </main>
  );
};

export default EditList;
