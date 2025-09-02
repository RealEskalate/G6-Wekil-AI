import React from "react";
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
} from "@/components/ui/DropdownMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/adminTranslation";
import { User } from "@/types/auth";

interface UsersTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userFilter: string;
  setUserFilter: (filter: string) => void;
  filteredUsers: User[];
  getStatusColor: (status: string) => string;
}

const UsersTab: React.FC<UsersTabProps> = ({
  searchQuery,
  setSearchQuery,
  userFilter,
  setUserFilter,
  filteredUsers,
  getStatusColor,
}) => {
  const { lang } = useLanguage();
  const t = adminTranslation[lang];

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
          {/* Filter by Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] cursor-pointer h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 text-sm dark:border-gray-700 transition-colors"
              >
                {t.filterByStatus}:{" "}
                {userFilter === "all"
                  ? t.allStatuses
                  : t[userFilter as keyof typeof t]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="rounded-xl shadow-lg z-50 w-full sm:w-[180px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1"
              sideOffset={5}
            >
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => setUserFilter("all")}
              >
                {t.allStatuses}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => setUserFilter("active")}
              >
                {t.active}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.name}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.email}
                </TableHead>
                <TableHead className="font-semibold text-gray-70 dark:text-gray-300">
                  {t.status}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.contractsCount}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.joinDate}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">
                  {t.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full w-8 h-8 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full w-8 h-8 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full w-8 h-8 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
