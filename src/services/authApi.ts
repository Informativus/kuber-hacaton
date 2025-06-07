export interface Role {
  id: string;
  name: string;
  action: string;
}

export interface UserInterface {
  id: string;
  username: string;
  roles: Role[];
}

export interface LoginResponse {
  accessToken: string;
  user: UserInterface;
  uids: string[];
}

export function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  console.log("[MOCK login] ", { email, password });
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          accessToken: "mocked-access-token-123",
          user: {
            id: "u-1",
            username: email,
            roles: [{ id: "r-2", name: "user", action: "read" }],
          },
          uids: ["dashboard-uid-001"],
        }),
      500
    )
  );
}

export function registerApi(
  email: string,
  password: string,
  confirm: string,
  clusterCode?: string
): Promise<LoginResponse> {
  console.log("[MOCK register]", { email, password, confirm, clusterCode });
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          accessToken: "mocked-access-token-NEW",
          user: {
            id: "u-NEW",
            username: email,
            roles: [{ id: "r-2", name: "user", action: "read" }],
          },
          uids: ["dashboard-uid-NEW"],
        }),
      700
    )
  );
}
