"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { settingTranslations } from "@/lib/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import {
  ExternalLink,
  Github,
  Heart,
  Code,
  BookOpen,
  Shield,
  FileText,
  ChevronRight,
  Calendar,
  Tag,
  Users,
  Globe,
  Sparkles,
} from "lucide-react";

export default function AboutCard() {
  const { lang } = useLanguage();
  const t = settingTranslations[lang];
  const [activeTab, setActiveTab] = useState("info");

  const links = [
    {
      label: t.support,
      href: "#",
      icon: Users,
      description: t.supportDesc,
    },
    {
      label: t.documentation,
      href: "#",
      icon: BookOpen,
      description: t.documentationDesc,
    },
    {
      label: t.privacyPolicy,
      href: "#",
      icon: Shield,
      description: t.privacyPolicyDesc,
    },
    {
      label: t.termsOfService,
      href: "#",
      icon: FileText,
      description: t.termsOfServiceDesc,
    },
  ];

  const features = [
    {
      title: t.modernDesign,
      description: t.modernDesignDesc,
      icon: Sparkles,
    },
    {
      title: t.twoLanguages,
      description: t.twoLanguagesDesc,
      icon: Globe,
    },
    {
      title: t.openSource,
      description: t.openSourceDesc,
      icon: Code,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-200/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {t.about}
              </CardTitle>
              <p className="text-gray-600 mt-1">{t.aboutDesc}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: "info", label: t.information },
              { id: "features", label: t.features },
              { id: "links", label: t.resources },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 cursor-pointer py-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-200/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {t.version}:
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      1.0.0
                    </span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {t.latest}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 p-4 rounded-xl border border-purple-200/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {t.lastUpdated}:
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-purple-600">
                      January 2024
                    </span>
                    <span className="text-xs text-gray-500">(v1.0.0)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 p-5 rounded-xl border border-gray-200/50">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  {t.disclaimer}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t.disclaimerText}
                </p>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200/60 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-2 bg-blue-100 rounded-lg w-fit mb-3">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Links Tab */}
          {activeTab === "links" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={index}
                    onClick={() => window.open(link.href, "_blank")}
                    className="group cursor-pointer flex items-center justify-between p-4 bg-white border border-gray-200/60 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {link.label}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">{t.madeWith}</span>
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                <span className="text-sm">{t.byOurTeam}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 cursor-pointer border-gray-300 hover:border-gray-400"
                onClick={() =>
                  window.open(
                    "https://github.com/RealEskalate/G6-Wekil-AI.git",
                    "_blank"
                  )
                }
              >
                <Github className="w-4 h-4" />
                {t.starOnGitHub}
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
