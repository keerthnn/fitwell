import { ArrowForward } from "fitness/components/common/icons";
import StatusChip from "fitness/components/common/StatusChip";
import { feedbackCategoryLabel } from "fitness/utils/feedback";
import type {
  AdminFeedbackListItem,
  FeedbackListItem,
} from "fitness/utils/types";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function FeedbackList({
  items,
  hrefPrefix,
}: {
  items: Array<FeedbackListItem | AdminFeedbackListItem>;
  hrefPrefix: "/feedback" | "/system-admin/feedback";
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Stack divider={<Divider flexItem />}>
        {items.map((item) => {
          const adminItem = "user" in item ? item : null;
          return (
            <Box
              key={item.id}
              component={Link}
              href={`${hrefPrefix}/${item.id}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: { xs: 2, sm: 2.5 },
                color: "inherit",
                textDecoration: "none",
                transition: "background-color 120ms ease",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Stack gap={0.75} minWidth={0}>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <StatusChip status={item.status} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={feedbackCategoryLabel(item.category)}
                  />
                </Stack>
                <Typography fontWeight={750} noWrap>
                  {item.subject}
                </Typography>
                {adminItem && (
                  <Typography color="text.secondary" variant="body2" noWrap>
                    {adminItem.user.displayName ?? adminItem.user.email} ·{" "}
                    {adminItem.user.email}
                  </Typography>
                )}
                <Typography
                  color="text.secondary"
                  variant="body2"
                  noWrap
                  sx={{ maxWidth: { xs: "65vw", sm: 640 } }}
                >
                  {item.lastMessagePreview}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  Updated {new Date(item.lastMessageAt).toLocaleString()}
                </Typography>
              </Stack>
              <ArrowForward sx={{ color: "text.secondary", flexShrink: 0 }} />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
