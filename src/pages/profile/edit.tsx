import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import ProfileForm from "fitness/components/profile/ProfileForm";
import { getUserProfile, updateProfile } from "fitness/utils/spec";
import type { Profile } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getUserProfile()
      .then(setProfile)
      .catch(() => setError("Your profile could not be loaded."));
  }, []);
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Edit profile"
        description="Update your personal fitness preferences."
      />
      {error ? (
        <ErrorState message={error} />
      ) : profile === undefined ? (
        <LoadingState />
      ) : (
        <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 900 }}>
          <ProfileForm
            initial={profile}
            submitLabel="Save changes"
            onSubmit={async (value) => {
              await updateProfile(value);
              await router.push("/profile");
            }}
          />
        </Paper>
      )}
    </AuthenticatedPage>
  );
}
