import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
// hooks
// components
//
import Main from "./main";
import Header from "./header";
import NavMini from "./nav-mini";
import NavVertical from "./nav-vertical";
import { useSettingsContext } from "../../components/settings/context";
import { useResponsive } from "../../hooks/use-responsive";
import { useBoolean } from "../../hooks/use-boolean";
import NavHorizontal from "./nav-horizontal";

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  console.log("DashboardLayout rendering");

  const settings = useSettingsContext();

  const lgUp = useResponsive("up", "lg");

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === "horizontal";

  const isMini = settings.themeLayout === "mini";

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
    <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
  );

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />
        {lgUp && renderHorizontal}
        {/* {!lgUp && !settings.hideNav && renderNavVertical} */}

        <Main>{children}</Main>
        {/* <Footer /> */}
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />
      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <renderHorizontal />
        <Main>{children}</Main>
      </Box>
      {/* <Footer /> */}
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
