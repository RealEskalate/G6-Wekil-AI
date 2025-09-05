/* eslint-disable @next/next/no-img-element */
import { Party } from "@/types/Contracttype";
import React from "react";
export interface Section {
  title: string;
  description: string;
}
export interface ContractDraft {
  party1: Party;
  party2: Party;
  title: string;
  sections: Section[];
  sign1: string;
  sign2: string;
}

export const IntialDraftdata: ContractDraft = {
  title: "Website Development Contract",
  party1: {
    name: "John Doe",
    address: "123 Main St, Cityville",
    email: "johnny@gmail.com",
    phone: "555-1234",
  },
  party2: {
    name: "ABC Company",
    address: "456 Corporate Blvd, Townsville",
    email: "info@abccompany.org",
    phone: "555-5678",
  },
  sections: [
    {
      title: "Scope of Work",
      description:
        "The Developer shall design and develop a responsive e-commerce website for the Client, including product catalog, shopping cart, checkout system, and payment gateway integration. The website will be built using React.js frontend and Node.js backend, with MongoDB database. The Developer will also provide three rounds of revisions and basic SEO optimization.",
    },
    {
      title: "Payment Terms",
      description:
        "Total project cost: $12,500. Payment schedule: 40% ($5,000) due upon signing, 40% ($5,000) due after design approval, and 20% ($2,500) due upon project completion and delivery. All payments are due within 15 days of invoice. Late payments will incur a 1.5% monthly interest charge.",
    },
    {
      title: "Timeline and Milestones",
      description:
        "Project duration: 12 weeks from contract signing. Key milestones: Week 2 - Wireframe approval, Week 4 - Design mockup approval, Week 8 - Functional development complete, Week 10 - Client testing period, Week 12 - Final delivery and launch. Delays caused by Client feedback will adjust the timeline accordingly.",
    },
    {
      title: "Intellectual Property",
      description:
        "Upon full payment, the Client will own all intellectual property rights to the completed website, including design elements, code, and content. The Developer retains the right to display the work in their portfolio. Open-source components used will remain under their respective licenses.",
    },
    {
      title: "Confidentiality",
      description:
        "Both parties agree to keep confidential all proprietary information shared during the project period, including business strategies, technical processes, and customer data. This obligation survives termination of the contract for a period of three years.",
    },
    {
      title: "Termination Clause",
      description:
        "Either party may terminate this agreement with 30 days written notice. If Client terminates, they will pay for all work completed up to termination date. If Developer terminates, they will refund any prepayment for work not yet completed, minus a 10% administrative fee.",
    },
    {
      title: "Warranty and Support",
      description:
        "The Developer provides a 90-day warranty period after launch for bug fixes and technical issues. Additional support and maintenance available at $125/hour or through a monthly retainer agreement. Response time for critical issues: 24 hours during business days.",
    },
  ],
  sign1:
    "data:image/png;base64,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",
  sign2:
    "data:image/png;base64,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",
};

const ContractPreview = ({data}:{data: ContractDraft}) => {
  return (
    <div className="bg-white p-32 scroll-auto m-8">
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
            <p className="block text-sm font-bold">{item.title}</p>
            <p className="text-md mb-8 md:mb-16">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {[data.party1, data.party2].map((item, idx) => (
          <div className="" key={idx}>
            <p className="font-bold text-lg">{item.name}</p>
            <p className="font-bold text-lg">Signiture:</p>
            <img className="w-48 h-16 bg-gray-200 border border-gray-100 " src={data.sign1} alt=""/>
          </div>
        ))}
      </div>
      <button
        className="border border-gray-200 rounded-full p-1 px-4 bg-green-400 text-white"
        onClick={() => {
          console.log(document.getElementById("description")?.innerText);
        }}
      >
        Draft
      </button>
    </div>
  );
};

export default ContractPreview;
