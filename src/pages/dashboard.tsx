import {
  Typography,
  Container,
  Box,
  Paper,
  Stack,
} from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Track your progress and stay consistent with your goals
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Paper
              sx={{
                flex: "1 1 280px",
                p: 3,
                minHeight: 160,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h3" fontWeight={700}>
                0
              </Typography>
              <Typography sx={{ mt: 1, opacity: 0.9 }}>
                Workouts This Week
              </Typography>
            </Paper>

            <Paper
              sx={{
                flex: "1 1 280px",
                p: 3,
                minHeight: 160,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h3" fontWeight={700}>
                0
              </Typography>
              <Typography sx={{ mt: 1, opacity: 0.9 }}>
                Current Streak
              </Typography>
            </Paper>

            <Paper
              sx={{
                flex: "1 1 280px",
                p: 3,
                minHeight: 160,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h3" fontWeight={700}>
                0
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Total Workouts
              </Typography>
            </Paper>
          </Box>

          {/* Detail Section */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Paper
              sx={{
                flex: "2 1 520px",
                p: 4,
                minHeight: 320,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>

              <Box
                sx={{
                  minHeight: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">
                  Your workout history will appear here
                </Typography>
              </Box>
            </Paper>

            <Paper
              sx={{
                flex: "1 1 280px",
                p: 4,
                minHeight: 320,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Stats
              </Typography>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <Box>
                  <Typography color="text.secondary">
                    This Month
                  </Typography>
                  <Typography fontWeight={600}>
                    0 workouts
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary">
                    Best Streak
                  </Typography>
                  <Typography fontWeight={600}>
                    0 days
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary">
                    Average Weekly
                  </Typography>
                  <Typography fontWeight={600}>
                    0 sessions
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
