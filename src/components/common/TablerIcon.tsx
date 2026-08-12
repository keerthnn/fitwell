import type { TablerIcon as TablerIconComponent } from "@tabler/icons-react";
import { SvgIcon, type SvgIconProps } from "@mui/material";

export interface TablerIconProps extends Omit<SvgIconProps, "component"> {
  icon: TablerIconComponent;
  variant?: "outline" | "filled";
}

export default function TablerIcon({
  icon,
  variant = "outline",
  sx,
  ...props
}: TablerIconProps) {
  return (
    <SvgIcon
      component={icon}
      inheritViewBox
      {...props}
      sx={[
        variant === "outline" ? { fill: "none" } : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
