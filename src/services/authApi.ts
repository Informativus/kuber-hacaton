import api from "./api";

export interface Role {
  id: string;
  name: string;
  action: string;
}

export interface UserInterface {
  name: string;
  roles: Role[];
}

export interface LoginResponse {
  user: UserInterface;
}

interface ServerLoginResponse {
  id: number;
  name: string;
  roles: Role[];
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export async function loginApi(
  name: string,
  password: string,
): Promise<LoginResponse> {
  const result = await api.post<ServerLoginResponse>("auth/login", {
    name,
    password,
  });

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: {
            name,
            roles: [{ id: "r-2", name: "user", action: "read" }],
          },
        }),
      500,
    ),
  );
}

export async function registerApi(
  name: string,
  password: string,
  confirm: string,
  clusterCode?: string,
): Promise<LoginResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: {
            name,
            roles: [{ id: "r-2", name: "user", action: "read" }],
          },
        }),
      700,
    ),
  );
}
