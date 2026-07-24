import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { primaryNavigation } from "fitness/components/layout/navigation";
import Link from "next/link";

export default function MobileMoreDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <List sx={{ pb: 3 }}>
        {primaryNavigation.slice(2).map(({ label, href, icon: Icon }) => (
          <ListItemButton component={Link} href={href} key={href} onClick={onClose}>
            <ListItemIcon><Icon /></ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
