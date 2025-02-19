import { memo } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// theme
// hooks
import { useMockedUser } from "../../hooks/use-mocked-user";
// components
//
import { HEADER } from "../config-layout";
import { useNavData } from "./config-navigation";
import { HeaderShadow } from "../_common";
import { bgBlur } from "../../theme/css";
import NavSectionHorizontal from "../../components/nav-section/horizontal/nav-section-horizontal";

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
        mt: 4,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal
          data={navData}
          config={{
            currentRole: user?.role || "admin",
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
