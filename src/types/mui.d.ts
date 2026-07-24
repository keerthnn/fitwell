import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    fitwell: {
      sidebarWidth: number;
      sidebarCollapsedWidth: number;
      mobileNavigationHeight: number;
      contentMaxWidth: number;
      cardRadius: number;
      buttonRadius: number;
      imageRatios: {
        card: string;
        cover: string;
      };
    };
  }

  interface ThemeOptions {
    fitwell?: Theme["fitwell"];
  }
}
