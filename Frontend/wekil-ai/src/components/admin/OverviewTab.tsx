import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Users, FileText, DollarSign, Activity } from "lucide-react";
import { AnalyticsData } from "@/types/auth";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/translations/adminTranslation";

interface OverviewTabProps {
  stats: {
    totalUsers: number;
    totalContracts: number;
    totalRevenue: number;
    activeContracts: number;
  };
  analyticsData: AnalyticsData[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, analyticsData }) => {
  const { lang } = useLanguage();
  const t = adminTranslation[lang];

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-lg">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between p-6 shadow-md transition-all duration-300 hover:shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t.totalUsers}
            </CardTitle>
            <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent className="flex flex-col pt-4">
            <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between p-6 shadow-md transition-all duration-300 hover:shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t.totalContracts}
            </CardTitle>
            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent className="flex flex-col pt-4">
            <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              {stats.totalContracts.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between p-6 shadow-md transition-all duration-300 hover:shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t.totalRevenue}
            </CardTitle>
            <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent className="flex flex-col pt-4">
            <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              {stats.totalRevenue.toLocaleString()} ETB
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between p-6 shadow-md transition-all duration-300 hover:shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t.activeContracts}
            </CardTitle>
            <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent className="flex flex-col pt-4">
            <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              {stats.activeContracts.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
              {t.contractsOverTime}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analyticsData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="month"
                  className="text-sm text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="contracts"
                  fill="#3B82F6"
                  className="rounded-t-lg"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
              {t.usersOverTime}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analyticsData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="month"
                  className="text-sm text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ fill: "#22C55E", r: 4 }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
