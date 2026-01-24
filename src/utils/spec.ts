import axios from "axios";
import { Profile } from "./types";

export async function createUser(email: string, displayName: string) {
  const { data } = await axios.post("/api/auth/create-user", {
    email,
    displayName,
  });
  return data as { userName: string };
}

export async function createProfile(input: Profile) {
  const { data } = await axios.post("/api/user/create-profile", input);
  return data as { success: true };
}

export async function getProfileStatus() {
  const { data } = await axios.get("/api/user/get-profile-status");
  return data as { hasProfile: boolean };
}

export async function getUserProfile() {
  const { data } = await axios.get("/api/user/get-user-profile");
  return data as Profile | null;
}

export async function updateProfile(input: Profile) {
  const { data } = await axios.post("/api/user/update-profile", input);
  return data as { success: true };
}

export async function deleteProfile() {
  const { data } = await axios.delete("/api/user/delete-profile");
  return data as { success: true };
}
