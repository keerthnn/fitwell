import { Box } from "@mui/material";
import { AuthContextProvider } from "fitness/components/context";
import Header, { HEADER_HEIGHT } from "fitness/components/Header";
import RestTimerProvider from "fitness/components/RestTimerProvider";
import ThemeModeProvider from "fitness/components/ThemeModeProvider";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSystemAdminRoute = router.pathname.startsWith("/system-admin");

  return (
    <>
      <Head>
        <title>FitWell</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeModeProvider>
        <AuthContextProvider>
          <RestTimerProvider>
            {!isSystemAdminRoute && <Header />}

            <Box
              component="main"
              sx={{ pt: isSystemAdminRoute ? 0 : `${HEADER_HEIGHT}px` }}
            >
              <Component {...pageProps} />
            </Box>
          </RestTimerProvider>
        </AuthContextProvider>
      </ThemeModeProvider>
    </>
  );
}
