import {
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOutUser } from "fitness/lib/authUtils";
import { useRouter } from "next/router";
import { MouseEvent, ReactNode, useState } from "react";
import { AdminSidebar, APP_HEADER_HEIGHT, SIDEBAR_WIDTH } from "./AdminSidebar";
import { useAuth } from "./context";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const navigate = (path: string) => {
    setAnchorEl(null);
    setMobileOpen(false);
    router.push(path);
  };

  const logout = async () => {
    setAnchorEl(null);
    await signOutUser();
    router.replace("/");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          height: APP_HEADER_HEIGHT,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: APP_HEADER_HEIGHT }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open admin navigation"
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, sm: 2 }}
            sx={{ flexGrow: 1, minWidth: 0 }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: 700, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              FitWell
            </Typography>
            <Typography
              variant="h6"
              noWrap
              sx={{ display: { xs: "none", sm: "block" }, fontWeight: 500, opacity: 0.9 }}
            >
              System Admin
            </Typography>
          </Stack>

          <IconButton
            color="inherit"
            aria-label="open profile menu"
            onClick={(event: MouseEvent<HTMLElement>) =>
              setAnchorEl(event.currentTarget)
            }
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => navigate("/dashboard")}>
              Back to App
            </MenuItem>
            {user && (
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            )}
            <MenuItem onClick={logout} sx={{ color: "error.main" }}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          mt: `${APP_HEADER_HEIGHT}px`,
          minHeight: `calc(100vh - ${APP_HEADER_HEIGHT}px)`,
          backgroundColor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
