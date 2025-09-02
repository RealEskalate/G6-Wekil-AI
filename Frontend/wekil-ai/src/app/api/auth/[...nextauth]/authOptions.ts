import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  account_type?: string;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function refreshBackendToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");
    const body = await res.json();
    const account_type = body?.data?.account_type;

    if (!accessToken) throw new Error("No access token returned from refresh");

    return {
      ...token,
      accessToken,
      account_type,
      error: undefined,
    };
  } catch (err) {
    console.error("Error refreshing token:", err);
    return { ...token, error: "RefreshTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) throw new Error("Invalid credentials");

        const data = await res.json();
        const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");
        const account_type = data?.data?.["account_ type"] || data?.data?.account_type;

        if (!accessToken) throw new Error("No access token returned");

        return {
          accessToken,
          account_type,
        } as User & { accessToken: string; account_type?: string };
      },
    }),
  ],

  pages: {
    signIn: "/",
    error: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },

  callbacks: {
    async jwt({ token, user }: { token: ExtendedJWT; user?: User & { accessToken?: string; account_type?: string } }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          account_type: user.account_type,
          error: undefined,
        };
      }

      if (token.accessTokenExpires && Date.now() > (token.accessTokenExpires as number)) {
        return refreshBackendToken(token);
      }


      return token;
    },

    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          account_type: token.account_type,
          error: token.error,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
