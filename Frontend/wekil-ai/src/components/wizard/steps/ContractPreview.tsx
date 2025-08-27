"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { ContractData, Language } from "../ContractWizard";

interface ContractPreviewProps {
  data: ContractData;
  onUpdate: (data: Partial<ContractData>) => void;
  currentLanguage: Language;
}

export function ContractPreview({
  data,
  onUpdate,
  currentLanguage,
}: ContractPreviewProps) {
  const getContractTypeName = (type: string) => {
    switch (type) {
      case "service-agreement":
        return "Service Agreement";
      case "sale-of-goods":
        return "Sale of Goods";
      case "simple-loan":
        return "Simple Loan";
      case "non-disclosure-agreement":
        return "Non-Disclosure Agreement";
      default:
        return "Contract";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contract Preview</h2>
        <p className="text-gray-600">Review your contract before finalizing</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Preview Contract</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Language:</span>
          <Select defaultValue="en">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="am">አማ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-8 bg-white">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <Badge variant="destructive" className="bg-red-500">
              NOT LEGAL ADVICE
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">
              {getContractTypeName(data.contractType)}
            </h2>
          </div>

          <div>
            <h3 className="font-semibold mb-2">PARTIES:</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>First Party: {data.firstParty.fullName || ""}</div>
              <div>Phone: {data.firstParty.phone || ""}</div>
              <div>Email: {data.firstParty.email || ""}</div>
              <div>Address: {data.firstParty.address || ""}</div>

              <div className="mt-4">
                Second Party: {data.secondParty.fullName || ""}
              </div>
              <div>Phone: {data.secondParty.phone || ""}</div>
              <div>Email: {data.secondParty.email || ""}</div>
              <div>Address: {data.secondParty.address || ""}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">TERMS:</h3>
            <div className="space-y-1 text-sm font-mono">
              <div>
                Amount: {data.dealTerms.amount || "32323"}{" "}
                {data.dealTerms.currency}
              </div>
              <div>Start Date: {data.dealTerms.startDate || "0001-01-11"}</div>
              <div>End Date: {data.dealTerms.endDate || "111111-01-11"}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">DESCRIPTION:</h3>
            <div className="text-sm font-mono">
              {data.dealTerms.description || "rfrfr"}
            </div>
          </div>

          {(data.additionalClauses.confidentialityClause ||
            data.additionalClauses.cancellationClause) && (
            <div className="space-y-1 text-sm font-mono">
              {data.additionalClauses.confidentialityClause && (
                <div>✓ Confidentiality clause included</div>
              )}
              {data.additionalClauses.cancellationClause && (
                <div>✓ Cancellation clause included</div>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">SIGNATURE AREAS:</h3>
            <div className="space-y-4 text-sm font-mono">
              <div>First Party: _________________ Date: _______</div>
              <div>Second Party: _________________ Date: _______</div>
            </div>
          </div>

          <div className="border-t pt-4 text-xs text-gray-500">
            <div>---</div>
            <div>NOT LEGAL ADVICE</div>
            <div>
              This contract is generated for informational purposes only and
              does not constitute legal advice. Please consult with a qualified
              attorney for legal matters.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
