// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// theme
// hooks
import { useMockedUser } from "../../hooks/use-mocked-user";
// components
//
import { NAV } from "../config-layout";
import { useNavData } from "./config-navigation";
import { NavToggleButton } from "../_common";
import { hideScroll } from "../../theme/css";
import Logo from "../../components/logo";
import NavSectionMini from "../../components/nav-section/mini/nav-section-mini";

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
        backgroundColor: "background.default",
        zIndex: 1101,
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: "fixed",
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: "auto", my: 2 }} />

        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.role || "admin",
          }}
        />
      </Stack>
    </Box>
  );
}
