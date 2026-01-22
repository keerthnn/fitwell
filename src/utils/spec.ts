import axios from "axios";

export async function createUser(email: string, displayName: string) {
  const { data } = await axios.post("/api/auth/create-user", {
    email,
    displayName,
  });
  return data as { userName: string };
}