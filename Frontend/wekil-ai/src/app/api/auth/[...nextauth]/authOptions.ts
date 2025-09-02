import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode"; 
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, Session, User } from "next-auth";

interface ExtendedJWT extends JWT {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
  account_type?: string;
}

interface DecodedToken {
  id: string;
  email: string;
  is_verified: boolean;
  account_type: string;
  token_type: string;
  exp: number;
  iat: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function refreshBackendToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    console.log("🔄 Attempting to refresh token...");
    
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include", // Crucial for sending cookies
    });

    console.log("📊 Refresh response status:", res.status);
    console.log("📋 Refresh response headers:", Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Refresh failed:", errorText);
      throw new Error(`Failed to refresh token: ${res.status} ${errorText}`);
    }

    let accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!accessToken) {
      // Check if token is in response body as fallback
      try {
        const responseData = await res.json();
        const bodyToken = responseData.accessToken || responseData.token;
        if (bodyToken) {
          console.log("✅ Got access token from response body");
          accessToken = bodyToken;
        }
      } catch (parseError) {
        console.error("❌ Failed to parse response body:", parseError);
      }
    }

    if (!accessToken) {
      throw new Error("No access token returned from refresh");
    }

    console.log("✅ Token refreshed successfully");
    
    // Decode the new token to get actual expiration time
    let accessTokenExpires: number;
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      accessTokenExpires = decoded.exp * 1000; // Convert to milliseconds
      console.log("⏰ New token expires at:", new Date(accessTokenExpires));
    } catch (decodeError) {
        console.log(decodeError)
      console.error("⚠️ Failed to decode new token, using default expiration");
      accessTokenExpires = Date.now() + 60 * 60 * 1000; // Fallback: 1 hour
    }

    return {
      ...token,
      accessToken,
      accessTokenExpires,
      error: undefined, // Clear any previous error
    };
  } catch (err) {
    console.error("❌ Error refreshing token", err);
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

        console.log("🔐 Attempting login for:", credentials.email);

        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies for the login request
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Login failed:", text);
          throw new Error("Invalid credentials");
        }

        const accessToken = res.headers.get("Authorization")?.replace("Bearer ", "");
        if (!accessToken) throw new Error("No access token returned");

        console.log("✅ Login successful, access token received");

        let account_type: string | undefined;
        let email: string | undefined;
        let id: string | undefined;
        
        try {
          const decoded = jwtDecode<DecodedToken>(accessToken);
          account_type = decoded.account_type;
          email = decoded.email;
          id = decoded.id;
          console.log("✅ Decoded token successfully:", { account_type, email, id });
        } catch (err) {
          console.error("❌ Failed to decode token", err);
        }

        return {
          id: id || credentials.email,
          email: email || credentials.email,
          name: credentials.email,
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
      console.log("🔄 JWT callback - user:", user);
      console.log("🔄 JWT callback - token before:", token);
      
      // Initial login - set token from user
      if (user) {
        console.log("✅ Setting token from user:", { 
          accessToken: user.accessToken, 
          account_type: user.account_type 
        });
        
        // Decode the token to get actual expiration time
        let accessTokenExpires: number;
        try {
          const decoded = jwtDecode<DecodedToken>(user.accessToken || '');
          accessTokenExpires = decoded.exp * 1000;
          console.log("⏰ Token expires at:", new Date(accessTokenExpires));
        } catch (decodeError) {
            console.log(decodeError)
          console.error("⚠️ Failed to decode token, using default expiration");
          accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour fallback
        }

        return {
          ...token,
          accessToken: user.accessToken,
          account_type: user.account_type,
          accessTokenExpires,
          error: undefined, // Clear any errors on new login
        };
      }

      // Check if token is expired and try to refresh
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        console.log("⏰ Token expired, attempting refresh...");
        return refreshBackendToken(token);
      }

      console.log("🔄 JWT callback - token after:", token);
      return token;
    },

    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      console.log("🔐 Token in session callback:", { 
        accessToken: token.accessToken ? "✅ Present" : "❌ Missing",
        account_type: token.account_type,
        error: token.error 
      });
      
      console.log("🔐 Session before merge:", session);
      
      const mergedSession = {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          account_type: token.account_type,
          error: token.error,
        },
      };
      
      console.log("✅ Session after merge:", mergedSession);
      return mergedSession;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};