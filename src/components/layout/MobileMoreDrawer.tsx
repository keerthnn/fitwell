import {
  AdminPanelSettings,
  Close,
  Logout,
  Palette,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import ThemeModeSelector from "fitness/components/ThemeModeSelector";
import { primaryNavigation } from "fitness/components/layout/navigation";
import { auth } from "fitness/lib/firebaseConfig";
import { getAdminStatus } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MobileMoreDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!open) return;
    void getAdminStatus()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, [open]);
  const links = primaryNavigation.filter(
    ({ href }) => !["/dashboard", "/workouts", "/exercises"].includes(href),
  );
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "24px 24px 0 0" } }}
    >
      <Box sx={{ px: 2, pt: 2, pb: "env(safe-area-inset-bottom)" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">More</Typography>
          <IconButton onClick={onClose} aria-label="Close menu">
            <Close />
          </IconButton>
        </Box>
        <List>
          {links.map(({ label, href, icon: Icon }) => (
            <ListItemButton
              component={Link}
              href={href}
              key={href}
              onClick={onClose}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
          {isAdmin && (
            <ListItemButton
              component={Link}
              href="/system-admin"
              onClick={onClose}
            >
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          )}
          <ListItem>
            <ListItemIcon>
              <Palette />
            </ListItemIcon>
            <ListItemText primary="Theme" />
            <ThemeModeSelector />
          </ListItem>
          <ListItemButton
            onClick={async () => {
              if (auth) await signOut(auth);
              onClose();
            }}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
