import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";

if (
  process.env.GITHUB_ID === undefined ||
  process.env.GITHUB_SECRET === undefined ||
  process.env.DISCORD_ID === undefined ||
  process.env.DISCORD_SECRET === undefined
) {
  throw new Error("Invalid env vars");
}

export const options: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};

export const getSession = () => getServerSession(options);
