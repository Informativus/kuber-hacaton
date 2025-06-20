import api from "./api";

export interface Role {
  id: string;
  name: string;
}

export interface UserInterface {
  id: number;
  name: string;
  roles: Role[];
  createdAt: string;
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

  return {
    user: {
      id: result.data.id,
      name: result.data.name,
      roles: result.data.roles,
      createdAt: result.data.createdAt,
    },
  };
}

export async function registerApi(
  name: string,
  password: string,
  confirm: string,
  clusterCode?: string,
): Promise<LoginResponse> {
  const result = await api.post<ServerLoginResponse>("auth/register", {
    name,
    password,
  });

  return {
    user: {
      id: result.data.id,
      name: result.data.name,
      roles: result.data.roles,
      createdAt: result.data.createdAt,
    },
  };
}
