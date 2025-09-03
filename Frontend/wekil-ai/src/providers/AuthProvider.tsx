"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/lib/redux/store";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SessionProvider>
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </SessionProvider>
    </div>
  );
}

export default Provider;
