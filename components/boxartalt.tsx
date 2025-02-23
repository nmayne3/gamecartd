"use client";

import Image from "next/image";
import { Game } from "@prisma/client";
import { useState } from "react";

/**
 *
 *  Responsible for rendering a game's box art and nothing else.
 *  If no game or cover is available, it will render a dark grey placeholder.
 *
 * @param game game to be rendered. If undefined, it will render a dark grey placeholder
 * @param size  Determines requested image size from igdb database
 * @param width Width of the image
 * @param height  Height of the image
 * @param hoverEffect Enable or disable the outline hover effect (defaults to true)
 *
 * @returns React Component for rendering a game's boxart
 *
 */

const BoxArt = ({
  game,
  children,
  size,
  width,
  height,
  className,
  hoverEffect = true,
}: {
  game?: Game;
  children?: React.ReactNode;
  size?: "big" | "small" | "big_2x" | "small_2x";
  width?: number;
  height?: number;
  className?: string;
  hoverEffect?: boolean;
}) => {
  size = size ? size : "big_2x";

  // Track load state for rendering onLoad fade in
  const [loaded, setLoaded] = useState(false);

  // Check if we're using a placeholder for bg image
  const placeholder = game ? (game.cover ? false : true) : true;
  return (
    <div
      className={`group relative rounded-sm-md shadow-xl smooth-transition bg-dark-grey outline outline-0.5 outline-secondary h-full w-full ${
        hoverEffect
          ? "hover:-outline-offset-2 hover:outline-2 hover:outline-accent-green"
          : ""
      }`}
    >
      {game && game.cover && (
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_cover_${size}/${game.cover}.jpg`}
          width={width ? width : 264}
          height={height ? height : 374}
          alt="Box Art"
          className={`peer rounded-sm-md h-full w-full object-cover ${className}`}
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          onLoad={(e) => setLoaded(true)}
          draggable={false}
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)",
          }}
        />
      )}
      {placeholder && (
        <div className="text-xxs text-center h-full w-full pt-4 aspect-[3/4]">
          {game && `${game.name}`}
        </div>
      )}

      {children}
    </div>
  );
};

export default BoxArt;
