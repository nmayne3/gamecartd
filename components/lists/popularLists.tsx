import prisma from "@/lib/prisma";
import { ListBlock, PlaceholderList } from "./displaylist";

const PopularLists = async () => {
  const popularLists = await prisma.list.findMany({
    include: {
      author: true,
      games: { include: { game: true } },
      _count: { select: { likedBy: true } },
    },
    orderBy: { likedBy: { _count: "desc" } },
    take: 3,
  });
  return (
    <div className="w-full h-fit">
      {popularLists.map((list) => (
        <ListBlock key={list.slug} id={list.slug} list={list} />
      ))}{" "}
    </div>
  );
};

export default PopularLists;
