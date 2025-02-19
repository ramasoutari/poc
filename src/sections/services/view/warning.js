// @mui
import {
  Container,
  Card,
  Box,
  alpha,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
// hooks
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../../components/loading-screen";
import { useResponsive } from "../../../hooks/use-responsive";
import { useSettingsContext } from "../../../components/settings/context";
import { useAuthContext } from "../../../auth/hooks";
import { useLocales } from "../../../locales";
import { RouterLink } from "../../../routes/components";
import { paths } from "../../../routes/paths";

export default function Warning() {
  const { initialize } = useAuthContext();
  const { t } = useLocales();
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const mdUp = useResponsive("up", "md");

  // if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        mt: 2,
        px: 1,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          pb: 9,
        }}
      >
        <img
          src="/icons/fluent_error-circle-12-filled.png"
          alt="warning Logo"
          style={{
            width: "auto",
            height: "200px",
          }}
        />
        <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>
          {t("sorry")}
        </Typography>
        <Typography variant="h4" sx={{ mt: 2 }}>
          {t("warning_msg")}
        </Typography>
      </Box>
      <Box>
        <Button
          component={RouterLink}
          to={paths.auth.jwt.login}
          variant="contained"
          color="primary"
          sx={{
            width: "400px",
            height: "62px",
            backgroundColor: "#1D3E6E",
            color: "#fff",
            mt: 2,
            "&:hover": {
              backgroundColor: "#16325C",
            },
          }}
        >
          {t("exit")}{" "}
          <img
            src="/icons/Vector.png"
            alt="Exit Icon"
            style={{ width: "24px", height: "24px" }}
          />
        </Button>
      </Box>
    </Box>
  );
}
