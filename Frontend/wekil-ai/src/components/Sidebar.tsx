"use client";

import {
  Home,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Sidebar() {
  return (
    <div className="w-64 bg-white text-blue-950 flex flex-col shadow-xl border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-400">
        <h1 className="text-xl font-semibold">Wekil AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-950 hover:text-white hover:bg-slate-700"
        >
          <Home className="mr-3 h-4 w-4" />
          Dashboard
        </Button>

        <Button
          variant="default"
          className="w-full justify-start hover:bg-slate-700 text-blue-950 hover:text-white"
        >
          <FileText className="mr-3 h-4 w-4" />
          Create Contract
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-blue-950 hover:text-white hover:bg-slate-700"
        >
          <FolderOpen className="mr-3 h-4 w-4" />
          My Contracts
        </Button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-300 space-y-2">
        <div className="flex items-center text-blue-950 text-sm mb-4">
          <Globe className="mr-2 h-4 w-4" />
          አማርኛ
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-blue-950 hover:text-white hover:bg-slate-700"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
