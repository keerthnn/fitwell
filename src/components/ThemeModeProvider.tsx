import { CssBaseline, ThemeProvider } from "@mui/material";
import createAppTheme from "fitness/theme";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
type ThemeModeContextValue = {
  preference: ThemePreference;
  resolvedMode: "light" | "dark";
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = "fitwell.theme";
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useThemeMode() {
  const value = useContext(ThemeModeContext);
  if (!value)
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  return value;
}

export default function ThemeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [systemDark, setSystemDark] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystem = (event?: MediaQueryListEvent) =>
      setSystemDark(event?.matches ?? media.matches);
    updateSystem();
    media.addEventListener("change", updateSystem);
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark" || saved === "system")
        setPreferenceState(saved);
      hydrated.current = true;
    }, 0);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", updateSystem);
    };
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };
  const resolvedMode =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;
  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);
  const value = useMemo(
    () => ({ preference, resolvedMode, setPreference }),
    [preference, resolvedMode],
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
