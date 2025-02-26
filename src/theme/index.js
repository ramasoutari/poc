import PropTypes from "prop-types";
import merge from "lodash/merge";
import { useEffect, useMemo } from "react";
// @mui
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

// components
// system
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";
import { componentsOverrides } from "./overrides";
// options
import { presets } from "./options/presets";
import { darkMode } from "./options/dark-mode";
import { contrast } from "./options/contrast";
import RTL, { direction } from "./options/right-to-left";
import { useSettingsContext } from "../components/settings/context";
import { useLocales } from "../locales";

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {
  const settings = useSettingsContext();
  const { currentLang } = useLocales();

  const darkModeOption = darkMode(settings.themeMode);

  const presetsOption = presets(settings.themeColorPresets);

  const contrastOption = contrast(
    settings.themeContrast === "bold",
    settings.themeMode
  );

  const directionOption = direction(settings.themeDirection);

  const baseOption = useMemo(
    () => ({
      palette: palette("light"),
      shadows: shadows("light"),
      customShadows: customShadows("light"),
      typography,
      shape: { borderRadius: 8 },
    }),
    []
  );

  const memoizedValue = useMemo(
    () =>
      merge(
        // Base
        baseOption,
        // Direction: remove if not in use
        directionOption,
        // Dark mode: remove if not in use
        darkModeOption,
        // Presets: remove if not in use
        presetsOption,
        // Contrast: remove if not in use
        contrastOption.theme
      ),
    [
      baseOption,
      directionOption,
      darkModeOption,
      presetsOption,
      contrastOption.theme,
    ]
  );

  const theme = createTheme(memoizedValue);

  theme.components = merge(
    componentsOverrides(theme),
    contrastOption.components
  );
  theme.zIndex = {
    appBar: "100",
    modal: "1100",
    drawer: "1200",
    // appBar: '400'
  };

  useEffect(() => {
    // document.body.dir = currentLang.direction; // Set document direction
    document.documentElement.setAttribute("dir", currentLang.direction);
  }, [currentLang]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
