import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import axios from "axios";
import { useContext } from "react";

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
} from "@mui/material";
// routes
// config
// hooks
// auth
// components

import { useRouter, useSearchParams } from "../../routes/hooks";
import { useAuthContext } from "../../auth/hooks";
import { useLocales } from "../../locales";
import DynamicForm, { getForm } from "../../components/dynamic-form";

// ----------------------------------------------------------------------

export default function JwtOTPView() {
  const { t } = useLocales();

  // const { register } = useAuthContext();
  const savedData = localStorage.getItem("registrationData");
  const registrationData = JSON.parse(savedData);
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const returnTo = searchParams.get("returnTo");
  const { register } = useAuthContext();

  const form = getForm([
    {
      label: "otp",
      fieldVariable: "otp",
      type: "input",
      inputType: "numeric-text",
      typeValue: "string",
      value: "",
      placeholder: "otp",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
      ],
      validations: [
        {
          type: "required",
          message: t("required"),
        },
      ],
    },
  ]);

  const defaultValues = {
    ...form.defaultValues,
  };

  const handleSubmit = async (otp) => {
    if (registrationData) {
      registrationData.OTP = otp.otp;
      const payload = registrationData;
    }

    try {
      setLoading(true);
      await register?.(registrationData, () => {
        router.push("/");
        localStorage.removeItem("registrationData");
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);

      setErrorMsg(error.message);
    }
  };

  const renderForm = (
    <Stack spacing={2.5}>
      <DynamicForm
        {...form}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitButtonProps={{
          label: t("send"),
          alignment: "center",
          width: "100%",
          loading,
        }}
      />

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}
    </Stack>
  );

  return (
    <Box sx={{}}>
      <Typography variant="h5" textAlign="center">
        {t["otpMessage"]}
      </Typography>

      <Box
        sx={{
          p: 2,
          backgroundColor: "common.white",
        }}
      >
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        {renderForm}
        <Stack
          alignItems="center"
          gap={2}
          sx={{
            flexDirection: {
              xs: "column",
              md: "row",
            },
            mt: 2,
          }}
        ></Stack>
      </Box>
    </Box>
  );
}
