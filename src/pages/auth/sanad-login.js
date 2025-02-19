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
} from "@mui/material";
// routes
// import { RouterLink } from "src/routes/components";
// config
// hooks
// auth
// components
import { useGlobalDialogContext } from "../../components/global-dialog";
import { useRouter, useSearchParams } from "../../routes/hooks";
import { useAuthContext } from "../../auth/hooks";
import useTabs from "../../hooks/use-tabs";
import { useGlobalPromptContext } from "../../components/global-prompt";

// ----------------------------------------------------------------------

export default function JwtLoginView() {

  const { login, rmsLogin, loginWithSanad } = useAuthContext();

  const router = useRouter();
  const loginTabs = useTabs([
    "persons",
    "establishments",
    // "royal_medical_services",
  ]);

  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const sanadState = searchParams.get("state");
  const sanadCode = searchParams.get("code");
  const globalDialog = useGlobalDialogContext();
  const globalPrompt = useGlobalPromptContext();

  useEffect(() => {
    if (sanadState && sanadCode) {
      loginWithSanad({
        sanadState,
        sanadCode,
      }).then((res) => {
        // if (res) {
        //   router.push(PATH_AFTER_LOGIN);
        // }
      });
    }
  }, [sanadState, sanadCode]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={72} sx={{}} />
    </Box>
  );
}
