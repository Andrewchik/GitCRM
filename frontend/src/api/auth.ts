import { request } from "./client";

export async function doLogin(email: string, password: string) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
}

export async function doRegister(email: string, password: string) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
}

export function logout() {
  localStorage.removeItem("token");
}
