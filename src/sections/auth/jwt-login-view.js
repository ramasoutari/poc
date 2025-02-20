import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
// routes
// config
// hooks
// auth
// components
import JwtIndividualLoginView from "./jwt-individual-login-view";
import JwtInstitutionView from "./jwt-institution-view/jwt-institution-view";
import { useRouter, useSearchParams } from "../../routes/hooks";
import { useAuthContext } from "../../auth/hooks";
import useTabs from "../../hooks/use-tabs";
import { useGlobalDialogContext } from "../../components/global-dialog";
import { useGlobalPromptContext } from "../../components/global-prompt";
import ChangeLanguageDialog from "../../layouts/_common/change-language-dialog";
import { useLocales } from "../../locales";
import i18n from "../../locales/i18n";

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { t } = useLocales();
  const loginTabs = useTabs(["persons", "establishments"]);
  const loginTabsList = ["persons", "establishments"];
  const direction = i18n.language === "ar" ? "ltr" : "rtl";

  return (
    <>
      <Box sx={{ direction }}>
        <Tabs
          value={loginTabs.currentTab}
          onChange={loginTabs.changeTab}
          sx={{
            paddingX: 2,
            "& .MuiTab-root": {
              marginRight: "20px !important",
            },
          }}
        >
          {loginTabsList?.map((tab) => (
            <Tab
              label={
                <Typography variant="caption" fontWeight="bold">
                  {t(tab)}
                </Typography>
              }
            />
          ))}
        </Tabs>

        <Box
          sx={{
            p: 2,
            minHeight: 460,
            maxHeight: 450,
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "common.white",
            "&::-webkit-scrollbar": {
              display: "block",
              width: "10px",
              height: "10px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "8px",
              backgroundColor: (t) => alpha("#1D3E6E", 0.8),
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          {loginTabs.currentTab === 0 && <JwtIndividualLoginView />}
          {loginTabs.currentTab === 1 && <JwtInstitutionView />}
        </Box>
      </Box>
    </>
  );
}
