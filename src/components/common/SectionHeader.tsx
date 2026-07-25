import { Typography } from "@mui/material";

export default function SectionHeader({ children }: { children: string }) {
  return <Typography variant="h6" component="h2" fontWeight={700} mb={2}>{children}</Typography>;
}
