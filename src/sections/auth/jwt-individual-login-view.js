import { Alert, Box, Divider, Stack } from "@mui/material";
import React, { useState } from "react";
import SanadLoginButton from "./sanad-login-button";
import { t } from "i18next";
import { PATH_AFTER_LOGIN } from "../../config-global";
import { useRouter } from "../../routes/hooks";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../auth/hooks";
import useTabs from "../../hooks/use-tabs";
import DynamicForm, { getForm } from "../../components/dynamic-form";
import { useLocales } from "../../locales";

export default function JwtIndividualLoginView() {
  const loginTabs = useTabs(["persons", "establishments"]);

  const router = useRouter();
  const { login, loginWithSanad } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const form = getForm([
    {
      label: "national_id",
      fieldVariable: "national_id",
      type: "input",
      inputType: "numeric-text",
      typeValue: "string",
      value: "",
      placeholder: "national_id",
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
          type: "minLength",
          value: 10,
          message: t("Wrong_national_id"),
        },
        {
          type: "maxLength",
          value: 11,
          message: t("Wrong_national_id"),
        },
      ],
    },
    {
      label: "password",
      fieldVariable: "password",
      placeholder: "password",
      type: "input",
      inputType: "password",
      typeValue: "string",
      // value: 'Password123!',
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
    ...form.defaultValues,
  };

  const handleSubmit = async (data) => {
    const { national_id, password } = data;

    // Create the payload object with both fields
    const payload = {
      NationalNo: national_id,
      Password: password,
    };
    let loginFnc = login;

    // if (loginTabs.currentTab === 2) {
    //   loginFnc = rmsLogin;
    // }

    try {
      setLoading(true);
      await loginFnc?.(payload, () => {
        router.push(PATH_AFTER_LOGIN);
        setLoading(false);
      });
    } catch (error) {
      console.error(error.message);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <Box height="auto">
      <Stack spacing={2.5} alignContent="center">
        {/* {!!errorMsg && <Alert severity="error">{t("Wrong_Credentials")}</Alert>} */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* {process.env.REACT_APP_ENVIRONMENT !== 'production' &&

            <DynamicForm
              {...form}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitButtonProps={{
                label: tl['login'],
                alignment: 'center',
                width: '100%',
                loading,
              }}
            />
          } */}
          {/* {process.env.REACT_APP_ENVIRONMENT !== "production" && (
            <DynamicForm
              {...form}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitButtonProps={{
                label: t('login'),
                alignment: "center",
                width: "100%",
                loading,
              }}
            />
          )} */}
          {
            <img
              src="/logo/sanad-logo.png"
              alt="SANAD Logo"
              height="auto"
              width="441.4207763671875"
              top=" 334.4px"
              left=" 828.66px"
            />
          }
        </Stack>
        {/* <Typography variant="body2" color="inherit">
        <RouterLink to={paths.auth.jwt.forgotPassword}>{t('forgot_password')}</RouterLink>
      </Typography> */}
      </Stack>
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
      >
        <SanadLoginButton />
        {/* <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to={paths.auth.jwt.register}
            >
              {t('register')}
            </Button> */}
      </Stack>
    </Box>
  );
}
