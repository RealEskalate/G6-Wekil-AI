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
import { useRouter } from "next/navigation";
import { sidebarTranslations } from "@/lib/translations/sidebarTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
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

  // Optionally, lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    <>
      {/* Hamburger icon for mobile, blends in with the page */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md bg-white/80 shadow border border-gray-200"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-blue-950" />
          </button>
        )}
      </div>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
      {/* Sidebar panel for all screens, sliding on mobile */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white text-blue-950 flex flex-col shadow-xl border-r border-gray-200
          transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:h-screen lg:w-60
        `}
        style={{ maxWidth: 280 }}
      >
        {/* Close button mobile */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300 lg:hidden">
          <h1 className="text-xl font-semibold">{t.app_name}</h1>
          <button onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X className="h-6 w-6 text-blue-950" />
          </button>
        </div>
        {/* Header desktop */}
        <div className="hidden lg:block p-6 border-b border-gray-400">
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
  );
}
