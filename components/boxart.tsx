"use client";

import Image, { StaticImageData } from "next/image";
import { Game } from "@/igdb/interfaces";
import { useState } from "react";

const BoxArt = ({
  game,
  children,
  size,
  width,
  height,
}: {
  game: Game;
  children?: React.ReactNode;
  size?: string;
  width?: number;
  height?: number;
}) => {
  size = size ? size : "big_2x";
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="group relative rounded-sm-md shadow-xl smooth-transition  outline outline-0.5 outline-secondary h-full w-full hover:-outline-offset-2 hover:outline-2 hover:outline-accent-green">
      {game.cover && (
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_cover_${size}/${game.cover.image_id}.jpg`}
          width={width ? width : game.cover.width}
          height={height ? height : game.cover.height}
          alt="Movie Poster"
          className="peer rounded-sm-md h-full w-full object-cover"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          onLoad={(e) => setLoaded(true)}
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)",
          }}
        />
      )}
      {!game.cover && (
        <div className="text-xxs text-center h-full w-full pt-4 aspect-[3/4]">
          {game.name}
        </div>
      )}

      <div className="absolute top-1/4 left-1/4 rounded-sm opacity-0 group-hover:opacity-100 smooth-transition">
        {" "}
        {children}
      </div>
    </div>
  );
};

export default BoxArt;
