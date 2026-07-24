import {
  AdminPanelSettings,
  Analytics,
  ChevronLeft,
  ChevronRight,
  FitnessCenter,
  ListAlt,
  Menu,
  People,
  PlaylistAddCheck,
  Security,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
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

const links = [
  ["/system-admin", "Overview", AdminPanelSettings],
  ["/system-admin/users", "Users", People],
  ["/system-admin/exercises", "Exercises", FitnessCenter],
  ["/system-admin/workout-plans", "Workout Plans", PlaylistAddCheck],
  ["/system-admin/workouts", "Workouts", ListAlt],
  ["/system-admin/analytics", "Analytics", Analytics],
  ["/system-admin/admin-access", "Admin access", Security],
  ["/system-admin/audit-logs", "Audit logs", ListAlt],
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const router = useRouter();
  const navigation = (collapsed = false, collapsible = false) => (
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
    </>
  );
  return (
    <AdminPageGuard>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar sx={{ display: { md: "none" } }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin navigation"
            >
              <Menu />
            </IconButton>
            <Typography fontWeight={800}>FitWell Admin</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: 280 } }}
        >
          {navigation()}
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
              bgcolor: "#101827",
              color: "white",
              border: 0,
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.shorter,
                }),
            },
          }}
        >
          {navigation(desktopCollapsed, true)}
        </Drawer>
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, md: 4 },
            pt: { xs: 11, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </AdminPageGuard>
  );
}
