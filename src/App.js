import Router from "./routes/sections";
import { AuthProvider } from "./auth/context/auth-provider";
// import { AuthConsumer } from "./auth/context";
import { GlobalDrawerProvider } from "./components/global-drawer/context/global-drawer-provider";
import SettingsDrawer from "./components/settings/drawer/settings-drawer";
import GlobalDrawer from "./components/global-drawer/global-drawer";
import GlobalDialog from "./components/global-dialog/global-dialog";
import GlobalPrompt from "./components/global-prompt/global-prompt";
import ProgressBar from "./components/progress-bar/progress-bar";
import { GlobalDialogProvider } from "./components/global-dialog/context";
import { GlobalPromptProvider } from "./components/global-prompt/context";
import { AccessibilityProvider } from "./components/accessibility";
import { SettingsProvider } from "./components/settings/context";
import { LoadingScreen } from "./components/loading-screen";
import { LocalizationProvider, useLocales } from "./locales";
import { GlobalStyles } from "@mui/material";
import ThemeProvider from "./theme";
import { MotionLazy } from "./components/animate/motion-lazy";

// ----------------------------------------------------------------------

export default function App() {
  const { t } = useLocales();

  if (!t) {
    return <LoadingScreen />;
  }

  return (
    <>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: "light", // 'light' | 'dark'
            themeDirection: "ltr", //  'rtl' | 'ltr'
            themeContrast: "default", // 'default' | 'bold'
            themeLayout: "horizontal", // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: "orange", // 'default' | 'patron' | 'jiacc' | 'moh' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <AccessibilityProvider
            defaultSettings={{
              rootFontSize: 120,
              colorBlind: false,
            }}
          >
            <ThemeProvider>
              <GlobalStyles
                styles={{
                  ".stickyTableCell": {
                    position: "sticky !important",
                    boxShadow: "5px 2px 5px grey !important",
                  },
                  ".react-joyride__tooltip, .react-joyride__tooltip *": {
                    fontFamily: "Droid Arabic Kufi",
                  },
                  "#showModal": {
                    position: "fixed",
                  },
                  "#custom-modal": {
                    zIndex: 50000,
                  },
                  "#custom-modal *": {
                    zIndex: 50000,
                  },
                  "modal-backdrop.fade.show": {
                    zIndex: 50000,
                  },
                  p: {
                    margin: 0,
                    padding: 0,
                  },
                  // '#custom-modal .in': {
                  //   position: 'fixed',
                  //   top: 0,
                  //   left: 0,
                  //   right: 0,
                  //   bottom: 0,
                  //   zIndex: 10000,
                  // }
                }}
              />
              <AuthProvider>
                <LocalizationProvider>
                  <GlobalDialogProvider>
                    <GlobalPromptProvider>
                      <GlobalDrawerProvider>
                        <MotionLazy>
                          <SettingsDrawer />
                          <GlobalDrawer />
                          <GlobalDialog />
                          <GlobalPrompt />
                          <ProgressBar />
                          {/* <AuthConsumer> */}
                          <Router />
                          {/* </AuthConsumer> */}
                        </MotionLazy>
                      </GlobalDrawerProvider>
                    </GlobalPromptProvider>
                  </GlobalDialogProvider>
                </LocalizationProvider>
              </AuthProvider>
            </ThemeProvider>
          </AccessibilityProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </>
  );
}
