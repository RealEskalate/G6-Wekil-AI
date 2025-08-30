import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
  id?: string;
  rememberMe?: boolean;
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
}

// Refresh token function (can call backend API if needed)
async function refreshBackendToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return {
      ...token,
      accessToken: data.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
      refreshToken: data.refreshToken ?? token.refreshToken,
    };
  } catch (err) {
    console.error("Error refreshing backend token", err);
    return { ...token, error: "RefreshTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        
        // Call your backend API to authenticate user
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Invalid email or password");
        }

        // Return user object to NextAuth
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          rememberMe: Boolean(credentials.rememberMe),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/",
    error: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },

  callbacks: {
    async jwt({ token, user }: { token: ExtendedJWT; user?: User & { rememberMe?: boolean; accessToken?: string; refreshToken?: string } }) {
      if (user) {
        token.id = user.id;
        token.rememberMe = user.rememberMe;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }

      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires && token.refreshToken) {
        return refreshBackendToken(token);
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          rememberMe: token.rememberMe,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          error: token.error,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
