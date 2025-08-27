import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContractDraft {
  id: string;
  type: "service" | "sale" | "loan" | "nda";
  language: "am" | "en";
  created_at: string;
  updated_at: string;
  parties: { name: string; phone?: string; email?: string }[];
  money?: { currency: string; total: number; payment_plan?: { amount: number; due_date: string }[] };
  dates?: { start_date?: string; end_date?: string; sign_date?: string };
  terms?: {
    scope?: string;
    services?: string;
    goods?: { item: string; qty: number; unit_price: number }[];
    location?: string;
    extras?: { late_fee?: number; revisions?: number; confidentiality?: boolean };
  };
  status: "draft" | "exported";
  storage_paths?: { pdf?: string; docx?: string };
}

interface AgreementsState {
  list: ContractDraft[];
}

const initialState: AgreementsState = { list: [] };

const agreementsSlice = createSlice({
  name: "agreements",
  initialState,
  reducers: {
    setAgreements: (state, action: PayloadAction<ContractDraft[]>) => {
      state.list = action.payload;
    },
    addAgreement: (state, action: PayloadAction<ContractDraft>) => {
      state.list.push(action.payload);
    },
    updateAgreement: (state, action: PayloadAction<ContractDraft>) => {
      const idx = state.list.findIndex(a => a.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeAgreement: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(a => a.id !== action.payload);
    },
  },
});

export const { setAgreements, addAgreement, updateAgreement, removeAgreement } = agreementsSlice.actions;
export default agreementsSlice.reducer;
