import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  registerApi,
  LoginResponse,
  UserInterface,
} from "@/services/authApi";

interface AuthState {
  user: UserInterface | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    return await loginApi(username, password);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk<
  LoginResponse,
  { username: string; password: string; confirm: string; clusterCode?: string },
  { rejectValue: string }
>(
  "auth/register",
  async ({ username, password, confirm, clusterCode }, { rejectWithValue }) => {
    try {
      return await registerApi(username, password, confirm, clusterCode);
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
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "idle";
        s.user = a.payload.user;

        const { roles } = a.payload.user;
        const username = a.meta.arg.username;
        localStorage.setItem("user", JSON.stringify({ username, roles }));
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Login error";
      })

      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = "idle";
        s.user = a.payload.user;

        const { roles } = a.payload.user;
        const username = a.meta.arg.username;
        localStorage.setItem("user", JSON.stringify({ username, roles }));
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Register error";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
