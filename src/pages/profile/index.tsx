import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getUserProfile } from "fitness/utils/spec";
import { type Profile } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const data = await getUserProfile();
      if (!data) {
        router.push("/profile/edit");
        return;
      }
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  if (loading || !profile) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, sm: 8 },
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                My Profile
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/profile/edit")}
              >
                Edit Profile
              </Button>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Personal Information
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    First Name
                  </Typography>
                  <Typography fontWeight={500}>{profile.firstName}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Name
                  </Typography>
                  <Typography fontWeight={500}>{profile.lastName}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography fontWeight={500}>
                    {profile.gender || "Not specified"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Age
                  </Typography>
                  <Typography fontWeight={500}>
                    {profile.age || "Not specified"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Physical Profile
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Height
                  </Typography>
                  <Typography fontWeight={500}>
                    {profile.heightCm
                      ? `${profile.heightCm} cm`
                      : "Not specified"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography fontWeight={500}>
                    {profile.weightKg
                      ? `${profile.weightKg} kg`
                      : "Not specified"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Goal */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Your Goal
              </Typography>
              <Typography>{profile.goal || "No goal specified"}</Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
