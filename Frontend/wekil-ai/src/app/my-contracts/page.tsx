import React from "react";
import { data3 } from "@/types/Contracttype";
import ViewContract from "./ViewContract";

const MyContracts = () => {
  return (
    <div>
      <ViewContract contract={data3} />
    </div>
  );
};

export default MyContracts;
