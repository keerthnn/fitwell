import { Box, Container } from "@mui/material";
import DesktopSidebar from "fitness/components/layout/DesktopSidebar";
import MobileBottomNavigation from "fitness/components/layout/MobileBottomNavigation";
import MobileMoreDrawer from "fitness/components/layout/MobileMoreDrawer";
import { useState, type ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <DesktopSidebar />
      <Box component="main" sx={{ ml: { md: "248px" }, pb: { xs: 10, md: 3 } }}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>{children}</Container>
      </Box>
      <MobileBottomNavigation onMore={() => setMoreOpen(true)} />
      <MobileMoreDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </Box>
  );
}
