import {
  Add,
  Barbell,
  Dashboard,
  MoreHoriz,
  Stretching,
} from "fitness/components/common/icons";
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
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        inset: "auto 0 0",
        zIndex: (theme) => theme.zIndex.appBar,
        pb: "env(safe-area-inset-bottom)",
        borderRadius: "20px 20px 0 0",
      }}
    >
      <BottomNavigation value={router.pathname}>
        <BottomNavigationAction
          label="Home"
          value="/dashboard"
          icon={<Dashboard />}
          onClick={() => router.push("/dashboard")}
        />
        <BottomNavigationAction
          label="Workouts"
          value="/workouts"
          icon={<Barbell />}
          onClick={() => router.push("/workouts")}
        />
        <BottomNavigationAction
          label="Start"
          value="/workouts/create"
          icon={<Add />}
          onClick={() => router.push("/workouts/create")}
          sx={{
            color: "primary.main",
            "& .MuiSvgIcon-root": {
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 0.75,
              width: 40,
              height: 40,
              mt: -2,
            },
          }}
        />
        <BottomNavigationAction
          label="Exercises"
          value="/exercises"
          icon={<Stretching />}
          onClick={() => router.push("/exercises")}
        />
        <BottomNavigationAction
          label="More"
          value="more"
          icon={<MoreHoriz />}
          onClick={onMore}
        />
      </BottomNavigation>
    </Paper>
  );
}
