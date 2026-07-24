import {
  AdminPanelSettings,
  Analytics,
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  FitnessCenter,
  ListAlt,
  Menu,
  People,
  PlaylistAddCheck,
  Security,
  Settings,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
import { AdminPageGuard } from "./AdminPageGuard";
import ThemeModeSelector from "./ThemeModeSelector";

const links = [
  ["/system-admin", "Overview", AdminPanelSettings],
  ["/system-admin/users", "Users", People],
  ["/system-admin/exercises", "Exercises", FitnessCenter],
  ["/system-admin/workout-plans", "Workout Plans", PlaylistAddCheck],
  ["/system-admin/workouts", "Workouts", ListAlt],
  ["/system-admin/analytics", "Analytics", Analytics],
  ["/system-admin/admin-access", "Admin access", Security],
  ["/system-admin/audit-logs", "Audit logs", ListAlt],
  ["/system-admin/settings", "Settings", Settings],
] as const;

export function AdminLayoutContent({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const router = useRouter();
  const navigation = (
    collapsed = false,
    collapsible = false,
    onDarkSurface = false,
  ) => (
    <>
      <Toolbar sx={{ justifyContent: collapsed ? "center" : "space-between" }}>
        {!collapsed && (
          <Typography variant="h6" fontWeight={800}>
            FitWell Admin
          </Typography>
        )}
        {collapsible && (
          <IconButton
            color="inherit"
            onClick={() => setDesktopCollapsed((current) => !current)}
            aria-label={
              collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"
            }
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Toolbar>
      <List>
        {links.map(([href, label, Icon]) => (
          <ListItemButton
            component={Link}
            href={href}
            key={href}
            selected={
              router.pathname === href ||
              (href !== "/system-admin" && router.pathname.startsWith(href))
            }
            onClick={() => setMobileOpen(false)}
            aria-label={collapsed ? label : undefined}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              px: collapsed ? 1.5 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              ...(onDarkSurface && {
                "&.Mui-selected": {
                  bgcolor: (theme) => theme.fitwell.colors.sidebar.selected,
                  color: (theme) => theme.fitwell.colors.sidebar.selectedText,
                  "&:hover": {
                    bgcolor: (theme) => theme.fitwell.colors.sidebar.selected,
                  },
                },
              }),
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: collapsed ? 0 : 56,
                justifyContent: "center",
              }}
            >
              <Icon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary={label} />}
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto", px: collapsed ? 1 : 2, pb: 2 }}>
        <Button
          component={Link}
          href="/dashboard"
          color="inherit"
          startIcon={collapsed ? undefined : <ArrowBack />}
          aria-label="Back to FitWell"
          sx={{
            width: "100%",
            minWidth: 0,
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 1 : 2,
          }}
        >
          {collapsed ? <ArrowBack /> : "Back to FitWell"}
        </Button>
      </Box>
    </>
  );
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
        <AppBar
          sx={{
            display: { md: "none" },
            background: (theme) => theme.fitwell.colors.sidebar.gradient,
            color: "common.white",
            borderRadius: 0,
            border: 0,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin navigation"
            >
              <Menu />
            </IconButton>
            <Typography fontWeight={800} sx={{ flex: 1 }}>
              FitWell Admin
            </Typography>
            <ThemeModeSelector />
          </Toolbar>
        </AppBar>
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { md: "none" },
            "& .MuiDrawer-paper": {
              width: 280,
              background: (theme) => theme.fitwell.colors.sidebar.gradient,
              color: "common.white",
              border: 0,
              borderRadius: 0,
            },
          }}
        >
          {navigation(false, false, true)}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: (theme) =>
              desktopCollapsed
                ? theme.fitwell.sidebarCollapsedWidth
                : theme.fitwell.sidebarWidth,
            flexShrink: 0,
            transition: (theme) =>
              theme.transitions.create("width", {
                duration: theme.transitions.duration.shorter,
              }),
            "& .MuiDrawer-paper": {
              width: (theme) =>
                desktopCollapsed
                  ? theme.fitwell.sidebarCollapsedWidth
                  : theme.fitwell.sidebarWidth,
              background: (theme) => theme.fitwell.colors.sidebar.gradient,
              color: "white",
              border: 0,
              borderRadius: 0,
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.shorter,
                }),
            },
          }}
        >
          {navigation(desktopCollapsed, true, true)}
        </Drawer>
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              maxWidth: (theme) => theme.fitwell.contentMaxWidth,
              py: { xs: 11, md: 5 },
            }}
          >
            {children}
          </Container>
        </Box>
    </Box>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminPageGuard>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminPageGuard>
  );
}
