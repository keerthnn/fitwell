import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { signOutUser } from "fitness/lib/authUtils";
import { useRouter } from "next/router";
import { useAuth } from "./context";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  async function handleLogout() {
    await signOutUser();
    router.replace("/"); 
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, cursor: "pointer", userSelect: "none" }}
          onClick={() => router.push("/")}
        >
          FitWell
        </Typography>

        <Stack direction="row" spacing={2}>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/profile")}
          >
            Profile
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
