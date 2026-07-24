import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ProfileForm from "fitness/components/profile/ProfileForm";
import { createProfile, getUserProfile, updateProfile } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Profile } from "fitness/utils/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>();
  useEffect(() => { void getUserProfile().then(setProfile); }, []);
  return (
    <AuthenticatedPage>
      <Box minHeight="100vh" display="grid" sx={{ placeItems: "center", p: 2 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: { xs: 3, md: 5 } }}>
            <Stack gap={1} mb={4}>
              <Typography variant="h4" fontWeight={800}>Set up FitWell</Typography>
              <Typography color="text.secondary">Tell us how you train so your workout experience starts in the right place.</Typography>
            </Stack>
            {profile !== undefined && (
              <ProfileForm
                initial={profile}
                onboarding
                submitLabel="Finish setup"
                onSubmit={async (value) => {
                  if (profile) await updateProfile(value);
                  else await createProfile(value);
                  await router.push("/dashboard");
                }}
              />
            )}
          </Paper>
        </Container>
      </Box>
    </AuthenticatedPage>
  );
}
