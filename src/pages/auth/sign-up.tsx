import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "fitness/components/context";
import { signInWithGoogle, signUpUser } from "fitness/lib/authUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading && !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
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
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        {!user && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Create Your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start tracking your progress today
                </Typography>
              </Box>

              <form onSubmit={handleSignUp}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    helperText="Use at least 8 characters with a mix of letters and numbers"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>

              <Divider>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleSignUpWithGoogle}
              >
                Continue with Google
              </Button>

              <Box textAlign="center" pt={1}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    onClick={() => router.push("/auth/sign-in")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      minWidth: "auto",
                      verticalAlign: "baseline",
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
