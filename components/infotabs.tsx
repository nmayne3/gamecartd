"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Game, Prisma } from "@prisma/client";
import {
  Descriptor,
  Localizations,
  Company,
  InvolvedCompany,
  Platform,
} from "@/igdb/interfaces";

// TODO: Change from Game interface to prisma Game
type GameWithEverything = Prisma.GameGetPayload<{
  include: {
    developers: true | false;
    publishers: true | false;
    platforms: true | false;
    genres: true | false;
    user_ratings: true | false;
    user_reviews:
      | { include: { _count: { select: { likedBy: true } } } }
      | false;
    artworks: true | false;
    screenshots: true | false;
    GameMode: true | false;
  };
}>;

/**
 *
 * @param param0 Game with the following includes: @var platforms @var GameMode @var genres @var developers @var publishers
 * @returns
 */
export const InfoTabs = ({ game }: { game: GameWithEverything }) => {
  return (
    <Tabs
      variant="underlined"
      color="success"
      aria-label="Tabs variants"
      className=" w-full"
      classNames={{
        tabList: "border-b gap-4 p-0 m-0 w-full border-secondary h-fit",
        tab: "uppercase justify-start p-0 py-0.5 m-0 w-fit h-fit ",
        tabContent:
          "text-accent-green-alt group-data-[selected=true]:text-white p-0",
        cursor: "w-full p-0 bg-white",
      }}
    >
      <Tab key="details" title="Details">
        {/** Number of Players / Multiplayer Modes / Supported Languages / Game Modes / Series / Franchises */}
        <DetailList
          sectionTitle="Platforms"
          descriptors={game.platforms.map((platform) => platform.name)}
        />
        <DetailList
          sectionTitle="Game Modes"
          descriptors={game.GameMode.map((mode) => mode.name)}
        />
        {game.alternate_names && (
          <DetailList
            sectionTitle="Alternate Titles"
            descriptors={game.alternate_names.reverse()}
          />
        )}
      </Tab>
      <Tab key="genres" title="Genres">
        <div className="flex flex-col">
          {" "}
          <DetailList
            sectionTitle={"Genres"}
            descriptors={game.genres.map((genre) => genre.name)}
          />
          <DetailList sectionTitle="Sub-Genres" descriptors={game.tags} />
          <DetailList sectionTitle="Tags" descriptors={game.keywords} />
        </div>
      </Tab>
      <Tab key="teams" title="Teams">
        <div className="flex flex-col">
          <DetailList
            sectionTitle="Developers"
            descriptors={game.developers.map((developer) => developer.name)}
          />
          <DetailList
            sectionTitle="Publishers"
            descriptors={game.developers.map((publisher) => publisher.name)}
          />
        </div>
      </Tab>
      <Tab key="releases" title="Releases" />
    </Tabs>
  );
};

const DetailList = ({
  sectionTitle,
  descriptors,
}: {
  sectionTitle: string;
  descriptors: Array<string>;
}) => {
  if (!descriptors || descriptors.length < 1) return;
  return (
    <div className="flex flex-row w-full gap-2 items-baseline baseline py-2 text-xs">
      {/** descriptor type */}
      <div className="flex flex-row basis-2/5 gap-1 uppercase text-secondary max-w-full ">
        {" "}
        <div className="flex-shrink-0">{sectionTitle}</div>
        <div className="w-full border-dotted border-0 border-secondary border-b mb-0.5">
          {" "}
        </div>
      </div>
      <div className="basis-3/5 flex flex-row gap-1 flex-wrap capitalize">
        {" "}
        {descriptors.map(
          (descriptor, index) =>
            descriptor && (
              <div
                key={index}
                className="bg-secondary/75 rounded-sm-md pt-[0.06rem] shadow-inner whitespace-nowrap overflow-hidden hover:brightness-125"
              >
                <div className="p-1 bg-dark-grey rounded-sm-md">
                  {" "}
                  {descriptor}{" "}
                </div>
              </div>
            )
        )}{" "}
      </div>
    </div>
  );
};
