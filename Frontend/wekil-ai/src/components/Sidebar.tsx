"use client";

import {
  Home,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation"; // ✅ App Router compatible
import { sidebarTranslations } from "@/lib/sidebarTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { logoutUser, setUser } from "@/lib/redux/slices/authSlice";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = sidebarTranslations[lang];
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      dispatch(setUser(null));

      await signOut({ callbackUrl: "/" });

      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="w-64 bg-white text-blue-950 flex flex-col shadow-xl border-gray-200">
      {/* Header (desktop view) */}
      <div className="p-6 border-b border-gray-400">
        <h1 className="text-xl font-semibold">{t.app_name}</h1>
      </div>

      <>
        {/* Mobile toggle button */}
        <div className="lg:hidden p-4 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-950">{t.app_name}</h1>
          <button onClick={() => setOpen(!open)}>
            {open ? (
              <X className="h-6 w-6 text-blue-950" />
            ) : (
              <Menu className="h-6 w-6 text-blue-950" />
            )}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full w-64 bg-white text-blue-950 flex flex-col shadow-sm
            transform ${open ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300 lg:translate-x-0 z-50
          `}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-300">
            <h1 className="text-xl font-semibold">{t.app_name}</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 font-semibold">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="w-full cursor-pointer justify-start text-blue-950 hover:text-white hover:bg-slate-700"
            >
              <Home className="mr-3 h-4 w-4" />
              {t.dashboard}
            </Button>

            <Button
              variant="default"
              onClick={() => router.push("/dashboard/create-contract")}
              className="w-full cursor-pointer justify-start hover:bg-slate-700 text-blue-950 hover:text-white"
            >
              <FileText className="mr-3 h-4 w-4" />
              {t.create_contract}
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/my-contracts")}
              className="w-full cursor-pointer justify-start text-blue-950 hover:text-white hover:bg-slate-700"
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
                className="p-0 cursor-pointer h-auto text-blue-950 hover:bg-transparent"
              >
                {lang === "en" ? "አማርኛ" : "English"}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/settings")}
              className="w-full cursor-pointer justify-start text-blue-950 hover:text-white hover:bg-slate-700"
            >
              <Settings className="mr-3 h-4 w-4" />
              {t.settings}
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full cursor-pointer justify-start text-red-400 hover:text-red-300 hover:bg-slate-700"
            >
              <LogOut className="mr-3 h-4 w-4" />
              {t.sign_out}
            </Button>
          </div>
        </div>
      </>
    </div>
  );
}
