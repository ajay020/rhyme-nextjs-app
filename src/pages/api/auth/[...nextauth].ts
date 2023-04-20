import NextAuth, {
  Account,
  AuthOptions,
  Profile,
  Session,
  User,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/util/mongodb";

import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/util/db";
import { compare } from "bcryptjs";
import clientPromise from "@/util/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jhon@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const { email, password } = credentials as {
          email: string;

          password: string;
        };

        try {
          const { db } = await connectToDatabase();

          const user = await db.collection("users").findOne({ email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (password) {
            const isValid = await compare(password, user.password);

            if (!isValid) {
              throw new Error("Incorrect password");
            }
          }

          // Any object returned will be saved in `user` property of the JWT

          return { id: user._id, ...user } as any;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   // Specify the redirect URI for successful authentication
    //   console.log({ user });
    //   return `${process.env.NEXT_PUBLIC_APP_URL}`;
    // },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.

      if (token.sub && token.name) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  pages: {
    error: "/api/auth/signin",
  },
};

export default NextAuth(authOptions);
