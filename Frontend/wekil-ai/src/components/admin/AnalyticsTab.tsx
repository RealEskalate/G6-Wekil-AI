import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
} from "lucide-react";
import { AnalyticsData, Contract } from "@/types/auth";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/adminTranslation";

interface AnalyticsTabProps {
  chartType: "bar" | "line" | "pie" | "area";
  setChartType: (value: "bar" | "line" | "pie" | "area") => void;
  analyticsData: AnalyticsData[];
  mockContracts: Contract[];
}

const chartTypes = [
  { value: "bar", icon: <BarChart3 className="w-4 h-4" />, label: "Bar Chart" },
  {
    value: "line",
    icon: <LineChartIcon className="w-4 h-4" />,
    label: "Line Chart",
  },
  {
    value: "area",
    icon: <AreaChartIcon className="w-4 h-4" />,
    label: "Area Chart",
  },
  {
    value: "pie",
    icon: <PieChartIcon className="w-4 h-4" />,
    label: "Pie Chart",
  },
];

const COLORS = {
  primary: "#3B82F6", // Tailwind blue-500
  secondary: "#22C55E", // Tailwind green-500
  tertiary: "#F97316", // Tailwind orange-500
  quaternary: "#EF4444", // Tailwind red-500
};

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  chartType,
  setChartType,
  analyticsData,
  mockContracts,
}) => {
  const { lang } = useLanguage();
  const t = adminTranslation[lang];
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [analyticsData]);

  const contractTypeData = useMemo(
    () => [
      {
        name: t.service,
        value: mockContracts.filter((c) => c.type === "service").length,
        color: COLORS.primary,
      },
      {
        name: t.sale,
        value: mockContracts.filter((c) => c.type === "sale").length,
        color: COLORS.secondary,
      },
      {
        name: t.loan,
        value: mockContracts.filter((c) => c.type === "loan").length,
        color: COLORS.tertiary,
      },
      {
        name: t.nda,
        value: mockContracts.filter((c) => c.type === "nda").length,
        color: COLORS.quaternary,
      },
    ],
    [mockContracts, t]
  );

  const contractStatusData = useMemo(
    () => [
      {
        name: t.active,
        value: mockContracts.filter((c) => c.status === "active").length,
        color: COLORS.primary,
      },
      {
        name: t.completed,
        value: mockContracts.filter((c) => c.status === "completed").length,
        color: COLORS.secondary,
      },
      {
        name: t.draft,
        value: mockContracts.filter((c) => c.status === "draft").length,
        color: COLORS.tertiary,
      },
      {
        name: t.pending,
        value: mockContracts.filter((c) => c.status === "pending").length,
        color: COLORS.quaternary,
      },
    ],
    [mockContracts, t]
  );

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-primary border-gray-200"></div>
        </div>
      );
    }

    if (analyticsData.length === 0) {
      return (
        <div className="flex justify-center items-center h-[400px] text-gray-500 italic text-lg">
          {t.noData || "No analytics data available."}
        </div>
      );
    }

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={analyticsData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(5px)",
                }}
              />
              <Line
                type="monotone"
                dataKey="contracts"
                stroke={COLORS.primary}
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: COLORS.primary }}
                activeDot={{ r: 8, stroke: COLORS.primary, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke={COLORS.secondary}
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: COLORS.secondary }}
                activeDot={{ r: 8, stroke: COLORS.secondary, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={analyticsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(5px)",
                }}
              />
              <defs>
                <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.primary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.secondary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.secondary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="contracts"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorContracts)"
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke={COLORS.secondary}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <div className="flex flex-col lg:flex-row gap-8 h-[400px] w-full">
            {/* Contracts by Type Chart */}
            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-inner flex-1 min-w-[450px]">
              <h4 className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {t.contractsByType}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contractTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent != null && percent > 0.05
                        ? `${name}: ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                  >
                    {contractTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Contracts by Status Chart */}
            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-inner flex-1 min-w-[450px]">
              <h4 className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {t.contractsByStatus}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contractStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent != null && percent > 0.05
                        ? `${name}: ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                  >
                    {contractStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={analyticsData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(5px)",
                }}
              />
              <Bar
                dataKey="contracts"
                fill={COLORS.primary}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="users"
                fill={COLORS.secondary}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
          {t.analyticsDashboard}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 text-base">
          {t.analyticsDescription}
        </CardDescription>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t.chartType}:
          </Label>
          <div className="flex items-center rounded-xl p-1 bg-gray-100 dark:bg-gray-800 shadow-inner">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  setChartType(type.value as "bar" | "line" | "pie" | "area")
                }
                className={`p-3 cursor-pointer transition-all duration-300 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  chartType === type.value
                    ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label={type.label}
                title={type.label}
              >
                {type.icon}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 max-w-full pt-0 min-h-[500px] flex items-center justify-center">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
