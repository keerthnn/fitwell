import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
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
  useEffect(() => { void getUserProfile().then(setProfile); }, []);
  return (
    <AuthenticatedPage>
      <PageHeader title="Edit profile" description="Update your personal fitness preferences." />
      {profile === undefined ? <LoadingState /> : (
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
