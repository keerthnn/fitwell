import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { signOutUser } from "fitness/lib/authUtils";
import { useAuth } from "./context";

export default function Header() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Fitwell</Typography>
        <Button color="inherit" onClick={signOutUser}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
