import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOutUser } from "fitness/lib/authUtils";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import { useAuth } from "./context";

export const HEADER_HEIGHT = 64;

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOutUser();
    router.replace("/");
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, height: HEADER_HEIGHT }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: `${HEADER_HEIGHT}px !important`,
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => router.push(user ? "/dashboard" : "/")}
        >
          FitWell
        </Typography>

        {/* Account Menu (desktop + mobile) */}
        <Stack direction="row">
          <IconButton
            color="inherit"
            aria-label="account menu"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {user ? (
              <>
                <MenuItem onClick={() => handleNavigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => handleNavigate("/auth/sign-in")}>
                Login
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
