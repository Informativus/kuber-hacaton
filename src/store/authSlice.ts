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
  { name: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ name, password }, { rejectWithValue }) => {
  try {
    return await loginApi(name, password);
  } catch (err: any) {
    const message =
      typeof err?.response?.data?.message === "string"
        ? err.response.data.message
        : err.message;

    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  LoginResponse,
  { name: string; password: string; confirm: string; clusterCode?: string },
  { rejectValue: string }
>(
  "auth/register",
  async ({ name, password, confirm, clusterCode }, { rejectWithValue }) => {
    try {
      return await registerApi(name, password, confirm, clusterCode);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Register error";
      return rejectWithValue(message);
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

        const { roles, id } = a.payload.user;
        const name = a.meta.arg.name;
        localStorage.setItem("user", JSON.stringify({ name, roles, id }));
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
        const { roles, id } = a.payload.user;
        const name = a.meta.arg.name;
        localStorage.setItem("user", JSON.stringify({ name, roles, id }));
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Register error";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
