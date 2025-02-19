// @mui
import {
  Container,
  Card,
  Box,
  alpha,
  CardHeader,
  Typography,
} from "@mui/material";
// hooks
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../../components/loading-screen";
import { useResponsive } from "../../../hooks/use-responsive";
import { useSettingsContext } from "../../../components/settings/context";
import { useAuthContext } from "../../../auth/hooks";
import { useLocales } from "../../../locales";
import Warning from "./warning";

export default function ServicesListView() {
  const { initialize } = useAuthContext();
  const { t } = useLocales();
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const mdUp = useResponsive("up", "md");

  const isUserUnder34 = true;

  // if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      {isUserUnder34 ? (
        <Warning/>
      ) : (
        <Card>
          <CardHeader
            title={t("الرجاء تعبئة نموذج الطلب")}
            sx={{ textAlign: "center" }}
          />

          <Box
            sx={{
              mt: 2,
              px: 1,
              maxHeight: mdUp ? "calc(100vh - 280px)" : "calc(100vh - 224px)",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                display: "block",
                width: "10px",
                height: "10px",
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "8px",
                backgroundColor: (t) => alpha(t.palette.primary.main, 0.8),
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
          </Box>
        </Card>
      )}
    </Container>
  );
}
