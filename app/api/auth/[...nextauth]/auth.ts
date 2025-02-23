import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";

if (
  process.env.GITHUB_ID === undefined ||
  process.env.GITHUB_SECRET === undefined
) {
  throw new Error("Invalid Github env vars");
}

if (
  process.env.DISCORD_ID === undefined ||
  process.env.DISCORD_SECRET === undefined
) {
  throw new Error("Invalid Discord env vars");
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
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        })
      )
        return true;
      if (user.email) {
        await prisma.user.create({
          data: {
            id: user.id,
            slug: user.id,
            email: user.email,
            name: user.name ? user.name : "",
            image: user.image,
          },
        });
      }

      return true;
    },
    async session({ session }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (!session.user?.email) return session;
      const user = await prisma.user.findUnique({
        where: {
          email: session.user?.email,
        },
      });
      session.user.id = user?.id;
      session.user.slug = user?.slug;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};

export const getSession = () => getServerSession(options);
