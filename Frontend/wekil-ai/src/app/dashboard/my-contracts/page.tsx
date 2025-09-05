import React from "react";
import ViewContract from "./ViewContract";
import { data3 } from "@/types/Contracttype";

const MyContracts = () => {
  return (
    <div>
      <ViewContract contract={data3} />
    </div>
  );
};

export default MyContracts;
