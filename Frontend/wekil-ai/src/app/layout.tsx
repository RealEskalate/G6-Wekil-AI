import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Wekil AI - Create Informal Agreements in Seconds",
  description:
    "Wekil AI helps Ethiopian freelancers and small business owners generate clear, simple agreements using artificial intelligence.",
  keywords:
    "agreements, contracts, Ethiopia, freelancers, small business, AI, Amharic",
  authors: [{ name: "Wekil AI Team" }],
  openGraph: {
    title: "Wekil AI - Create Informal Agreements in Seconds",
    description:
      "Generate clear, simple agreements using AI designed for the Ethiopian market.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Provider>{children}</Provider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              border: "1px solid #713200",
              padding: "8px",
              color: "#713200",
            },
          }}
        />
      </body>
    </html>
  );
}
