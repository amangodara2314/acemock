import { createUserInDB, findUserByEmail } from "@/lib/actions";
import { connectToDatabase } from "@/lib/database";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        await connectToDatabase();
        const existingUser = await findUserByEmail(profile.email);
        if (!existingUser) {
          const response = await createUserInDB(profile);
          console.log(response);
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      const redirectUrl = new URL("/dashboard", baseUrl).href;
      return redirectUrl;
    },
    async session({ session, token }) {
      if (token.email) {
        try {
          await connectToDatabase();
          const dbUser = await findUserByEmail(token.email);
          if (dbUser) {
            session.user = {
              ...session.user,
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              image: dbUser.image || session.user.image,
            };
            console.log(session);
          }
        } catch (error) {
          console.log("Error fetching user from database:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log(user);
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

const handler = (req, res) => NextAuth(req, res, authOptions);

export const GET = handler;
export const POST = handler;
