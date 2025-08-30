import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/Button";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { adminTranslation } from "@/lib/adminTranslation";
import { Contract } from "@/types/auth";

interface ContractsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  contractFilter: string;
  setContractFilter: (filter: string) => void;
  userFilter: string;
  setUserFilter: (filter: string) => void;
  filteredContracts: Contract[];
  getStatusColor: (status: string) => string;
}

const ContractsTab: React.FC<ContractsTabProps> = ({
  searchQuery,
  setSearchQuery,
  contractFilter,
  setContractFilter,
  filteredContracts,
  getStatusColor,
}) => {
  const { lang } = useLanguage();
  const t = adminTranslation[lang];

  return (
    <Card className="shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-500 overflow-visible">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
          {t.contractsManagement}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 text-base">
          {"View and manage all contracts in the system."}
        </CardDescription>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 " />
            <Input
              placeholder={"Search contracts..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
            {/* Filter by Contract Type */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer sm:w-[180px] h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors"
                >
                  {t.filterByType}:{" "}
                  {contractFilter === "all"
                    ? t.allTypes
                    : t[contractFilter as keyof typeof t]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-xl cursor-pointer shadow-lg z-50 w-full sm:w-[180px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1"
                sideOffset={5}
              >
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => setContractFilter("all")}
                >
                  {t.allTypes}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => setContractFilter("service")}
                >
                  {t.service}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => setContractFilter("sale")}
                >
                  {t.sale}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => setContractFilter("loan")}
                >
                  {t.loan}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => setContractFilter("nda")}
                >
                  {t.nda}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                  {t.type}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.status}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.created}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  {t.amount}
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">
                  {t.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <TableRow
                    key={contract.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium cursor-pointer text-gray-900 dark:text-gray-50">
                      {contract.title}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium">
                        {t[contract.type as keyof typeof t] as string}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          contract.status
                        )} font-medium`}
                      >
                        {t[contract.status as keyof typeof t] as string}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {contract.amount.toLocaleString()} {contract.currency}
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
                    colSpan={6}
                    className="h-24 text-center text-gray-500 dark:text-gray-400 italic"
                  >
                    {"No contracts found."}
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

export default ContractsTab;
