import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const API_URL = process.env.NEW_NEXT_PUBLIC_API_URL as string;

interface DraftSection {
  heading: string;
  text: string;
}

export interface Draft {
  title: string;
  sections: DraftSection[];
}

interface Party {
  name: string;
  email: string;
  phone: string;
}

interface Agreement {
  id?: string;
  pdf_url: string;
  status: string;
  draft: Draft;
  party_a: Party;
  party_b: Party;
}

interface AgreementState {
  loading: boolean;
  error: string | null;
  message: string | null;
  draft: Draft | null;
}

const initialState: AgreementState = {
  loading: false,
  error: null,
  message: null,
  draft: null,
};

const getErrorMessage = async (response: Response, defaultMsg: string) => {
  try {
    const data = await response.json();
    return data?.data?.message ?? defaultMsg;
  } catch {
    return defaultMsg;
  }
};


// 1. Create Agreement
// agreementsSlice.ts
export const createAgreement = createAsyncThunk<
  { message: string },
  { agreementData: Agreement; token: string }, 
  { rejectValue: string }
>("agreement/create", async ({ agreementData, token }, { rejectWithValue }) => {
  try {
    console.log("Creating agreement with data:", agreementData);

    const response = await fetch(`${API_URL}/api/agreements/create`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(agreementData),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Error creating agreement"));
    }

    const data = await response.json();
    return data.data;
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Error creating agreement");
  }
});

// 2. Delete Agreement
export const deleteAgreement = createAsyncThunk<
  { message: string },
  { agreement_id: string },
  { rejectValue: string }
>("agreement/delete", async ({ agreement_id }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agreement_id }),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Error deleting agreement"));

    const data = await response.json();
    return { message: data.data.message };
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Error deleting agreement");
  }
});

// 3. Duplicate Agreement
export const duplicateAgreement = createAsyncThunk<
  Draft,
  { agreement_id: string },
  { rejectValue: string }
>("agreement/duplicate", async ({ agreement_id }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/duplicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agreement_id }),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Error duplicating agreement"));

    const data = await response.json();
    return data.data.draft;
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Error duplicating agreement");
  }
});

// 4. Handle Signature
export const handleSignature = createAsyncThunk<
  { message: string },
  { agreement_id: string; decline_request: boolean; sign_request: boolean },
  { rejectValue: string }
>("agreement/handleSignature", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/handle-signature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Error handling signature"));

    const data = await response.json();
    return { message: data.data.message };
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Error handling signature");
  }
});

// --- Slice ---
const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {
    resetAgreementState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.draft = null;
    },
  },
  extraReducers: (builder) => {
    // Create
    builder.addCase(createAgreement.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(createAgreement.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(createAgreement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error creating agreement";
    });

    // Delete
    builder.addCase(deleteAgreement.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(deleteAgreement.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(deleteAgreement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error deleting agreement";
    });

    // Duplicate
    builder.addCase(duplicateAgreement.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
      state.draft = null;
    });
    builder.addCase(duplicateAgreement.fulfilled, (state, action) => {
      state.loading = false;
      state.draft = action.payload;
      state.message = "Agreement duplicated successfully";
    });
    builder.addCase(duplicateAgreement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error duplicating agreement";
    });

    // Signature
    builder.addCase(handleSignature.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(handleSignature.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(handleSignature.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error handling signature";
    });
  },
});

export const { resetAgreementState } = agreementSlice.actions;
export default agreementSlice.reducer;
