import React from "react";
import { Party } from "@/types/Contracttype";
interface PartyCardProps {
  party1: Party;
  party2: Party;
  type: "service" | "sale" | "loan" | "nonDisclosure";
}
interface partyNameType {
  service: string[];
  sale: string[];
  loan: string[];
  nonDisclosure: string[];
}

type TransitionPartyNames = {
  [K in keyof partyNameType]: {
    [P in partyNameType[K][number]]: string;
  };
};

interface TransitionEntry extends TransitionPartyNames {
  name: string;
  phone: string;
  address: string;
  email: string;
}

type TransitionType = {
  am: TransitionEntry;
  en: TransitionEntry;
};

const partyName: partyNameType = {
  service: ["serviceProvider", "client"],
  sale: ["seller", "buyer"],
  loan: ["lender", "borrower"],
  nonDisclosure: ["discloser", "recipient"],
};

const transition: TransitionType = {
  en: {
    service: {
      serviceProvider: "serviceProvider",
      client: "client",
    },
    sale: { seller: "seller", buyer: "buyer" },
    loan: {
      lender: "lender",
      borrower: "borrower",
    },
    nonDisclosure: {
      discloser: "Discloser",
      recipient: "recipient",
    },
    name: "FullName",
    phone: "PhoneNumber",
    address: "Address",
    email: "Email Address",
  },
  am: {
    service: { serviceProvider: "አገልግሎት ሰጪ", client: "ደንበኛ" },
    sale: { seller: "ሻጭ", buyer: "ገዢ" },
    loan: { lender: "አበዳሪ", borrower: "ተበዳሪ" },
    nonDisclosure: { discloser: "መረጃ ሰጪ", recipient: "መረጃ ተቀባይ" },
    name: "ሙሉ ስም",
    phone: "ስልክ ቁጥር",
    address: "አድራሻ", // Fixed: changed from "adress" to "address"
    email: "ኢሜል አድራሻ",
  },
};
import { useLanguage } from "@/context/LanguageContext";
const PartyCard: React.FC<PartyCardProps> = ({ party1, party2, type }) => {
  const { lang } = useLanguage();
  return (
    <div>
      <div className="grid grid-cols-2">
        {[party1, party2].map((party, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl p-4 m-4"
          >
            <p className="text-lg font-semibold text-gray-700 mb-4">
              {transition[lang][type][partyName[type][index]]}
            </p>
            <SinglePartyCard {...party} />
          </div>
        ))}
      </div>
    </div>
  );
};

const SinglePartyCard = (party: Party) => {
  const { lang } = useLanguage();
  return (
    <div>
      {Object.keys(party).map((key) =>
        party[key as keyof Party] ? (
          <div className="my-2" key={key}>
            <p className="inline text-md font-semibold text-gray-500 mr-2">
              {transition[lang][key as keyof Party]}:
            </p>
            <p className="inline text-sm font-bold text-blue-950 ">
              {party[key as keyof Party]}
            </p>
          </div>
        ) : null
      )}
    </div>
  );
};

export default PartyCard;
