import {
  Analytics,
  Dashboard,
  FitnessCenter,
  Person,
  PlaylistAddCheck,
} from "@mui/icons-material";

export const primaryNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: Dashboard },
  { label: "Workouts", href: "/workouts", icon: FitnessCenter },
  { label: "Workout Plans", href: "/workout-plans", icon: PlaylistAddCheck },
  { label: "Analytics", href: "/analytics", icon: Analytics },
  { label: "Profile", href: "/profile", icon: Person },
];
