import { useEffect, useState } from "react";
import { useAuthContext } from "../../../auth/hooks";
import { useRouter } from "../../../routes/hooks";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useLocales } from "../../../locales";
import { color } from "framer-motion";
import { PATH_AFTER_LOGIN } from "../../../config-global";

export default function LoginView() {
  const { entityLogin } = useAuthContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState("");
  const [timer, setTimer] = useState(0);
  const { t } = useLocales();
  const router = useRouter();

  let loginFnc = entityLogin;

  const loginForm = getForm([
    {
      label: "entityNumber",
      fieldVariable: "username",
      type: "input",
      inputType: "numeric-text",
      typeValue: "string",
      placeholder: "entityNumber",
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
        // {
        //   type: 'minLength',
        //   value: 10,
        //   message: 'Wrong_national_id',
        // },
        // {
        //   type: 'maxLength',
        //   value: 11,
        //   message: 'Wrong_national_id',
        // },
      ],
    },
    {
      label: "password",
      fieldVariable: "password",
      placeholder: "password",
      type: "input",
      inputType: "password",
      typeValue: "string",
      // value: 'password123!',
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
  ]);

  const defaultValues = {
    ...loginForm.defaultValues,
  };

  const handleLogin = async (payload) => {
    try {
      setLoading(true);
      await loginFnc?.(
        { ...payload },
        () => {
          router.push(PATH_AFTER_LOGIN);
          setLoading(false);
        },
        () => {
          setLoginData(payload);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack spacing={2.5}>
        {!!error && !loginData && (
          <Alert severity="error">{t("entity_login_fail")}</Alert>
        )}
        <Stack spacing={2.5}>
          {timer > 0 && (
            <Box
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            ></Box>
          )}

          <DynamicForm
            {...loginForm}
            defaultValues={defaultValues}
            onSubmit={handleLogin}
            submitButtonProps={{
              label: t("login"),
              backgroundColor: "#1D3E6E",
              alignment: "center",
              width: "100%",
              loading,
              disabled: timer > 0,
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
