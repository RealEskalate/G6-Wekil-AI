import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  account_type?: string;
  rememberMe?: boolean;
  accessTokenExpires?: number;
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
    if (!accessToken) throw new Error("No access token returned from refresh");

    return {
      ...token,
      accessToken,   
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
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        const rememberMe = credentials?.rememberMe === "true";
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
          rememberMe,
        } as User & { accessToken: string; account_type?: string; rememberMe?: boolean };
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
    async jwt({
  token,
  user,
}: {
  token: ExtendedJWT; 
  user?: User & { accessToken?: string; account_type?: string; rememberMe?: boolean };
}) {
  
        if (user) {
          return {
            ...token,
            accessToken: user.accessToken,
            account_type: user.account_type,
            rememberMe: user.rememberMe,
            error: undefined,
          };
        }

        if (token.rememberMe) {
          token.accessTokenExpires = Date.now() + 60 * 60 * 24 * 30 * 1000; // 30 days
        }

        if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
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
          rememberMe: token.rememberMe,
          error: token.error,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
