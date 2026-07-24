import {
  Add,
  AdminPanelSettings,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { primaryNavigation } from "fitness/components/layout/navigation";
import { getAdminStatus } from "fitness/utils/spec";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    void getAdminStatus()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);
  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        inset: "0 auto 0 0",
        width: (theme) =>
          collapsed
            ? theme.fitwell.sidebarCollapsedWidth
            : theme.fitwell.sidebarWidth,
        background: "linear-gradient(180deg, #101827 0%, #0b1220 100%)",
        color: "white",
        px: collapsed ? 1 : 2,
        py: 2,
        flexDirection: "column",
        overflowX: "clip",
        overflowY: "auto",
        zIndex: (theme) => theme.zIndex.drawer,
        transition: (theme) =>
          theme.transitions.create("width", {
            duration: theme.transitions.duration.shorter,
          }),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        minHeight={64}
      >
        {!collapsed && (
          <Typography variant="h5" fontWeight={900} px={1}>
            Fit<span style={{ color: "#35c46a" }}>Well</span>
          </Typography>
        )}
        <IconButton
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          sx={{ color: "white" }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Stack>
      <Tooltip title={collapsed ? "Start workout" : ""} placement="right">
        <Button
          component={Link}
          href="/workouts/create"
          variant="contained"
          startIcon={collapsed ? undefined : <Add />}
          aria-label="Start workout"
          sx={{
            mb: 2,
            minHeight: 48,
            minWidth: 0,
            px: collapsed ? 1 : 2,
          }}
        >
          {collapsed ? <Add /> : "Start workout"}
        </Button>
      </Tooltip>
      <List sx={{ flex: 1 }}>
        {primaryNavigation.map(({ label, href, icon: Icon }) => (
          <Tooltip key={href} title={collapsed ? label : ""} placement="right">
            <ListItemButton
              component={Link}
              href={href}
              selected={router.pathname.startsWith(href)}
              sx={{
                borderRadius: 2,
                color: "inherit",
                mb: 0.5,
                px: collapsed ? 1.5 : 2,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: collapsed ? 0 : 40,
                  justifyContent: "center",
                }}
              >
                <Icon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      {isAdmin && (
        <Tooltip title={collapsed ? "Admin" : ""} placement="right">
          <ListItemButton
            component={Link}
            href="/system-admin"
            sx={{
              borderRadius: 2,
              px: collapsed ? 1.5 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: collapsed ? 0 : 40,
                justifyContent: "center",
              }}
            >
              <AdminPanelSettings />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Admin" />}
          </ListItemButton>
        </Tooltip>
      )}
    </Box>
  );
}
