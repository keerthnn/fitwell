import { Alert, Box, Button, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ConfirmDialog from "fitness/components/common/ConfirmDialog";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutActivityCalendar from "fitness/components/profile/WorkoutActivityCalendar";
import { signOutUser } from "fitness/lib/authUtils";
import {
  deleteAccount,
  getUserProfile,
  getWorkoutActivity,
} from "fitness/utils/spec";
import type {
  Profile,
  WorkoutActivityCalendarResponse,
} from "fitness/utils/types";
import { formatCount } from "fitness/utils/copy";
import { formatHeight, formatWeight } from "fitness/utils/units";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>();
  const [activity, setActivity] =
    useState<WorkoutActivityCalendarResponse>();
  const [error, setError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const loadActivity = useCallback(() => {
    setActivity(undefined);
    setActivityError("");
    void getWorkoutActivity()
      .then(setActivity)
      .catch(() => setActivityError("Your workout activity could not be loaded."));
  }, []);

  useEffect(() => {
    void getUserProfile()
      .then(setProfile)
      .catch(() => setError("Your profile could not be loaded."));
    void getWorkoutActivity()
      .then(setActivity)
      .catch(() => setActivityError("Your workout activity could not be loaded."));
  }, []);
  return (
    <AuthenticatedPage>
      <PageHeader title="Profile" />
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        <Paper variant="outlined">
          <Tabs
            value={activeTab}
            onChange={(_event, value: number) => setActiveTab(value)}
            aria-label="Profile sections"
            variant="fullWidth"
          >
            <Tab id="profile-tab-0" aria-controls="profile-panel-0" label="Profile" />
            <Tab
              id="profile-tab-1"
              aria-controls="profile-panel-1"
              label="Delete account"
            />
          </Tabs>

          <Box
            role="tabpanel"
            id="profile-panel-0"
            aria-labelledby="profile-tab-0"
            hidden={activeTab !== 0}
            sx={{ p: { xs: 2, sm: 4 } }}
          >
            {activeTab === 0 && (
              <Stack gap={3}>
                {error ? (
                  <ErrorState message={error} />
                ) : profile === undefined ? (
                  <LoadingState />
                ) : profile ? (
                  <Stack gap={2}>
                    <Typography variant="h5">
                      {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography color="text.secondary">
                      {profile.experienceLevel} ·{" "}
                      {profile.fitnessGoal.replaceAll("_", " ")}
                    </Typography>
                    <Typography>
                      Weekly target:{" "}
                      {formatCount(profile.weeklyWorkoutTarget, "day")}
                    </Typography>
                    <Typography>
                      Units: {profile.unitSystem.toLowerCase()}
                    </Typography>
                    {profile.heightCm && (
                      <Typography>
                        Height: {formatHeight(profile.heightCm, profile.unitSystem)}
                      </Typography>
                    )}
                    {profile.currentWeightKg && (
                      <Typography>
                        Weight:{" "}
                        {formatWeight(profile.currentWeightKg, profile.unitSystem)}
                      </Typography>
                    )}
                    <Button
                      href="/profile/edit"
                      variant="contained"
                      sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                    >
                      Edit profile
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    href="/onboarding"
                    variant="contained"
                    sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                  >
                    Complete onboarding
                  </Button>
                )}

                <Box>
                  {activityError ? (
                    <Stack gap={1.5}>
                      <Typography variant="h6">Workout activity</Typography>
                      <ErrorState
                        message={activityError}
                        onRetry={loadActivity}
                      />
                    </Stack>
                  ) : activity === undefined ? (
                    <Stack gap={1.5}>
                      <Typography variant="h6">Workout activity</Typography>
                      <LoadingState label="Loading workout activity" />
                    </Stack>
                  ) : (
                    <WorkoutActivityCalendar data={activity} />
                  )}
                </Box>

                <Stack gap={1.5} alignItems="flex-start">
                  <Typography variant="h6">Session</Typography>
                  <Typography color="text.secondary">
                    Sign out of FitWell on this device.
                  </Typography>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => void signOutUser().then(() => router.push("/"))}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Sign out
                  </Button>
                </Stack>
              </Stack>
            )}
          </Box>

          <Box
            role="tabpanel"
            id="profile-panel-1"
            aria-labelledby="profile-tab-1"
            hidden={activeTab !== 1}
            sx={{ p: { xs: 2, sm: 4 } }}
          >
            {activeTab === 1 && (
              <Stack gap={2} alignItems="flex-start">
                <Typography variant="h6" color="error">
                  Delete application account
                </Typography>
                <Alert severity="warning" sx={{ width: "100%" }}>
                  This removes your local FitWell data and disables the
                  application account. Your Firebase identity is preserved.
                </Alert>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => setConfirmOpen(true)}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Delete application account
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete application account?"
        description="Your local workouts, plans, and profile will be removed. This cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await deleteAccount();
          await signOutUser();
          await router.replace("/");
        }}
      />
    </AuthenticatedPage>
  );
}
