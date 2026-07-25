import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { resetPassword } from "fitness/lib/authUtils";
import NextLink from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      setError(
        "We could not send a reset email. Check the address and try again.",
      );
    }
  }
  return (
    <Box minHeight="100vh" display="grid" sx={{ placeItems: "center", p: 2 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack component="form" onSubmit={submit} gap={3}>
            <Typography variant="h4" fontWeight={800}>
              Reset password
            </Typography>
            <Typography color="text.secondary">
              We will send password reset instructions to your email.
            </Typography>
            {sent && (
              <Alert severity="success">
                If the account exists, a reset email is on its way.
              </Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" variant="contained" size="large">
              Send reset email
            </Button>
            <Link component={NextLink} href="/auth/sign-in">
              Back to sign in
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
