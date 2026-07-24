import { Button, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getUserProfile } from "fitness/utils/spec";
import type { Profile } from "fitness/utils/types";
import { formatHeight, formatWeight } from "fitness/utils/units";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>();
  useEffect(() => { void getUserProfile().then(setProfile); }, []);
  return (
    <AuthenticatedPage>
      <PageHeader title="Profile" action={{ label: "Edit profile", href: "/profile/edit" }} />
      {profile === undefined ? <LoadingState /> : profile ? (
        <Paper sx={{ p: 4, maxWidth: 720 }}>
          <Stack gap={2}>
            <Typography variant="h5">{profile.firstName} {profile.lastName}</Typography>
            <Typography color="text.secondary">{profile.experienceLevel} · {profile.fitnessGoal.replaceAll("_", " ")}</Typography>
            <Typography>Weekly target: {profile.weeklyWorkoutTarget} workouts</Typography>
            <Typography>Units: {profile.unitSystem.toLowerCase()}</Typography>
            {profile.heightCm && <Typography>Height: {formatHeight(profile.heightCm, profile.unitSystem)}</Typography>}
            {profile.currentWeightKg && <Typography>Weight: {formatWeight(profile.currentWeightKg, profile.unitSystem)}</Typography>}
          </Stack>
        </Paper>
      ) : <Button href="/onboarding">Complete onboarding</Button>}
    </AuthenticatedPage>
  );
}
