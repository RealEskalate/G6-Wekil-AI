import React from "react";
import { Party } from "@/types/Contracttype";
interface PartyCardProps {
  party1: Party;
  party2: Party;
}
const PartyCard: React.FC<PartyCardProps> = ({ party1, party2 }) => {
  return (
    <div>
      <div className="grid grid-cols-2">
        {[party1, party2].map((party, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl p-4 m-4"
          >
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Party {index + 1}
            </p>
            <SinglePartyCard {...party} />
          </div>
        ))}
      </div>
    </div>
  );
};

const SinglePartyCard = (party: Party) => {
  return (
    <div>
      {Object.keys(party).map((key) =>
        party[key as keyof Party] ? (
          <div className="my-2" key={key}>
            <p className="inline text-md font-semibold text-gray-500 mr-2">
              {key[0].toUpperCase() + key.substring(1)}:
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
