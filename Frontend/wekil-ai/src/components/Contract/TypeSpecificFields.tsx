import { ContractFormat } from "@/types/Contracttype";
import React from "react";
import ServiceAgreementSpecific from "./ContractSpecfic/ServiceAgreementSpecific";
import SalesAgreementSpecific from "./ContractSpecfic/SalesAgreementSpecific";
import LoanAgreementSpecific from "./ContractSpecfic/LoanAgreementSpecific";
import NonDisclosureAgreementSpecific from "./ContractSpecfic/NonDisclosureAgreementSpecific";
interface TypeSpecificFieldsProps {
  contract: ContractFormat;
}
const TypeSpecificFields: React.FC<TypeSpecificFieldsProps> = ({
  contract,
}) => {
  return (
    <div className="m-4 p-4 border border-gray-200 rounded-2xl shadow-lg shadow-gray-200 ">
      <p className="text-lg text-blue-900 font-semibold">Additional Clauses</p>
      {(() => {
        switch (contract.type) {
          case "service":
            return <ServiceAgreementSpecific contract={contract} />;
          case "sale":
            return <SalesAgreementSpecific contract={contract} />;
          case "loan":
            return <LoanAgreementSpecific contract={contract} />;
          case "nonDisclosure":
            return <NonDisclosureAgreementSpecific contract={contract} />;
          default:
            return <div></div>;
        }
      })()}
    </div>
  );
};

export default TypeSpecificFields;
