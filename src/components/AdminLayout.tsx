import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useState } from "react";
import { AdminSidebar, APP_HEADER_HEIGHT, SIDEBAR_WIDTH } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {children}
      </Box>
    </Box>
  );
}
