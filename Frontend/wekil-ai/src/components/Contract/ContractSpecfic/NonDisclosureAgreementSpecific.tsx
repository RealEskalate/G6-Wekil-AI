import { ContractFormat } from "@/types/Contracttype";
import React from "react";
interface NonDisclosureAgreementSpecificProps {
  contract: ContractFormat;
}
import { useLanguage } from "@/context/LanguageContext";
const NonDisclosureAgreementSpecific: React.FC<
  NonDisclosureAgreementSpecificProps
> = ({ contract }) => {
  const {lang} = useLanguage();
  return (
    <div className="w-full font-bold">
      <div className="p-4 flex justify-between">
        <p className="my-2 text-md text-blue-950">{lang=='en'?'Effective Date':'የመጀመሪያ ቀን'} </p>
        <p className="my-2 text-md text-blue-950">{contract.effectiveDate}</p>
      </div>
      <div className="p-4 flex justify-between">
        <p className="my-2 text-md text-blue-950">{lang=='en'?' confidentiality Term':'የሚስጥር ጥበቃ ጊዜ፤ውሎች'}</p>
        <p className="my-2 text-md text-end text-blue-950">
          {contract.confidentialityTerm}
        </p>
      </div>
      <div className="p-4">
        <p className="my-2 text-md text-blue-950">{lang=='en'?'Purpose':'ዓላማ'}</p>
        <p className="my-2 text-md text-blue-950">{contract.purpose}</p>
      </div>
    </div>
  );
};

export default NonDisclosureAgreementSpecific;
