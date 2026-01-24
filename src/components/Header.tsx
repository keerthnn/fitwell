import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import { signOutUser } from "fitness/lib/authUtils";
import { useAuth } from "./context";

export const HEADER_HEIGHT = 64;

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  // Profile menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(anchorEl);

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = (path: string) => {
    setAnchorEl(null);
    setDrawerOpen(false);
    router.push(path);
  };

  const logout = async () => {
    setAnchorEl(null);
    setDrawerOpen(false);
    await signOutUser();
    router.replace("/");
  };

  return (
    <AppBar position="fixed" sx={{ height: HEADER_HEIGHT }}>
      <Toolbar sx={{ minHeight: HEADER_HEIGHT }}>
        {/* LEFT SECTION */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
          {/* Mobile menu */}
          <IconButton
            edge="start"
            color="inherit"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            FitWell
          </Typography>

          {/* Desktop navbar */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/workouts")}>
              Workouts
            </Button>
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <IconButton
          color="inherit"
          onClick={(e: MouseEvent<HTMLElement>) =>
            setAnchorEl(e.currentTarget)
          }
        >
          <AccountCircle />
        </IconButton>

        {/* Profile menu */}
        <Menu
          anchorEl={anchorEl}
          open={profileOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {user ? (
            <>
              <MenuItem onClick={() => navigate("/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => navigate("/auth/sign-in")}>
              Login
            </MenuItem>
          )}
        </Menu>

        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 240 }}>
            <List>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemText primary="Home" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate("/workouts")}>
                <ListItemText primary="Workouts" />
              </ListItemButton>

              <Divider />

              {user && (
                <ListItemButton onClick={() => navigate("/profile")}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              )}

              {user ? (
                <ListItemButton onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              ) : (
                <ListItemButton onClick={() => navigate("/auth/sign-in")}>
                  <ListItemText primary="Login" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
