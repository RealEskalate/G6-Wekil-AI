import { ContractFormat } from "@/types/Contracttype";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const AgreementGetApi = createApi({
  reducerPath: "getAgreementById",
  baseQuery: fetchBaseQuery({ baseUrl: "https://g6-wekil-ai-1.onrender.com/",
    prepareHeaders: (headers) => {
        const token = "";
        headers.set("Authorization",`Bearer ${token}`);
        return headers;
    }
   }),
  endpoints: (builder) => ({
    getAgrementByAId: builder.query<ContractFormat, string>({
      query: (AgID) => `${AgID}`,
    }),
    getAgrementByUserId: builder.query<ContractFormat, string>({
      query: (userID) => `agreement/${userID}`,
    }),
    getAgrementByFilter: builder.query<ContractFormat, string>({
      query: (filter) => `agreement/${filter}`,
    })
  }),
});
export const { useGetAgrementByUserIdQuery,useGetAgrementByAIdQuery } = AgreementGetApi;