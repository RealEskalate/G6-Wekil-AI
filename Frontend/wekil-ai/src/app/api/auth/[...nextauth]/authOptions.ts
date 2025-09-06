import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
  account_type?: string;
  rememberMe?: boolean;
  error?: string;
  accessToken?: string;
  accessTokenExpires?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function refreshBackendSession(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("Refresh failed:", res.status, await res.text());
      return { ...token, };
    }
    return { ...token,
      accessToken: res.headers.get("Authorization")?.replace("Bearer ", ""),
      accessTokenExpires: Date.now() + 10 * 60 * 1000,
      error: undefined
    };
  } catch (err) {
    console.error("Error refreshing session:", err);
    return { ...token, error: "RefreshTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  async profile(profile) {
    // Send Google profile to your backend for registration/login
    const res = await fetch(`${API_URL}/auth/nextjs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      throw new Error("Google login failed");
    }

    const data = await res.json();
    const account_type = data?.data?.account_type;
    const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");


    return {
      id: profile.sub, 
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      account_type,
      accessToken,
      accessTokenExpires: Date.now() + 10 * 60 * 1000,
    } as User & { account_type?: string; accessToken?: string; accessTokenExpires?: number};
  },
    }),


    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
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
        const account_type = data?.data?.account_type;
        const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");

        if (!accessToken) throw new Error("No access token returned");

        return {
          account_type,
          rememberMe: credentials?.rememberMe === "true",
          accessToken: accessToken,
          
        } as User & {
          account_type?: string;
          rememberMe?: boolean;
          accessToken: string;
        };
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
      user?: User & {
        account_type?: string;
        rememberMe?: boolean;
        accessToken?: string;
      };
    }) {
      // On login
      if (user) {
        return {
          ...token,
          account_type: user.account_type,
          rememberMe: user.rememberMe,
          accessToken: user.accessToken,
          accessTokenExpires: Date.now() + 10 * 60 * 1000,
          error: undefined,
        };
      }

      if (token.rememberMe && Date.now() > (token.accessTokenExpires ?? 0)) {
        return await refreshBackendSession(token);
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          account_type: token.account_type,
          rememberMe: token.rememberMe,
          accessToken: token.accessToken,
          error: token.error,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
