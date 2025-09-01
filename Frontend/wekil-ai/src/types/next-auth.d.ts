import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    account_type?: string;
  }
  
  interface Session {
    user: {
      accessToken?: string;
      account_type?: string;
      error?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    account_type?: string;
    error?: string;
  }
}