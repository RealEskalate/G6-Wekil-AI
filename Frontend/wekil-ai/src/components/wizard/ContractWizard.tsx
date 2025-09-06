import { Section } from "@/types/Contracttype";
import { Party } from "@/types/Contracttype";
import { ContractDraft } from "@/types/Contracttype";
import Image from "next/image";
import React from "react";
interface BackendSection {
  heading: string;
  text: string;
}

interface BackendSignatures {
  party_a: string;
  party_b: string;
  place: string;
  date: string;
}

interface BackendContract {
  id: string;
  title: string;
  sections: BackendSection[];
  signatures: BackendSignatures;
}

export function mapBackendToDraft(
  backend: BackendContract,
  party1: Party,
  party2: Party
): ContractDraft {
  return {
    title: backend.title,
    party1,
    party2,
    sections: backend.sections.map(
      (s): Section => ({
        heading: s.heading,
        description: s.text,
      })
    ),
    sign1: backend.signatures.party_a,
    sign2: backend.signatures.party_b,
    place: backend.signatures.place,
    date: backend.signatures.date,
  };
}

const ContractPreview = ({ data }: { data: ContractDraft }) => {
  return (
    <div className="bg-white p-4 md:p-32 scroll-auto m-8">
      <p className="text-left text-md font-bold">Date: 1/5/2025</p>
      <div className="flex justify-between font-bold text-md my-16">
        {[data.party1, data.party2].map((item, idx) => (
          <div className="" key={idx}>
            <p className="">{item.name}</p>
            <p className="">{item.address}</p>
            <p className="">{item.email}</p>
          </div>
        ))}
      </div>
      <div id="description">
        <p className="font-bold text-lg text-center my-16">{data.title}</p>
        {data.sections.map((item, idx) => (
          <div className="" key={idx}>
            <p className="block text-sm font-bold">{item.heading}</p>
            <p className="text-md mb-8 md:mb-16">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {[data.party1, data.party2].map((item, idx) => (
          <div className="" key={idx}>
            <p className="font-bold text-lg">{item.name}</p>
            <p className="font-bold text-lg">Signiture:</p>
            <Image
              src={data.sign1 || data.sign2 || "/sign.png"}
              alt="signature"
              width={192}
              height={64}
              className="bg-gray-200 border border-gray-100 min-mx-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractPreview;