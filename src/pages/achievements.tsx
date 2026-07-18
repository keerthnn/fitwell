import {
  Box,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import { getAchievements } from "fitness/utils/spec";
import { useEffect, useState } from "react";

type Item = Awaited<ReturnType<typeof getAchievements>>[number];

export default function AchievementsPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => {
    getAchievements().then(setItems);
  }, []);
  return (
    <AuthenticatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Achievements</Typography>
        <Typography color="text.secondary" mb={3}>
          Milestones earned across training, nutrition, and community.
        </Typography>
        {!items ? (
          <LinearProgress />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                md: "repeat(3,1fr)",
              },
              gap: 2,
            }}
          >
            {items.map((item) => (
              <Paper
                key={item.key}
                sx={{ p: 3, opacity: item.earned ? 1 : 0.55 }}
              >
                <Typography fontSize={40}>{item.icon}</Typography>
                <Typography variant="h6">{item.name}</Typography>
                <Typography color="text.secondary" minHeight={48}>
                  {item.description}
                </Typography>
                <Chip
                  sx={{ mt: 2 }}
                  color={item.earned ? "success" : "default"}
                  label={
                    item.earned
                      ? `Earned ${new Date(item.awardedAt!).toLocaleDateString()}`
                      : "Locked"
                  }
                />
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </AuthenticatedPage>
  );
}
