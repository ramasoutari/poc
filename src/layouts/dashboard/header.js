import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Box, Button, Typography } from "@mui/material";
// theme
// hooks
// components
import { AccessibilityToolbar } from "../../components/accessibility";
//
import { HEADER, NAV } from "../config-layout";
import {
  AccountPopover,
  NotificationsPopover,
  DateTimeOverview,
  LanguagePopover,
} from "../_common";
import { useNavData } from "./config-navigation";
import { useEffect } from "react";
import { varHover } from "../../components/animate";
import { Navigate, useNavigate } from "react-router";
import HelpButton from "../_common/help-button";
import { useAuthContext } from "../../auth/hooks";
import { useTranslation } from "react-i18next";
import { useSettingsContext } from "../../components/settings/context";
import { useResponsive } from "../../hooks/use-responsive";
import { bgBlur } from "../../theme/css";
import { useOffSetTop } from "../../hooks/use-off-set-top";
import NavSectionHorizontal from "../../components/nav-section/horizontal/nav-section-horizontal";
import SvgColor from "../../components/svg-color";
import Logo from "../../components/logo";
import i18n from "../../locales/i18n";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const navData = useNavData();

  const { user, initialize } = useAuthContext();

  const isNavVertical = settings.themeLayout === "vertical";

  const isNavHorizontal = settings.themeLayout === "horizontal";

  const isNavMini = settings.themeLayout === "mini";

  const lgUp = useResponsive("up", "lg");
  const smUp = useResponsive("up", "sm");

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;
  const direction = i18n.language === "ar" ? "ltr" : "rtl";

  const renderContent = (
    <>
      <Stack flexGrow={1} direction="row" alignItems="center">
        {lgUp && isNavHorizontal && <Logo sx={{ mr: 2, height: 20 }} />}

        {!lgUp && (
          <Box data-tour-id="nav-toggle">
            <IconButton onClick={onOpenNav}>
              <SvgColor
                id="nav-toggle-btn"
                src="/assets/icons/navbar/ic_menu_item.svg"
              />
            </IconButton>
          </Box>
        )}

        {/* <button
          id="nav-toggle-btn"
          type='button'
          onClick={onOpenNav}
        >asd</button> */}

        {smUp && settings.backRoute && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1, lg: 6 }}
            // sx={{
            //   mx: 2,
            // }}
          >
            {/* <Button
              LinkComponent={RouterLink}
              href={settings.backRoute}
              variant="outlined"
              sx={{
                p: 1,
                backgroundColor: 'common.white',
              }}
              startIcon={
                (currentLang.value !== "ar") ? (

                  <SvgColor
                    sx={{
                      color: 'secondary.main',
                      transform: 'scale(-1, 1)'

                    }}
                    src="/assets/icons/designer/back.svg"
                  />
                ) : (<SvgColor
                  sx={{
                    color: 'secondary.main',
                  }}
                  src="/assets/icons/designer/back.svg"
                />)
              }
            >
              {t('back')}
            </Button> */}
          </Stack>
        )}

        {user && <AccountPopover />}
      </Stack>
      {lgUp && (
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <NavSectionHorizontal
            data={navData}
            config={{
              currentRole: user?.role || "admin",
            }}
          />
        </Stack>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1, lg: 6 }}
      >
        {/* {process.env.REACT_APP_ENVIRONMENT !== "production" && (
          <LanguagePopover />
        )} */}

        {/* <NotificationsPopover /> */}

        {/* <ContactsPopover /> */}

        {/* <SettingsButton /> */}

        {/* <Searchbar /> */}

        {smUp && <DateTimeOverview />}

        {/* 
        {smUp && (
          <Box
            component="div"
            sx={{
              width: "95px",
              height: "auto",
            }}
          >
            <img
              src="/logo/masar-logo.png"
              alt="MoH Logo"
              style={{
                width: "auto",
                // height: '100%',
              }}
            />
          </Box>
        )} */}
      </Stack>
    </>
  );

  return (
    <Box sx={{ direction }}>
      <AppBar
        // position="absolute"
        sx={{
          height: HEADER.H_MOBILE,
          paddingBottom: 12,
          zIndex: theme.zIndex.appBar + 1,
          ...bgBlur({
            color: theme.palette.background.default,
          }),
          transition: theme.transitions.create(["height"], {
            duration: theme.transitions.duration.shorter,
          }),
          ...(lgUp && {
            width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
            height: HEADER.H_DESKTOP,
            ...(offsetTop && {
              height: HEADER.H_DESKTOP_OFFSET,
            }),
            ...((isNavVertical || isNavMini) && {
              borderBottom: `1px solid ${theme.palette.divider}`,
            }),
            ...(isNavHorizontal && {
              width: 1,
              bgcolor: "common.white",
              height: HEADER.H_DESKTOP_OFFSET,
              borderBottom: `1px solid ${"#1D3E6E"}`,
            }),
            ...(isNavMini && {
              width: `calc(100% - ${NAV.W_MINI + 1}px)`,
            }),
          }),
        }}
      >
        {/* {tl?.translateValue("you_can_have_new_otp_in_seconds", {
        seconds: 500
      })} */}
        <AccessibilityToolbar />

        <Toolbar
          sx={{
            height: 1,
            px: { lg: 5 },
          }}
        >
          {renderContent}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
