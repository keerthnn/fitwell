import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/context";
import { signInWithGoogle, signUpUser } from "../../lib/authUtils";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading && !user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!loading && user) {
    router.push("/");
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signUpUser(email, password);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSignUpWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      {!user && (
        <Paper
          elevation={3}
          sx={{
            width: { xs: "90%", sm: "400px" },
            p: 4,
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold">
              Sign Up
            </Typography>

            <form onSubmit={handleSignUp}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Sign Up
                </Button>
              </Stack>
            </form>

            <Stack spacing={1} alignItems="center">
              <Button
                variant="text"
                color="primary"
                onClick={handleSignUpWithGoogle}
                sx={{ textDecoration: "underline" }}
              >
                Sign Up with Google
              </Button>

              <Button
                variant="text"
                color="primary"
                onClick={() => router.push("/auth/sign-in")}
                sx={{ textDecoration: "underline" }}
              >
                Already have an account? Sign In
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
