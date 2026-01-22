import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@mui/material";
import { useAuth } from "fitness/components/context";
import { signInWithEmail, signInWithGoogle } from "../../lib/authUtils";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading && !user) {
    return <h1>Loading...</h1>;
  }

  if (!loading && user) {
    router.push("/");
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      console.error("signin failed", err);
      alert("Sign in failed");
    }
  }

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center place-items-center w-screen h-screen">
      {!user && (
        <div className="border-2 hover:bg-gray-100 text-black w-[30%] rounded-lg p-8 shadow-md">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl">Sign In</h1>
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Email"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "14px",
                  background: "#fff",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />

              <input
                type="password"
                placeholder="Password"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "14px",
                  background: "#fff",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Sign In
              </Button>
            </form>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 place-items-center">
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleSignInWithGoogle}
                  sx={{ textDecoration: "underline" }}
                >
                  Sign In with Google
                </Button>
              </div>

              <Button
                variant="text"
                color="primary"
                onClick={() => router.push("/auth/sign-up")}
                sx={{ textDecoration: "underline" }}
              >
                Don&apos;t have an account? Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
