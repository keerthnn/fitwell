import {
  Check,
  DarkMode,
  LightMode,
  SettingsBrightness,
} from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ThemePreference, useThemeMode } from "./ThemeModeProvider";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "light", label: "Light", icon: <LightMode fontSize="small" /> },
  { value: "dark", label: "Dark", icon: <DarkMode fontSize="small" /> },
  {
    value: "system",
    label: "System",
    icon: <SettingsBrightness fontSize="small" />,
  },
];

export default function ThemeModeSelector() {
  const { preference, resolvedMode, setPreference } = useThemeMode();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Tooltip title={`Theme: ${preference}`}>
        <IconButton
          color="inherit"
          aria-label="Choose color theme"
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          {resolvedMode === "dark" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={preference === option.value}
            onClick={() => {
              setPreference(option.value);
              setAnchor(null);
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.label}
            {preference === option.value && (
              <Check fontSize="small" sx={{ ml: "auto" }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
