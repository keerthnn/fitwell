import { Box } from "@mui/material";
import AppShell from "fitness/components/layout/AppShell";
import { AuthContextProvider } from "fitness/components/context";
import RestTimerProvider from "fitness/components/RestTimerProvider";
import ThemeModeProvider from "fitness/components/ThemeModeProvider";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSystemAdminRoute = router.pathname.startsWith("/system-admin");
  const isPublicRoute =
    router.pathname === "/" || router.pathname.startsWith("/auth/");
  const isOnboarding = router.pathname === "/onboarding";
  const content =
    isPublicRoute || isSystemAdminRoute || isOnboarding ? (
      <Component {...pageProps} />
    ) : (
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    );

  return (
    <>
      <Head>
        <title>FitWell</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeModeProvider>
        <AuthContextProvider>
          <RestTimerProvider>
            <Box component="main">{content}</Box>
          </RestTimerProvider>
        </AuthContextProvider>
      </ThemeModeProvider>
    </>
  );
}
