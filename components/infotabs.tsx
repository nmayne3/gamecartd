"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Game, Descriptor, Localizations, Company } from "@/igdb/interfaces";

export const InfoTabs = ({ game }: { game: Game }) => {
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
        <DetailList sectionTitle="Platforms" descriptors={game.platforms} />
        <DetailList sectionTitle="Game Modes" descriptors={game.game_modes} />
        <RegionList
          sectionTitle="Localizations"
          localizations={game.game_localizations}
        />
        {game.alternative_names && (
          <DetailList
            sectionTitle="Alternate Titles"
            descriptors={game.alternative_names
              .concat(game.game_localizations)
              .reverse()}
          />
        )}
      </Tab>
      <Tab key="genres" title="Genres">
        <div className="flex flex-col">
          {" "}
          <DetailList sectionTitle={"Genres"} descriptors={game.genres} />
          <DetailList sectionTitle="Sub-Genres" descriptors={game.themes} />
          <DetailList sectionTitle="Tags" descriptors={game.keywords} />
        </div>
      </Tab>
      <Tab key="teams" title="Teams">
        <CompaniesTab companies={game.involved_companies} />
      </Tab>
      <Tab key="releases" title="Releases" />
    </Tabs>
  );
};

const RegionList = ({
  sectionTitle,
  localizations,
}: {
  sectionTitle: string;
  localizations: Array<Localizations>;
}) => {
  if (!localizations) return;
  const descriptors = [];
  for (const localization of localizations) {
    descriptors.push(localization.region);
  }
  return DetailList({ sectionTitle, descriptors });
};

const DetailList = ({
  sectionTitle,
  descriptors,
}: {
  sectionTitle: string;
  descriptors: Array<Descriptor>;
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
          (descriptor: Descriptor) =>
            descriptor && (
              <div
                key={descriptor.id}
                className="bg-secondary/75 rounded-sm-md pt-[0.06rem] shadow-inner whitespace-nowrap overflow-hidden hover:brightness-125"
              >
                <div className="p-1 bg-dark-grey rounded-sm-md">
                  {" "}
                  {descriptor.name}{" "}
                </div>
              </div>
            )
        )}{" "}
      </div>
    </div>
  );
};

const CompaniesTab = ({ companies }: { companies: Array<Company> }) => {
  const developers = [];
  const publishers = [];
  const porters = [];
  const supporting = [];

  if (!companies) {
    return;
  }

  for (const company of companies) {
    if (company.porting) {
      porters.push(company.company);
    } else if (company.supporting) {
      supporting.push(company.company);
    } else if (company.developer) {
      developers.push(company.company);
    }
    if (company.publisher) {
      publishers.push(company.company);
    }
  }
  return (
    <div className="flex flex-col">
      <DetailList
        sectionTitle="Developers"
        descriptors={developers}
      ></DetailList>
      <DetailList
        sectionTitle="Publishers"
        descriptors={publishers}
      ></DetailList>
      <DetailList
        sectionTitle="Supporting Developers"
        descriptors={supporting}
      ></DetailList>
      <DetailList
        sectionTitle="Port Developers"
        descriptors={porters}
      ></DetailList>
    </div>
  );
};
