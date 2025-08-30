import { ContractFormat } from "@/types/Contracttype";
import React from "react";
interface NonDisclosureAgreementSpecificProps {
  contract: ContractFormat;
}
const NonDisclosureAgreementSpecific: React.FC<
  NonDisclosureAgreementSpecificProps
> = ({ contract }) => {
  return (
    <div className="w-full font-bold">
      <div className="p-4 flex justify-between">
        <p className="my-2 text-md text-blue-950">Effective Date</p>
        <p className="my-2 text-md text-blue-950">{contract.effectiveDate}</p>
      </div>
      <div className="p-4 flex justify-between">
        <p className="my-2 text-md text-blue-950">confidentiality Term</p>
        <p className="my-2 text-md text-end text-blue-950">
          {contract.confidentialityTerm}
        </p>
      </div>
      <div className="p-4">
        <p className="my-2 text-md text-blue-950">Purpose</p>
        <p className="my-2 text-md text-blue-950">{contract.purpose}</p>
      </div>
    </div>
  );
};

export default NonDisclosureAgreementSpecific;
