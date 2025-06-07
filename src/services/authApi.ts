export interface Role {
  id: string;
  name: string;
}

export interface UserInterface {
  username: string;
  roles: Role[];
}

export interface LoginResponse {
  user: UserInterface;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export function loginApi(
  username: string,
  password: string,
): Promise<LoginResponse> {
  console.log("[MOCK login] ", { username, password });
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: {
            username,
            roles: [{ id: "r-2", name: "user" }],
          },
        }),
      500,
    ),
  );
}

export function registerApi(
  username: string,
  password: string,
  confirm: string,
  clusterCode?: string,
): Promise<LoginResponse> {
  console.log("[MOCK register]", { username, password, confirm, clusterCode });
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: {
            username,
            roles: [{ id: "r-2", name: "user" }],
          },
        }),
      700,
    ),
  );
}
