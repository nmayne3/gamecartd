"use client";

import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import Searchbar from "./searchgame";
import { Game } from "@prisma/client";
import BoxArt from "../boxartalt";
import { MouseEvent, useRef, useState } from "react";
import { GetGameCombo } from "@/app/api/games/actions";
import AddGame from "./addGame";
import { createList } from "@/app/api/lists/actions";
import { register } from "module";

const CHECKMARK = "✅";
const MARK = "✕";

const NewListForm = () => {
  const FormSchema = z.object({
    name: z.string().max(100, "Review must be no more than 100 characters"),
    description: z
      .string()
      .max(240, "Review must be no more than 240 characters")
      .optional(),
    games: z
      .object({
        name: z.string(),
        summary: z.string().optional(),
        id: z.string(),
        slug: z.string(),
        cover: z.string().optional(),
        first_release_date: z.date(),
        tags: z.string().array(),
      })
      .array()
      .optional(),
    ranked: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("");
    const game_ids = refGames.current?.map((game) => game.id);
    const review = await createList(
      data.name,
      data.description,
      game_ids,
      data.ranked
    );
    if (review) {
      toast({
        title: "List " + data.name + "  Created " + CHECKMARK,
      });
    } else {
      toast({
        title: "Error: ❌",
        description: "Failed to create List",
      });
    }
  };

  const refGames = useRef<Game[]>();
  const [ranked, setRanked] = useState(false);

  return (
    <div>
      <form className={``} onSubmit={form.handleSubmit(onSubmit)}>
        <section
          id="Text Inputs"
          className="flex flex-row w-full h-full gap-12 py-4"
        >
          <div className="basis-1/2 w-full flex flex-col gap-4">
            <label>
              Name
              <Input placeholder="" {...form.register("name")} />
            </label>
            <label>
              Tags
              <Input placeholder="e.g. wizards" />
            </label>

            <Controller
              control={form.control}
              name="ranked"
              render={({ field }) => (
                <div className="flex place-content-between">
                  <div className="inline-flex flex-row-reverse items-center gap-2 justify-end">
                    {" "}
                    <label className="peer"> Ranked list </label>
                    <Checkbox
                      className="peer-hover:bg-border"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onClick={() => {
                        setRanked(!ranked);
                      }}
                    />
                  </div>
                  <small className="font-sans">
                    {" "}
                    Show position for each game.{" "}
                  </small>
                </div>
              )}
            />
          </div>
          <div className="basis-1/2 w-full h-full">
            <label className="row-span-full col-start-2 row-start-1 row-end-2 min-h-full">
              Description
            </label>
            <Textarea
              className="h-full"
              placeholder=""
              {...form.register("description")}
            />
          </div>
        </section>
        <button
          type="submit"
          className="my-4 bg-accent-green border-t border-t-white/40 text-white py-1 px-3 rounded-sm text-sm font-semibold uppercase"
        >
          {" "}
          Save{" "}
        </button>
      </form>
      <AddGame
        refGames={refGames}
        ranked={ranked}
        {...form.register("games")}
      />
    </div>
  );
};

export default NewListForm;
