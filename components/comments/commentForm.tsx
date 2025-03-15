"use client";

import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { List, Prisma, Review } from "@prisma/client";
import { createComment } from "@/app/api/comments/actions";
import { toast } from "@/hooks/use-toast";
import { Dispatch, SetStateAction } from "react";
import { Comment } from "@prisma/client";
import SignInDialog from "../auth/signInDialog";

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: true;
  };
}>;

const CommentForm = ({
  type,
  replyingTo,
  className,
  setComments,
}: {
  type: "list" | "review";
  replyingTo: List | Review;
  setComments: Dispatch<SetStateAction<CommentWithAuthor[]>>;
  className?: string;
}) => {
  const session = useSession();
  const formSchema = z.object({
    comment: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const authorId = session.data?.user.id;
    if (!authorId) {
      throw new Error("AuthorId is undefined...");
    }
    const comment = await createComment(
      data.comment,
      replyingTo,
      type,
      authorId
    );
    if (comment) {
      toast({
        title: "Comment posted ✅",
      });
      setComments((a) => [...a, comment]);
      form.reset();
    } else {
      toast({
        title: "Error: ❌",
        description: "Failed to post comment",
      });
    }
  };

  if (session.data?.user.name)
    return (
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`gap-6 py-4 place-items-end ${className}`}
      >
        <Textarea
          className=" max-w-lg"
          placeholder={`Reply as ${session.data.user.name}...`}
          {...form.register("comment")}
          spellCheck={false}
        />
        <button className="button !text-white !bg-accent-green !my-6">
          {" "}
          POST{" "}
        </button>
      </form>
    );
  return (
    <div className="py-4 text-xs text-menu-primary border-t-1">
      {" "}
      Please{" "}
      <SignInDialog className="!lowercase !font-normal hover:text-blue-400" />{" "}
      to reply.{" "}
    </div>
  );
};

export default CommentForm;
