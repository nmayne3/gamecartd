import Image, { StaticImageData } from "next/image";
import { Game } from "@/igdb/interfaces";

const BoxArt = ({
  game,
  children,
}: {
  game: Game;
  children?: React.ReactNode;
}) => {
  return (
    <div className="group relative rounded-sm-md shadow-xl smooth-transition outline outline-0.5 outline-secondary h-full object-contain hover:-outline-offset-2 hover:outline-2 hover:outline-accent-green">
      <Image
        src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`}
        width={game.cover.width}
        height={game.cover.height}
        alt="Movie Poster"
        className="peer rounded-sm-md h-full w-auto"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      />
      <div className="absolute top-1/4 left-1/4 rounded-sm opacity-0 group-hover:opacity-100 smooth-transition">
        {" "}
        {children}
      </div>
    </div>
  );
};

export default BoxArt;
