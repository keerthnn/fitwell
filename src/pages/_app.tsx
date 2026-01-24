import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";

import { AuthContextProvider } from "fitness/components/context";
import Header from "fitness/components/Header";
import appTheme from "fitness/theme";

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sophize Grow</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AuthContextProvider>
          <Header />
          <Component {...pageProps} />
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}
