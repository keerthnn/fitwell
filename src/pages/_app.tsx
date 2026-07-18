import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "fitness/components/context";
import Header, { HEADER_HEIGHT } from "fitness/components/Header";
import appTheme from "fitness/theme";
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

      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AuthContextProvider>
          {!isSystemAdminRoute && <Header />}

          <Box
            component="main"
            sx={{ pt: isSystemAdminRoute ? 0 : `${HEADER_HEIGHT}px` }}
          >
            <Component {...pageProps} />
          </Box>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}
