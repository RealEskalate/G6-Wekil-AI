import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string;
    account_type?: string;
    rememberMe?: boolean;
  }

  interface Session {
    user: {
      accessToken?: string;
      account_type?: string;
      rememberMe?: boolean;
      error?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    account_type?: string;
    rememberMe?: boolean;
    error?: string;
    accessTokenExpires?: number;
  }
}
