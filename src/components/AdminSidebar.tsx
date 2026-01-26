import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FitnessCenter as FitnessCenterIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";

export const SIDEBAR_WIDTH = 240;
export const APP_HEADER_HEIGHT = 64;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/system-admin", icon: <DashboardIcon /> },
  { label: "Users", href: "/system-admin/users", icon: <PeopleIcon /> },
  { label: "Exercises", href: "/system-admin/exercises", icon: <FitnessCenterIcon /> },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = (href: string) =>
    href === "/system-admin"
      ? router.pathname === href
      : router.pathname.startsWith(href);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Title */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          fontSize: "1.125rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        System Admin
      </Box>

      {/* Nav */}
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={isMobile ? onMobileClose : undefined}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.25,
                  color: active ? "primary.main" : "text.secondary",
                  backgroundColor: active ? "primary.light" : "transparent",
                  "&:hover": {
                    backgroundColor: active
                      ? "primary.light"
                      : "action.hover",
                  },
                  "& .MuiListItemIcon-root": {
                    color: active ? "primary.main" : "text.secondary",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9375rem",
                    fontWeight: active ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  const drawerSx = {
    "& .MuiDrawer-paper": {
      width: SIDEBAR_WIDTH,
      boxSizing: "border-box",
      borderRight: 1,
      borderColor: "divider",
      top: APP_HEADER_HEIGHT,
      height: `calc(100vh - ${APP_HEADER_HEIGHT}px)`,
    },
  };

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          ...drawerSx,
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          ...drawerSx,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
