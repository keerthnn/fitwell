import { AdminPanelSettings, Analytics, FitnessCenter, ListAlt, Menu, People, PlaylistAddCheck, Security } from "@mui/icons-material";
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
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
  const navigation = (
    <>
      <Toolbar><Typography variant="h6" fontWeight={800}>FitWell Admin</Typography></Toolbar>
      <List>
        {links.map(([href, label, Icon]) => (
          <ListItemButton component={Link} href={href} key={href} onClick={() => setMobileOpen(false)}>
            <ListItemIcon><Icon /></ListItemIcon><ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
  return (
    <AdminPageGuard>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar sx={{ display: { md: "none" } }}>
          <Toolbar><IconButton color="inherit" onClick={() => setMobileOpen(true)} aria-label="Open admin navigation"><Menu /></IconButton><Typography fontWeight={800}>FitWell Admin</Typography></Toolbar>
        </AppBar>
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: 280 } }}>
          {navigation}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width: 248, "& .MuiDrawer-paper": { width: 248 } }}>
          {navigation}
        </Drawer>
        <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 4 }, pt: { xs: 11, md: 4 } }}>{children}</Box>
      </Box>
    </AdminPageGuard>
  );
}
