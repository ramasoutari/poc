import { Alert, Box, Button, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SanadLoginButton from "../sanad-login-button";
import { t } from "i18next";
import { set } from "lodash";
import LoginView from "./login-view";
import RegisterationView from "./registeration-view";

import ForgotPassDialog from "./jwt-forgot-pass-dialog";
import { useRouter } from "../../../routes/hooks";
import { useAuthContext } from "../../../auth/hooks";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import { useLocales } from "../../../locales";
import i18n from "../../../locales/i18n";

export default function JwtInstitutionView() {
  const router = useRouter();

  const { login, rmsLogin, loginWithSanad } = useAuthContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const globalDialog = useGlobalDialogContext();
  const { t, currentLang } = useLocales();
  const direction = i18n.language === "ar" ? "ltr" : "rtl";

  const handleOpenRegisterDialog = () => {
    globalDialog.onOpen({
      title: t("inst_registration"),
      content: (
        <Box p={2} sx={{ direction }}>
          <RegisterationView />
        </Box>
      ),
      dialogProps: {
        maxWidth: "lg",
      },
    });
  };

  const handleOpenPassResetDialog = () => {
    globalDialog.onOpen({
      title: t("forgot_password"),
      content: (
        <Box p={2}>
          <ForgotPassDialog />
        </Box>
      ),
      dialogProps: {
        maxWidth: "sm",
      },
    });
  };
  useEffect(() => {
    document.documentElement.setAttribute("dir", currentLang.direction);
  }, [currentLang]);

  return (
    <Box>
      <Stack spacing={2.5}>
        <Box>
          <LoginView />
          <Box>
            <Divider
              variant="body2"
              align="center"
              sx={{
                my: 2,
              }}
            ></Divider>

            <Button
              variant="contained"
              onClick={handleOpenRegisterDialog}
              fullWidth
              sx={{
                color: "black",
                backgroundColor: "darkgray",
              }}
            >
              {t("inst_registration")}
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <a
            role="button"
            onClick={handleOpenPassResetDialog}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              marginRight: "16px",
              color: "#1D3E6E",
            }}
          >
            {t("forgot_password")}
          </a>
          <a
            role="button"
            onClick={() => router.push(`/help/entityReg`)}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#1D3E6E",
            }}
          >
            {t("help")}
          </a>
        </Box>
      </Stack>
    </Box>
  );
}
