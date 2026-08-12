import { Box, Container } from "@mui/material";
import DesktopSidebar from "fitness/components/layout/DesktopSidebar";
import MobileBottomNavigation from "fitness/components/layout/MobileBottomNavigation";
import MobileMoreDrawer from "fitness/components/layout/MobileMoreDrawer";
import {
  RestTimerSurface,
  useRestTimer,
} from "fitness/components/RestTimerProvider";
import { isRestTimerSurfaceVisible } from "fitness/utils/restTimer";
import { useState, type ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [restTimerHeight, setRestTimerHeight] = useState(0);
  const { timer, completionVisible } = useRestTimer();
  const hasRestTimerSurface = isRestTimerSurfaceVisible(
    timer,
    completionVisible,
  );
  const reservedTimerHeight = hasRestTimerSurface
    ? Math.max(restTimerHeight, 72)
    : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: { xs: "block", md: "flex" },
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: (theme) =>
            sidebarCollapsed
              ? theme.fitwell.sidebarCollapsedWidth
              : theme.fitwell.sidebarWidth,
          flex: (theme) =>
            `0 0 ${
              sidebarCollapsed
                ? theme.fitwell.sidebarCollapsedWidth
                : theme.fitwell.sidebarWidth
            }px`,
          transition: (theme) =>
            theme.transitions.create(["width", "flex-basis"], {
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        <DesktopSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          width: { xs: "100%", md: "auto" },
          pb: (theme) => ({
            xs: `calc(${theme.fitwell.mobileNavigationHeight}px + ${
              hasRestTimerSurface ? reservedTimerHeight + 24 : 16
            }px + env(safe-area-inset-bottom))`,
            md: hasRestTimerSurface
              ? `${reservedTimerHeight + 32}px`
              : theme.spacing(3),
          }),
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: (theme) => theme.fitwell.contentMaxWidth,
            py: { xs: 3, md: 5 },
          }}
        >
          {children}
        </Container>
      </Box>
      <RestTimerSurface onHeightChange={setRestTimerHeight} />
      <MobileBottomNavigation onMore={() => setMoreOpen(true)} />
      <MobileMoreDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </Box>
  );
}
