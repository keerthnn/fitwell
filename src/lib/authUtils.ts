import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

import { auth, googleProvider } from "./firebaseConfig";
import { createUser } from "fitness/utils/spec";

export async function signInWithEmail(email: string, password: string) {
  if (!auth) return;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
}

export async function signInWithGoogle() {
  if (!auth || !googleProvider) return;
  try {
    const res = await signInWithPopup(auth, googleProvider);
    if (!res.user.email) throw new Error("Email is missing");
    await createUser(res.user.email, res.user.displayName ?? "");
  } catch (err) {
    console.error(err);
  }
}

export async function signUpUser(email: string, password: string) {
  if (!auth) return;
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (!res.user.email) throw new Error("Email is missing");
    await createUser(res.user.email, res.user.displayName ?? "");
    return res.user;
  } catch (err) {
    console.error(err);
  }
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
