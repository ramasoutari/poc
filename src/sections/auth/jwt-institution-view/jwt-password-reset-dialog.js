import {
  Alert,
  Box,
  Stack,
  Typography,
  Button,
  AlertTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { HOST_API } from "../../../config-global";
import { useAuthContext } from "../../../auth/hooks";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import axiosInstance from "../../../utils/axios";
import { useLocales } from "../../../locales";

export default function ResetPasswordDialog({ type }) {
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showPasswords, setShowPasswords] = useState(true);
  const [success, setSuccess] = useState(false);

  const { t } = useLocales();
  const { user } = useAuthContext();
  const globalDialog = useGlobalDialogContext();

  const form = getForm([
    {
      label: "old_password",
      fieldVariable: "oldPassword",
      placeholder: "old_password",
      type: "input",
      inputType: "password",
      typeValue: "string",
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
        {
          type: "pattern",
          value: /^(?=(.*\d))(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]/,
          message: t("Password_schema_error"),
        },
        {
          type: "minLength",
          value: 8,
          message: t("Password_length_error_short"),
        },
        {
          type: "maxLength",
          value: 32,
          message: t("Password_length_error_long"),
        },
      ],
    },
    {
      label: "new_password",
      fieldVariable: "newPassword",
      placeholder: "new_password",
      type: "input",
      inputType: "password",
      typeValue: "string",
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
        {
          type: "pattern",
          value: /^(?=(.*\d))(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]/,
          message: t("Password_schema_error"),
        },
        {
          type: "minLength",
          value: 8,
          message: t("Password_length_error_short"),
        },
        {
          type: "maxLength",
          value: 32,
          message: t("Password_length_error_long"),
        },
      ],
    },

    {
      label: "new_password_confirm",
      fieldVariable: "newPasswordConfirm",
      placeholder: "new_password_confirm",
      type: "input",
      inputType: "password",
      typeValue: "string",
      value: "",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 12,
        },
      ],
      validations: [
        {
          type: "required",
          message: t("required"),
        },

        {
          type: "matchField",
          field: "newPassword",
          message: t("passwords_must_match"),
        },
      ],
    },
  ]);

  const handleResetPassword = (data) => {
    setError(null);
    setLoading(true);
    const payload = {
      oldPassword: data?.oldPassword,
      password: data?.newPassword,
      confirmPassword: data.newPasswordConfirm,
      isCPD: user?.type === "cpd_entity",
    };

    axiosInstance
      .post(`${HOST_API}/ResetPasswordEntity`, payload)
      .then((response) => {
        setShowPasswords(false);
        setSuccess(true);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  const defaultValues = {
    ...form.defaultValues,
    ...data,
  };

  return (
    <Box
      sx={{
        mx: { md: "auto" },
        p: 3,
        backgroundColor: "background.default",
        borderRadius: 2,
        mb: 2,
      }}
    >
      {error && (
        <Typography
          component="label"
          htmlFor="additionalValue"
          variant="body2"
          fontWeight="fontWeightBold"
          align="center"
          style={{ display: "block", color: "red" }}
        >
          {error?.message}
        </Typography>
      )}
      {showPasswords && !success && (
        <DynamicForm
          {...form}
          defaultValues={defaultValues}
          onSubmit={handleResetPassword}
          submitButtonProps={{
            label: t["send"],
            alignment: "center",
            width: "100%",
            disabled: timer > 0,
            loading: loading,
          }}
          extraButtons={
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                globalDialog.onClose();
              }}
            >
              {t["close"]}
            </Button>
          }
        />
      )}
      {success && (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Box width={"100%"}>
            {" "}
            <Alert severity="success">
              <AlertTitle>{t["password_changed_successfully"]}</AlertTitle>
            </Alert>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              globalDialog.onClose();
            }}
          >
            {t["close"]}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
