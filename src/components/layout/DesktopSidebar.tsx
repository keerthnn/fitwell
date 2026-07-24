import { Add, Settings } from "@mui/icons-material";
import { Box, Button, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { primaryNavigation } from "fitness/components/layout/navigation";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DesktopSidebar() {
  const router = useRouter();
  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        inset: "0 auto 0 0",
        width: 248,
        bgcolor: "#101827",
        color: "white",
        p: 2,
        flexDirection: "column",
        zIndex: 1200,
      }}
    >
      <Typography variant="h5" fontWeight={900} px={1} py={2}>FitWell</Typography>
      <Button component={Link} href="/workouts/create" variant="contained" startIcon={<Add />} sx={{ mb: 2, minHeight: 48 }}>
        Start workout
      </Button>
      <List sx={{ flex: 1 }}>
        {primaryNavigation.map(({ label, href, icon: Icon }) => (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            selected={router.pathname.startsWith(href)}
            sx={{ borderRadius: 2, color: "inherit", mb: 0.5 }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><Icon /></ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <ListItemButton component={Link} href="/settings" sx={{ borderRadius: 2 }}>
        <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><Settings /></ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </Box>
  );
}
