import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginApi, registerApi, LoginResponse } from "@/services/authApi";

interface AuthState {
  accessToken: string | null;
  user: LoginResponse["user"] | null;
  uids: string[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  uids: [],
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await loginApi(email, password);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string; confirm: string; clusterCode?: string },
  { rejectValue: string }
>(
  "auth/registerUser",
  async ({ email, password, confirm, clusterCode }, { rejectWithValue }) => {
    try {
      return await registerApi(email, password, confirm, clusterCode);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.uids = [];
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("uids");
    },
    clearUids(state) {
      state.uids = [];
      localStorage.removeItem("uids");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a: PayloadAction<LoginResponse>) => {
        s.status = "idle";
        s.accessToken = a.payload.accessToken;
        s.user = a.payload.user;
        s.uids = a.payload.uids;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Login error";
      })

      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a: PayloadAction<LoginResponse>) => {
        s.status = "idle";
        s.accessToken = a.payload.accessToken;
        s.user = a.payload.user;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Register error";
      });
  },
});

export const { logout, clearUids } = authSlice.actions;
export default authSlice.reducer;
