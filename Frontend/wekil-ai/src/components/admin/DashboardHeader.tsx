"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { BarChart3, Globe, RefreshCw, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/translations/adminTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const DashboardHeader = () => {
  const { lang, setLang } = useLanguage();
  const t = adminTranslation[lang];
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <header className="sticky top-0 z-40 pb-3 border-b border-gray-300 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title + Subtitle */}
          <div>
            <h1 className="font-semibold flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-accent text-blue-600" />
              {t.title}
            </h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              aria-label="Refresh dashboard"
              className="cursor-pointer border-gray-200 bg-gray-100 hover:bg-gray-200"
              disabled={loading}
            >
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ repeat: loading ? Infinity : 0, duration: 1 }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
              </motion.div>
              {t.refresh}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Change language"
                  className="cursor-pointer border-gray-100 bg-gray-100 hover:bg-gray-200"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {lang === "en" ? "English" : "አማርኛ"}
                  <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLang("en")}
                  className="flex items-center justify-between"
                >
                  English {lang === "en" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLang("am")}
                  className="flex items-center justify-between"
                >
                  አማርኛ {lang === "am" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
