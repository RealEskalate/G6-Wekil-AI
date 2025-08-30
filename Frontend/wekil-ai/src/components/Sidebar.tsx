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
import { useRouter } from "next/navigation";
import { sidebarTranslations } from "@/lib/sidebarTranslations";
import { useLanguage } from "@/context/LanguageContext";

export function Sidebar() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = sidebarTranslations[lang];

  return (
    <div className="w-64 bg-white text-blue-950 flex flex-col shadow-xl border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-400">
        <h1 className="text-xl font-semibold">{t.app_name}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="w-full justify-start text-blue-950 hover:text-white hover:bg-slate-700"
        >
          <Home className="mr-3 h-4 w-4" />
          {t.dashboard}
        </Button>

        <Button
          variant="default"
          onClick={() => router.push("/create-contract")}
          className="w-full justify-start hover:bg-slate-700 text-blue-950 hover:text-white"
        >
          <FileText className="mr-3 h-4 w-4" />
          {t.create_contract}
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push("/my-contract")}
          className="w-full justify-start text-blue-950 hover:text-white hover:bg-slate-700"
        >
          <FolderOpen className="mr-3 h-4 w-4" />
          {t.my_contracts}
        </Button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-300 space-y-2">
        <div className="flex items-center text-blue-950 text-sm mb-4">
          <Globe className="mr-2 h-4 w-4" />
          <Button
            variant="ghost"
            onClick={() => setLang(lang === "en" ? "am" : "en")}
            className="p-0 h-auto text-blue-950 hover:bg-transparent"
          >
            {lang === "en" ? "አማርኛ" : "English"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-blue-950 hover:text-white hover:bg-slate-700"
        >
          <Settings className="mr-3 h-4 w-4" />
          {t.settings}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          {t.sign_out}
        </Button>
      </div>
    </div>
  );
}
