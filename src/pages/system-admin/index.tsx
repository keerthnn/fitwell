import { FitnessCenter, People, TrendingUp } from "@mui/icons-material";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";

export default function SystemAdminDashboard() {
  return (
    <AdminLayout>
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Overview of system resources and activity
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Paper sx={{ p: 3, flex: 1 }}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Total Users
                    </Typography>
                    <People sx={{ color: "primary.main" }} />
                  </Box>
                  <Typography variant="h3" fontWeight={700}>
                    —
                  </Typography>
                </Paper>
              </Paper>

              <Paper sx={{ p: 3, flex: 1 }}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Exercises
                    </Typography>
                    <FitnessCenter sx={{ color: "secondary.main" }} />
                  </Box>
                  <Typography variant="h3" fontWeight={700}>
                    —
                  </Typography>
                </Paper>
              </Paper>

              <Paper sx={{ p: 3, flex: 1 }}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Active Sessions
                    </Typography>
                    <TrendingUp sx={{ color: "success.main" }} />
                  </Box>
                  <Typography variant="h3" fontWeight={700}>
                    —
                  </Typography>
                </Paper>
              </Paper>
            </Stack>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the sidebar to navigate to Users or Exercises management.
              </Typography>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </AdminLayout>
  );
}
