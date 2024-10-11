// in app/api/auth/[...nextauth]/route.ts
import { options } from "@/app/api/auth/[...nextauth]/auth";
import NextAuth from "next-auth";

const handler = NextAuth(options);

export { handler as GET, handler as POST };
