// store/slices/aiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ContractFormat } from "@/types/Contracttype";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface AIState {
  intake: unknown | null;
  draft: ContractFormat | null;
  final: ContractFormat | null;
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
export const extractIntake = createAsyncThunk<
  unknown,
  { text: string; language: string },
  { rejectValue: string }
>("ai/extract", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Extraction failed"));

    const data = await response.json();
    return data.data;
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Extraction failed");
  }
});

export const generateDraft = createAsyncThunk<
  ContractFormat,
  unknown,
  { rejectValue: string }
>("ai/draft", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake: payload }),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Draft generation failed"));

    const data = await response.json();
    return data.data;
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Draft generation failed");
  }
});

export const updateDraftFromPrompt = createAsyncThunk<
  ContractFormat,
  { draft_id: string; prompt: string; language: string },
  { rejectValue: string }
>("ai/draftFromPrompt", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/draft-from-prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Draft update failed"));

    const data = await response.json();
    return data.data;
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Draft update failed");
  }
});

export const finalPreview = createAsyncThunk<
  ContractFormat,
  { draft_id: string; parties: unknown[] },
  { rejectValue: string }
>("ai/finalPreview", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/final-preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await getErrorMessage(response, "Final preview failed"));

    const data = await response.json();
    return data.data;
  } catch (err: unknown) {
    return rejectWithValue(err instanceof Error ? err.message : "Final preview failed");
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
    // --- Extract Intake ---
    builder.addCase(extractIntake.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(extractIntake.fulfilled, (state, action: PayloadAction<unknown>) => {
      state.loading = false;
      state.intake = action.payload;
      state.message = "Intake extracted successfully";
    });
    builder.addCase(extractIntake.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload ?? "Extraction failed";
    });

    // --- Generate Draft ---
    builder.addCase(generateDraft.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(generateDraft.fulfilled, (state, action: PayloadAction<ContractFormat>) => {
      state.loading = false;
      state.draft = action.payload;
      state.message = "Draft generated successfully";
    });
    builder.addCase(generateDraft.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload ?? "Draft generation failed";
    });

    // --- Update Draft from Prompt ---
    builder.addCase(updateDraftFromPrompt.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(updateDraftFromPrompt.fulfilled, (state, action: PayloadAction<ContractFormat>) => {
      state.loading = false;
      state.draft = action.payload;
      state.message = "Draft updated successfully";
    });
    builder.addCase(updateDraftFromPrompt.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload ?? "Draft update failed";
    });

    // --- Final Preview ---
    builder.addCase(finalPreview.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(finalPreview.fulfilled, (state, action: PayloadAction<ContractFormat>) => {
      state.loading = false;
      state.final = action.payload;
      state.message = "Final preview ready";
    });
    builder.addCase(finalPreview.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload ?? "Final preview failed";
    });
  },
});

export const { resetAIState } = aiSlice.actions;
export default aiSlice.reducer;
