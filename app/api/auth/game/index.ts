import { getSession } from "../[...nextauth]/auth";
import prisma from "@/lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: any, res: any) {
  const { title, content } = req.body;

  const session = await getSession();
  if (!session?.user?.email) {
    return;
  }
  const result = await prisma?.post?.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
