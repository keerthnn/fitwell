import {
  Analytics,
  Barbell,
  ClipboardList,
  Dashboard,
  MessageCircle,
  Person,
  Settings,
  Stretching,
} from "fitness/components/common/icons";

export const primaryNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: Dashboard },
  { label: "Workouts", href: "/workouts", icon: Barbell },
  { label: "Workout Plans", href: "/workout-plans", icon: ClipboardList },
  { label: "Exercises", href: "/exercises", icon: Stretching },
  { label: "Analytics", href: "/analytics", icon: Analytics },
  { label: "Feedback", href: "/feedback", icon: MessageCircle },
  { label: "Profile", href: "/profile", icon: Person },
  { label: "Settings", href: "/settings", icon: Settings },
];
