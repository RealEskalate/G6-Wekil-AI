// store/slices/aiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FinalPreviewResponse, Intake } from "@/types/BackendTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
import {ApiContractDraft} from "@/types/BackendTypes";
// --- Types ---
export interface Party {
  name: string;
  address: string;
  email: string;
}

export interface Section {
  heading: string;
  description: string;
}

export interface ContractDraft {
  title: string;
  party1: Party;
  party2: Party;
  sections: Section[];
  sign1: string;
  sign2: string;
  place: string;
  date: string;
}

// --- Backend Format ---


// --- Mapper: Backend → Frontend Draft ---
export function mapBackendToDraft(
  backend: ApiContractDraft,
  party1: Party,
  party2: Party
): ContractDraft {
  return {
    title: backend.title,
    party1,
    party2,
    sections: backend.sections.map((s): Section => ({
      heading: s.heading,
      description: s.text,
    })),
    sign1: backend.signatures.party_a,
    sign2: backend.signatures.party_b,
    place: backend.signatures.place,
    date: backend.signatures.date,
  };
}

// --- State ---
interface ClassificationResponse {
  category: string;
  reasons?: string[];
}

interface AIState {
  intake: Record<string, unknown> | null;
  draft: ApiContractDraft | null;
  final: FinalPreviewResponse | null; 
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AIState = {
  intake: null,
  draft: null,
  final: null,
  loading: false,
  error: null,
  message: null,
};
interface GenerateDraftPayload {
  intake: Intake;
  language?: "en" | "am";
}


// --- Utility function for fetch errors ---
const getErrorMessage = async (response: Response, defaultMsg: string) => {
  try {
    const data = await response.json();
    return data?.message ?? defaultMsg;
  } catch {
    return defaultMsg;
  }
};

// --- Async thunks ---
export const classifyApi = createAsyncThunk<
  ClassificationResponse,
  { text: string; language: "am" | "en" },
  { rejectValue: string }
>("ai/classify", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok)
      throw new Error(await getErrorMessage(response, "Classification failed"));
    return (await response.json()) as ClassificationResponse;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Classification failed"
    );
  }
});

export const extractIntake = createAsyncThunk<
  Record<string, unknown>,
  { text: string; language: "am" | "en" },
  { rejectValue: string }
>("ai/extract", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok)
      throw new Error(await getErrorMessage(response, "Extraction failed"));
    return (await response.json()) as Record<string, unknown>;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Extraction failed"
    );
  }
});

export const generateDraft = createAsyncThunk<
  ApiContractDraft,
  GenerateDraftPayload,
  { rejectValue: string }
>("ai/draft", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(await getErrorMessage(response, "Draft generation failed"));

    const data = await response.json();
    console.log("Draft generation response data:", data);
    return data.data as ApiContractDraft;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Draft generation failed"
    );
  }
});


export const updateDraftFromPrompt = createAsyncThunk<
  ApiContractDraft,
  { draft: string; prompt: string; language: string },
  { rejectValue: string }
>("ai/draftFromPrompt", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/draft-from-prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(await getErrorMessage(response, "Draft update failed"));

    const data = await response.json();
    return data.data as ApiContractDraft;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Draft update failed"
    );
  }
});

export const finalPreview = createAsyncThunk<
  FinalPreviewResponse,
  { draft: string; parties: Party[]; language: string },
  { rejectValue: string }
>("ai/finalPreview", async (payload, { rejectWithValue }) => {
  try {
    console.log("Final preview payload:", payload);
    const response = await fetch(`${API_URL}/ai/final-preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(await getErrorMessage(response, "Final preview failed"));

    const data = await response.json();
    
    return data.data as FinalPreviewResponse;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Final preview failed"
    );
  }
});

// --- Slice ---
const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    resetAIState: (state) => {
      state.intake = null;
      state.draft = null;
      state.final = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AIState) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    };
    const handleRejected = (
      state: AIState,
      action: PayloadAction<string | undefined>
    ) => {
      state.loading = false;
      state.error = action.payload ?? "Operation failed";
    };

    builder.addCase(classifyApi.pending, handlePending);
    builder.addCase(classifyApi.fulfilled, (state) => {
      state.loading = false;
      state.message = "Classification successful";
    });
    builder.addCase(classifyApi.rejected, handleRejected);

    builder.addCase(extractIntake.pending, handlePending);
    builder.addCase(extractIntake.fulfilled, (state, action) => {
      state.loading = false;
      state.intake = action.payload;
      state.message = "Intake extracted successfully";
    });
    builder.addCase(extractIntake.rejected, handleRejected);

    builder.addCase(generateDraft.pending, handlePending);
    builder.addCase(generateDraft.fulfilled, (state, action) => {
      state.loading = false;
      state.draft = action.payload;
      state.message = "Draft generated successfully";
    });
    builder.addCase(generateDraft.rejected, handleRejected);

    builder.addCase(updateDraftFromPrompt.pending, handlePending);
    builder.addCase(updateDraftFromPrompt.fulfilled, (state, action) => {
      state.loading = false;
      state.draft = action.payload;
      state.message = "Draft updated successfully";
    });
    builder.addCase(updateDraftFromPrompt.rejected, handleRejected);

    builder.addCase(finalPreview.pending, handlePending);
    // Inside extraReducers
builder.addCase(finalPreview.fulfilled, (state, action) => {
  state.loading = false;
  // Store the final response directly
  state.final = action.payload;
  state.message = "Final preview ready";

  // Optionally, you can also extract classification info:
  // state.classification = action.payload.classification;
});

    builder.addCase(finalPreview.rejected, handleRejected);
  },
});

export const { resetAIState } = aiSlice.actions;
export default aiSlice.reducer;