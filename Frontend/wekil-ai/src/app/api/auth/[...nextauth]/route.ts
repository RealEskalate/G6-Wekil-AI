import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

async function refreshBackendToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "") || "";

    return {
      ...token,
      accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    };
  } catch (err) {
    console.error("Error refreshing token", err);
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
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Login failed:", text);
          throw new Error("Invalid credentials");
        }

        const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");
        if (!accessToken) throw new Error("No access token returned");

        return {
          name: credentials.email, 
          accessToken,
        } as User & { accessToken: string };
      },
    }),
  ],

  pages: {
    signIn: "/",
    error: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  callbacks: {
    async jwt({ token, user }: { token: ExtendedJWT; user?: User & { accessToken?: string } }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      }

      // Refresh token if expired
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
          error: token.error,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
