import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuid } from "uuid";
import { encode } from "next-auth/jwt";
import bcrypt from "bcrypt";

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
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "gamelover@email.com",
        },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!user) {
          // User not found, return null
          console.log("ERROR: User not found");
          return null;
        }
        if (user.password == null) {
          // User has no assigned password, return null
          console.log("Error: User has no set password");
          return null;
        }
        if (credentials) {
          if (await bcrypt.compare(credentials?.password, user.password)) {
            // Passwords match, return user
            console.log("user goated");
            return user;
          }
        }
        return null;
      },
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
      ) {
        console.log("user found");
        return true;
      }
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
        console.log("user created");

        return true;
      }
      if (credentials) {
        console.log("We are calling back now");
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
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
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await prisma.session.create({
          data: {
            sessionToken: sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return encode(params);
    },
  },
};

export const getSession = () => getServerSession(options);
