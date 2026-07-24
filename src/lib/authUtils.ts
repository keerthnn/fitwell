import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";

import { auth, googleProvider } from "./firebaseConfig";

export async function signInWithEmail(email: string, password: string) {
  if (!auth) throw new Error("Authentication is not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  if (!auth || !googleProvider) throw new Error("Authentication is not configured");
  const res = await signInWithPopup(auth, googleProvider);
  if (!res.user.email) throw new Error("Email is missing");
  return res.user;
}

export async function signUpUser(email: string, password: string) {
  if (!auth) throw new Error("Authentication is not configured");
  const res = await createUserWithEmailAndPassword(auth, email, password);
  if (!res.user.email) throw new Error("Email is missing");
  return res.user;
}

export async function resetPassword(email: string) {
  if (!auth) throw new Error("Authentication is not configured");
  await sendPasswordResetEmail(auth, email);
}

export async function getCurrentUser() {
  if (!auth) return;
  try {
    const user = auth.currentUser;
    return user;
  } catch (e) {
    console.error(e);
  }
}

export async function signOutUser() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (e) {
    console.error(e);
  }
}

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
) => {
  if (!auth) return;
  return auth.onAuthStateChanged(callback);
};
