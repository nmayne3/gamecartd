"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import Button from "./button";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { FaStar } from "react-icons/fa6";
import { Game } from "@prisma/client";
import { CreateReview, rateGame } from "@/app/api/games/actions";
import { startTransition, useOptimistic, useState } from "react";
import { getSession, useSession } from "next-auth/react";

const CHECKMARK = "✅";

const ReviewWindow = ({
  game,
  isRated,
  rating,
}: {
  game: Game;
  isRated: boolean;
  rating: number;
}) => {
  const [open, setOpen] = useState(false);
  const FormSchema = z.object({
    rating: z.number().optional(),
    review: z
      .string()
      .min(2, "Review must be at least 2 characters")
      .max(140, "Review must be no more than 140 characters"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const review = await CreateReview({
      content: data.review,
      gameId: game.id,
    });
    if (review) {
      toast({
        title: "Review Submitted! " + CHECKMARK,
      });
      setOpen(!open);
    } else {
      toast({
        title: "Error: ❌",
        description: "Failed to submit Review",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger> Review </DialogTrigger>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Rating </DialogTitle>
            <DialogDescription>
              {"Leave a rating"}
              <StarRating
                game={game}
                initialRating={rating}
                initialState={isRated}
              />
            </DialogDescription>
            <DialogTitle> Review </DialogTitle>

            <DialogDescription>
              {" "}
              Share your thoughts about the game{" "}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Write a review..."
            {...form.register("review")}
          />
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
};

export default ReviewWindow;

export const StarRating = ({
  game,
  initialState,
  initialRating,
}: {
  game: Game;
  initialState: boolean;
  initialRating: number;
}) => {
  const [rated, setRated] = useState(initialState);
  const [rating, setRating] = useState(initialRating);
  const [optimsticRated, setOptimisticRated] = useOptimistic(rated);
  const [optimisticRating, setOptimisticRating] = useOptimistic(rating);

  const StarButton = ({ game, value }: { game: Game; value: number }) => {
    const session = useSession();
    const user_id = session.data?.user.id;
    if (!user_id) {
      throw "No user id what in the hell boss";
    }
    const submitRating = async () => {
      console.log(value);
      startTransition(() => {
        setOptimisticRated(!rated);
        setOptimisticRating(value);
      });

      const rating = await rateGame(user_id, game.id, value);
      setRated(!rated);
      setRating(value);
    };
    return (
      <div className="peer peer-hover:*:fill-cyan-400">
        {" "}
        <FaStar
          onClick={async () => await submitRating()}
          className={`${
            value <= optimisticRating ? "fill-accent-green" : ""
          } peer-hover:fill-cyan-400 hover:fill-cyan-400`}
        />{" "}
      </div>
    );
  };

  return (
    <div className="flex flex-row-reverse place-self-start ">
      {" "}
      <StarButton game={game} value={5} />
      <StarButton game={game} value={4} />
      <StarButton game={game} value={3} />
      <StarButton game={game} value={2} />
      <StarButton game={game} value={1} />
    </div>
  );
};
