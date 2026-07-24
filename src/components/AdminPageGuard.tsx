import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "fitness/components/context";
import { getAdminStatus } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function AdminPageGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }

    getAdminStatus()
      .then(() => setIsAuthorized(true))
      .catch(() => router.replace("/dashboard"));
  }, [loading, router, user]);

  if (!isAuthorized) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
      >
        <CircularProgress aria-label="Checking admin access" />
      </Box>
    );
  }

  return <>{children}</>;
}
