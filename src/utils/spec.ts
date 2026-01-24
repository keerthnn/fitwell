import axios from "axios";

export interface CreateProfileInput {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
}

export async function createUser(email: string, displayName: string) {
  const { data } = await axios.post("/api/auth/create-user", {
    email,
    displayName,
  });
  return data as { userName: string };
}

export async function createProfile(input: CreateProfileInput) {
  const { data } = await axios.post("/api/user/create-profile", input);
  return data as { success: true };
}

export async function getProfileStatus() {
  const { data } = await axios.get("/api/user/profile-status");
  return data as { hasProfile: boolean };
}