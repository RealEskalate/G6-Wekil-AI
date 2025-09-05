import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/translations/adminTranslation";
import { User } from "@/types/auth";

interface UsersTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userFilter: string;
  setUserFilter: (filter: string) => void;
  filteredUsers: User[];
  getStatusColor: (status: string) => string;
  itemsPerPage?: number;
}

const UsersTab: React.FC<UsersTabProps> = ({
  searchQuery,
  setSearchQuery,
  userFilter,
  setUserFilter,
  filteredUsers,
  getStatusColor,
  itemsPerPage = 10,
}) => {
  const { lang } = useLanguage();
  const t = adminTranslation[lang];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, userFilter]);

  return (
    <Card className="shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-500 overflow-visible">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
          {t.usersManagement}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 text-base">
          View and manage all users in the system.
        </CardDescription>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 " />
            <Input
              placeholder={t.searchUsers as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full sm:w-[180px] cursor-pointer h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 text-sm dark:border-gray-700 transition-colors">
                {t.filterByStatus}:{" "}
                {userFilter === "all"
                  ? t.allStatuses
                  : t[userFilter as keyof typeof t]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="rounded-xl shadow-lg z-50 w-full sm:w-[180px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1"
              sideOffset={5}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setUserFilter("all")}
              >
                {t.allStatuses}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setUserFilter("active")}
              >
                {t.active}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setUserFilter("inactive")}
              >
                {t.inactive}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 pt-0">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table className="w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.contractsCount}</TableHead>
                <TableHead>{t.joinDate}</TableHead>
                <TableHead>{t.phoneNumber}</TableHead>
                <TableHead>{t.lastActivity}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(user.status)} font-medium`}
                      >
                        {t[user.status as keyof typeof t] as string}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {user.contractsCount}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {user.telephone || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {new Date(user.lastActivity).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-gray-500 dark:text-gray-400 italic"
                  >
                    {t.noUsersFound as string}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
