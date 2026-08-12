import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBarbell,
  IconBolt,
  IconCalendarMonth,
  IconChartBar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircle,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconClipboardList,
  IconClock,
  IconCopy,
  IconDots,
  IconFlame,
  IconLayoutDashboard,
  IconListDetails,
  IconLogout,
  IconMenu2,
  IconMessageCircle,
  IconMoon,
  IconNotes,
  IconPalette,
  IconPencil,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconShieldLock,
  IconStopwatch,
  IconStretching,
  IconSun,
  IconSunMoon,
  IconTrash,
  IconUser,
  IconUsers,
  IconX,
  type TablerIcon as TablerIconComponent,
} from "@tabler/icons-react";
import type { SvgIconProps } from "@mui/material";
import TablerIcon from "fitness/components/common/TablerIcon";

function createIcon(
  icon: TablerIconComponent,
  displayName: string,
  variant: "outline" | "filled" = "outline",
) {
  function FitWellIcon(props: SvgIconProps) {
    return <TablerIcon icon={icon} variant={variant} {...props} />;
  }

  FitWellIcon.displayName = displayName;
  return FitWellIcon;
}

export const AccessTime = createIcon(IconClock, "AccessTime");
export const Add = createIcon(IconPlus, "Add");
export const AdminPanelSettings = createIcon(IconShieldLock, "AdminPanelSettings");
export const Analytics = createIcon(IconChartBar, "Analytics");
export const ArrowBack = createIcon(IconArrowLeft, "ArrowBack");
export const ArrowDownward = createIcon(IconArrowDown, "ArrowDownward");
export const ArrowForward = createIcon(IconArrowRight, "ArrowForward");
export const ArrowUpward = createIcon(IconArrowUp, "ArrowUpward");
export const BarChart = createIcon(IconChartBar, "BarChart");
export const Barbell = createIcon(IconBarbell, "Barbell");
export const Bolt = createIcon(IconBolt, "Bolt");
export const CalendarMonth = createIcon(IconCalendarMonth, "CalendarMonth");
export const Check = createIcon(IconCheck, "Check");
export const CheckCircle = createIcon(
  IconCircleCheckFilled,
  "CheckCircle",
  "filled",
);
export const CheckCircleOutline = createIcon(
  IconCircleCheck,
  "CheckCircleOutline",
);
export const ChevronLeft = createIcon(IconChevronLeft, "ChevronLeft");
export const ChevronRight = createIcon(IconChevronRight, "ChevronRight");
export const Circle = createIcon(IconCircle, "Circle");
export const CircleCheckFilled = createIcon(
  IconCircleCheckFilled,
  "CircleCheckFilled",
  "filled",
);
export const Clear = createIcon(IconX, "Clear");
export const ClipboardList = createIcon(IconClipboardList, "ClipboardList");
export const Close = createIcon(IconX, "Close");
export const ContentCopy = createIcon(IconCopy, "ContentCopy");
export const DarkMode = createIcon(IconMoon, "DarkMode");
export const Dashboard = createIcon(IconLayoutDashboard, "Dashboard");
export const Delete = createIcon(IconTrash, "Delete");
export const DeleteOutline = createIcon(IconTrash, "DeleteOutline");
export const Edit = createIcon(IconPencil, "Edit");
export const LightMode = createIcon(IconSun, "LightMode");
export const ListAlt = createIcon(IconListDetails, "ListAlt");
export const LocalFireDepartment = createIcon(IconFlame, "LocalFireDepartment");
export const Logout = createIcon(IconLogout, "Logout");
export const Menu = createIcon(IconMenu2, "Menu");
export const MessageCircle = createIcon(IconMessageCircle, "MessageCircle");
export const MoreHoriz = createIcon(IconDots, "MoreHoriz");
export const Notes = createIcon(IconNotes, "Notes");
export const Palette = createIcon(IconPalette, "Palette");
export const Pause = createIcon(IconPlayerPause, "Pause");
export const People = createIcon(IconUsers, "People");
export const Person = createIcon(IconUser, "Person");
export const PlayArrow = createIcon(IconPlayerPlay, "PlayArrow");
export const Replay = createIcon(IconRefresh, "Replay");
export const Schedule = createIcon(IconClock, "Schedule");
export const Search = createIcon(IconSearch, "Search");
export const Security = createIcon(IconShieldCheck, "Security");
export const Settings = createIcon(IconSettings, "Settings");
export const SettingsBrightness = createIcon(IconSunMoon, "SettingsBrightness");
export const Stopwatch = createIcon(IconStopwatch, "Stopwatch");
export const Stretching = createIcon(IconStretching, "Stretching");
