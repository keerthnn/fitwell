import { Add, Dashboard, FitnessCenter, MoreHoriz } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useRouter } from "next/router";

export default function MobileBottomNavigation({
  onMore,
}: {
  onMore: () => void;
}) {
  const router = useRouter();
  return (
    <Paper
      elevation={8}
      sx={{ display: { xs: "block", md: "none" }, position: "fixed", inset: "auto 0 0", zIndex: 1300 }}
    >
      <BottomNavigation value={router.pathname}>
        <BottomNavigationAction label="Home" value="/dashboard" icon={<Dashboard />} onClick={() => router.push("/dashboard")} />
        <BottomNavigationAction label="Workouts" value="/workouts" icon={<FitnessCenter />} onClick={() => router.push("/workouts")} />
        <BottomNavigationAction label="Start" value="/workouts/create" icon={<Add />} onClick={() => router.push("/workouts/create")} />
        <BottomNavigationAction label="More" value="more" icon={<MoreHoriz />} onClick={onMore} />
      </BottomNavigation>
    </Paper>
  );
}
