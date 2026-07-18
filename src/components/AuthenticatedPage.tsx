import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "fitness/components/context";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthenticatedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user)
      void router.replace(
        `/auth/sign-in?next=${encodeURIComponent(router.asPath)}`,
      );
  }, [loading, user, router]);
  if (loading || !user)
    return (
      <Box minHeight="60vh" display="grid" sx={{ placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  return <>{children}</>;
}
