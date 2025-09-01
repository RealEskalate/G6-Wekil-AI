"use client";

import Link from "next/link";
import { ArrowLeft, Home, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gray-200 text-black">
      {/* Decorative blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gray-300 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gray-400 blur-3xl"
      />

      <main className="relative mx-auto flex min-h-[100dvh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-400 bg-gray-100 px-3 py-1 text-xs font-medium text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Oops — we couldn’t find that page
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-7xl font-extrabold tracking-tight md:text-8xl"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-xl text-balance text-lg"
        >
          The page you’re looking for either moved, never existed, or is hiding
          from us. Try heading back home or reach out and we’ll help you find
          it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-500 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:shadow md:text-base"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-500 bg-gray-100 px-4 py-2 text-sm font-medium text-black backdrop-blur transition hover:bg-white md:text-base"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Link>
        </motion.div>

        {/* Optional: helpful links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid w-full gap-3 sm:grid-cols-2"
        >
          <a
            href="/search"
            className="group rounded-2xl border border-gray-500 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-semibold text-black">Try searching</p>
            <p className="mt-1 text-sm text-black/70">
              Use the site search to look for pages, posts, or docs.
            </p>
            <div className="mt-3 text-xs text-black underline-offset-2 group-hover:underline">
              Go to search →
            </div>
          </a>
          <a
            href="/docs"
            className="group rounded-2xl border border-gray-500 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-semibold text-black">
              Browse documentation
            </p>
            <p className="mt-1 text-sm text-black/70">
              You might find what you need in our docs and guides.
            </p>
            <div className="mt-3 text-xs text-black underline-offset-2 group-hover:underline">
              Open docs →
            </div>
          </a>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-14 text-xs text-black/70"
        >
          Error code: <span className="font-mono">404_NOT_FOUND</span>
        </motion.p>
      </main>
    </div>
  );
}
