"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import DashboardHeader from "@/components/admin/DashboardHeader";
import OverviewTab from "@/components/admin/OverviewTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import ContractsTab from "@/components/admin/ContractsTab";
import UsersTab from "@/components/admin/UsersTab";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/translations/adminTranslation";
import { AnalyticsData, Contract } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchAdminUsers } from "@/lib/redux/slices/adminSlice";
import { User } from "@/types/auth";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area">(
    "bar"
  );

  const { lang } = useLanguage();
  const t = adminTranslation[lang];
  const { data: session, status } = useSession();
  const router = useRouter();
  const accountType = session?.user?.account_type;
  const token = session?.user?.accessToken;

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, totalUsers } = useSelector(
    (state: RootState) => state.admin
  );

  // --- Mock Contracts & Analytics ---
  const mockContracts: Contract[] = useMemo(
    () => [
      {
        id: "1",
        title: "Website Development",
        type: "service",
        status: "active",
        creator: "John Doe",
        createdAt: "2024-01-20",
        amount: 50000,
        currency: "ETB",
      },
      {
        id: "2",
        title: "Equipment Sale",
        type: "sale",
        status: "completed",
        creator: "ABC Company",
        createdAt: "2024-01-18",
        amount: 25000,
        currency: "ETB",
      },
      {
        id: "3",
        title: "Personal Loan",
        type: "loan",
        status: "active",
        creator: "Jane Smith",
        createdAt: "2024-01-15",
        amount: 15000,
        currency: "ETB",
      },
    ],
    []
  );

  const mockAnalytics: AnalyticsData[] = useMemo(
    () => [
      { month: "Aug", contracts: 45, users: 120, revenue: 2250000 },
      { month: "Sep", contracts: 52, users: 145, revenue: 2600000 },
      { month: "Oct", contracts: 48, users: 160, revenue: 2400000 },
      { month: "Nov", contracts: 61, users: 180, revenue: 3050000 },
      { month: "Dec", contracts: 58, users: 195, revenue: 2900000 },
      { month: "Jan", contracts: 67, users: 220, revenue: 3350000 },
    ],
    []
  );

  const totalContracts = mockContracts.length;
  const totalRevenue = mockContracts.reduce(
    (sum, contract) => sum + contract.amount,
    0
  );
  const activeContracts = mockContracts.filter(
    (c) => c.status === "active"
  ).length;

  const filteredContracts = useMemo(() => {
    return mockContracts.filter((contract) => {
      const matchesSearch =
        contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        contractFilter === "all" || contract.type === contractFilter;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, contractFilter, mockContracts]);

  const mappedUsers: User[] = users.map((u) => ({
    id: u.id,
    name: `${u.first_name} ${u.last_name}`,
    email: u.email,
    status: u.is_verified ? "active" : "inactive",
    contractsCount: 0,
    joinDate: u.created_at,
    lastActivity: u.updated_at,
    telephone: u.telephone || "N/A",
  }));
  const filteredUsers = useMemo(() => {
    return mappedUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = userFilter === "all" || user.status === userFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mappedUsers, searchQuery, userFilter]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchAdminUsers({ token, page: 1, limit: totalUsers || 100 }));
    }
  }, [dispatch, token, totalUsers]);

  useEffect(() => {
    if (status === "authenticated" && accountType !== "admin") {
      router.replace("/not-authorized");
    }
  }, [status, accountType, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (status === "authenticated" && accountType !== "admin") {
    return null;
  }

  return (
    <div
      className={`min-h-screen bg-background ${
        lang === "am" ? "font-ethiopic" : ""
      }`}
    >
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger className="cursor-pointer" value="overview">
              {t.overview}
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="analytics">
              {t.analytics}
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="contracts">
              {t.contracts}
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="users">
              {t.users}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              stats={{
                totalUsers,
                totalContracts,
                totalRevenue,
                activeContracts,
              }}
              analyticsData={mockAnalytics}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab
              chartType={chartType}
              setChartType={setChartType}
              analyticsData={mockAnalytics}
              mockContracts={mockContracts}
            />
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <ContractsTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              contractFilter={contractFilter}
              setContractFilter={setContractFilter}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
              filteredContracts={filteredContracts}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <UsersTab
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
                filteredUsers={filteredUsers}
                getStatusColor={getStatusColor}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
