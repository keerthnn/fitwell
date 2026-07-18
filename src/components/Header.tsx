import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOutUser } from "fitness/lib/authUtils";
import { getAdminStatus } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import { useAuth } from "./context";
import ThemeModeSelector from "./ThemeModeSelector";

export const HEADER_HEIGHT = 64;

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const isAdmin = Boolean(user && adminUserId === user.uid);

  // Profile menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(anchorEl);

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (loading || !user) return;

    let active = true;

    getAdminStatus()
      .then(() => {
        if (active) setAdminUserId(user.uid);
      })
      .catch(() => {
        if (active) setAdminUserId(null);
      });

    return () => {
      active = false;
    };
  }, [loading, user]);

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
            sx={{ display: { xs: "inline-flex", lg: "none" } }}
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
            sx={{ display: { xs: "none", lg: "flex" } }}
          >
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/workouts")}>
              Workouts
            </Button>
            {user && (
              <Button color="inherit" onClick={() => navigate("/templates")}>
                Templates
              </Button>
            )}
            {user && (
              <Button color="inherit" onClick={() => navigate("/nutrition")}>
                Nutrition
              </Button>
            )}
            {user && (
              <Button color="inherit" onClick={() => navigate("/analytics")}>
                Analytics
              </Button>
            )}
            {user && (
              <Button color="inherit" onClick={() => navigate("/health")}>
                Health
              </Button>
            )}
            {user && (
              <Button color="inherit" onClick={() => navigate("/achievements")}>
                Achievements
              </Button>
            )}
            {isAdmin && (
              <Button color="inherit" onClick={() => navigate("/system-admin")}>
                Admin
              </Button>
            )}
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <ThemeModeSelector />
        <IconButton
          color="inherit"
          onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
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
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={logout} sx={{ color: "error.main" }}>
                Logout
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => navigate("/auth/sign-in")}>Login</MenuItem>
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

              {user && (
                <>
                  <ListItemButton onClick={() => navigate("/templates")}>
                    <ListItemText primary="Templates" />
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate("/nutrition")}>
                    <ListItemText primary="Nutrition" />
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate("/analytics")}>
                    <ListItemText primary="Analytics" />
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate("/achievements")}>
                    <ListItemText primary="Achievements" />
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate("/health")}>
                    <ListItemText primary="Health" />
                  </ListItemButton>
                </>
              )}

              {isAdmin && (
                <ListItemButton onClick={() => navigate("/system-admin")}>
                  <ListItemText primary="Admin" />
                </ListItemButton>
              )}

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
