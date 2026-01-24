import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "fitness/components/context";
import Header, { HEADER_HEIGHT } from "fitness/components/Header";
import appTheme from "fitness/theme";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FitWell</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AuthContextProvider>
          <Header />

          <Box component="main" sx={{ pt: `${HEADER_HEIGHT}px` }}>
            <Component {...pageProps} />
          </Box>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}
