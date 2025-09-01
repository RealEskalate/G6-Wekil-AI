"use client";

import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar stays fixed */}
      <div className="hidden lg:block fixed h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto">{children}</main>
    </div>
  );
}
