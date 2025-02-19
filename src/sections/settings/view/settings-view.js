import { useRef } from "react";
// @mui
import { Container, Card, Box } from "@mui/material";
// hooks
//
import SettingsTabs from "../settings-tabs";
import PanelCard from "../panel-card";
import AppearancePanel from "../panels/appearance_panel";
import UserDataPanel from "../panels/user-data-panel.js";
import useLocales from "../../../locales/use-locales.js";
import { useSettingsContext } from "../../../components/settings/context/settings-context.js";
import useTabs from "../../../hooks/use-tabs.js";

// ----------------------------------------------------------------------

export default function SettingsView() {
  const settings = useSettingsContext();
  const { t, currentLang } = useLocales();

  const TABS = [
    // {
    //   value: 'my_account',
    //   name: t['my_account'),
    // },
    {
      value: "user_data",
      name: t["user_data"],
    },
    // {
    //   value: 'password',
    //   name: t['password'),
    // },
    {
      value: "appearance_settings",
      name: t["appearance_settings"],
    },
  ];
  const tabs = useTabs(TABS);
  const panelsContainerRef = useRef(null);
  const isActive = (index) => tabs.currentTab === index;

  const handleChangeTab = (event, newValue) => {
    tabs.changeTab(event, newValue);

    if (panelsContainerRef.current) {
      // we want to scroll to the panel associated with the tab
      const children = panelsContainerRef.current.children;

      // count widths of all previous panels
      let offsetRight = 0;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < newValue; i++) {
        offsetRight += children[i].offsetWidth + 32;
      }

      // Scroll to the panel
      panelsContainerRef.current.scrollTo({
        left: offsetRight * (currentLang.direction === "rtl" ? -1 : 1),
        behavior: "smooth",
      });
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Card>
        <SettingsTabs
          tabs={tabs.tabs}
          handleChange={handleChangeTab}
          value={tabs.currentTab}
        />
      </Card>

      <Box mt={2}>
        <Box
          ref={panelsContainerRef}
          sx={{
            // p: 2,
            display: "flex",
            gap: 4,
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {/* <PanelCard title={t['my_account')} isActive={isActive(0)}>
            <MyAccountPanel />
          </PanelCard> */}
          <PanelCard title={t["user_data"]} isActive={isActive(0)}>
            <UserDataPanel />
          </PanelCard>
          {/* <PanelCard title={t['password')} isActive={isActive(2)}>
            <ChangePasswordPanel />
          </PanelCard> */}
          <PanelCard title={t["appearance_settings"]} isActive={isActive(1)}>
            <AppearancePanel />
          </PanelCard>
          {/* To allow scrolling to the last panel via JS */}
          <div style={{ minWidth: 1000 }} />
        </Box>
      </Box>
    </Container>
  );
}
