"use client";

import { Picture } from "@/igdb/interfaces";
import Image from "next/image";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const Backdrop = ({ bg, name }: { bg: Picture; name: string }) => {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const isInView = useInView(ref, { amount: "all", once: true });

  return (
    <Image
      src={`https://images.igdb.com/igdb/image/upload/t_1080p/${bg.image_id}.jpg`}
      width={bg.width}
      height={bg.height}
      alt={name}
      className="z-0 object-cover aspect-video w-[1200px]"
      ref={ref}
      onLoad={() => setLoaded((loaded) => true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.2s cubic-bezier(0.3, 0.2, 0.2, 0.8)",
      }}
    />
  );
};

export default Backdrop;
