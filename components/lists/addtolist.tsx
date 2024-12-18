"use client";

import { Game, List } from "@prisma/client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import Button from "../button";
import { GetUser, GetUserFromID } from "@/app/api/games/actions";
import { useSession } from "next-auth/react";

//** This is a pop-up window that appears on a game's page allowing users to quickly add a game to one of their created lists */

export const AddToListWindow = ({
  game,
  lists,
}: {
  game: Game;
  lists: Array<List>;
}) => {
  const [open, setOpen] = useState(false);

  const FormSchema = z.object({
    rating: z.number().optional(),
    review: z
      .string()
      .min(2, "Review must be at least 2 characters")
      .max(140, "Review must be no more than 140 characters"),
  });

  const session = useSession();
  const user_id = session.data?.user.id;

  const user = user_id ? GetUserFromID(user_id) : null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {};

  if (user)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger> Review </DialogTrigger>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="divide-y">
            <DialogHeader>
              <DialogTitle> {`Add '${game.name}' to lists `} </DialogTitle>
              <DialogDescription>{""}</DialogDescription>
            </DialogHeader>
            <div className="">{`+ New List...`}</div>
            <section id="created lists">
              {lists.map((list) => (
                <div className="w-full flex flex-row place-content-between">
                  {list.name}
                  {`# games`}
                </div>
              ))}
            </section>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className={""}
            >
              {" "}
              Submit{" "}
            </Button>
          </DialogContent>
        </form>
      </Dialog>
    );
  return <div />;
};
