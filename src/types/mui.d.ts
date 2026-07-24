import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface FitwellSemanticColor {
    container: string;
    onContainer: string;
  }

  interface FitwellColors {
    surface: {
      secondary: string;
      elevated: string;
    };
    border: string;
    focus: string;
    interaction: {
      primaryHover: string;
      primaryActive: string;
      primaryContainer: string;
      onPrimaryContainer: string;
    };
    semantic: {
      success: FitwellSemanticColor;
      warning: FitwellSemanticColor;
      error: FitwellSemanticColor;
      info: FitwellSemanticColor;
    };
    sidebar: {
      start: string;
      middle: string;
      end: string;
      gradient: string;
      selected: string;
      selectedText: string;
    };
    chart: string[];
  }

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
      colors: FitwellColors;
    };
  }

  interface ThemeOptions {
    fitwell?: Theme["fitwell"];
  }
}
