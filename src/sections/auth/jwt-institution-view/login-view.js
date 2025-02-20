import { useEffect, useState } from "react";
import { useAuthContext } from "../../../auth/hooks";
import { useRouter } from "../../../routes/hooks";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useLocales } from "../../../locales";
import { color } from "framer-motion";

export default function LoginView() {
  const { entityLogin } = useAuthContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendOTPCounter, setResendOTPCounter] = useState(0);
  const { t } = useLocales();

  const OTP_RESEND_INTERVAL_SECONDS = 300;

  const startTimer = () => {
    if (!timer) {
      setTimer(OTP_RESEND_INTERVAL_SECONDS);
    }
  };

  const resendOTP = () => {
    setResendOTPCounter((prev) => prev + 1);
    handleLogin(loginData);
    setError();
    setTimer();
    // setWrongOtp(false)
  };

  let loginFnc = entityLogin;

  const loginForm = getForm([
    {
      label: "entityNumber",
      fieldVariable: "NationalNo",
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
      fieldVariable: "Password",
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
          // router.push(PATH_AFTER_LOGIN_CPD);
          setLoading(false);
        },
        () => {
          setLoginData(payload);
          startTimer();
          setLoading(false);
        }
      );
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      // if started
      setTimeout(() => {
        setTimer((currTimer) => currTimer - 1);
      }, 1000);
    }
  }, [timer]);

  return (
    <Box>
      <Stack spacing={2.5}>
        {!!error && !loginData && (
          <Alert severity="error">{t("entity_login_fail")}</Alert>
        )}
        {!!error && <Alert severity="error">{error}</Alert>}
        <Stack spacing={2.5}>
          {timer > 0 && (
            <Box
              sx={{
                textAlign: "center",
                pt: 2,
              }}
            >
              <Typography component="p" textAlign="center" mb={2}>
                {timer <= 60
                  ? t?.translateValue("you_can_have_new_otp_in_seconds", {
                      seconds: timer,
                    })
                  : t?.translateValue(
                      "you_can_have_new_otp_in_minutes_seconds",
                      {
                        minutes: Math.floor(timer / 60).toString(),
                        seconds: (timer % 60).toString().padStart(2, "0"),
                      }
                    )}
              </Typography>
            </Box>
          )}

          <DynamicForm
            {...loginForm}
            defaultValues={defaultValues}
            onSubmit={handleLogin}
            submitButtonProps={{
              label: t("login"),
              backgroundColor:"#1D3E6E",
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
