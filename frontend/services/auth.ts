import api from "./api";

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("authToken", response.data.token);
  return response.data;
}

export async function register(email: string, password: string) {
  return api.post("/auth/register", { email, password });
}

export function logout() {
  localStorage.removeItem("authToken");
}
