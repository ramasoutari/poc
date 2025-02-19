import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  // ...other imports
  Container,
  Stack,
  // ...other imports
} from "@mui/material";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLocales } from "../../../locales";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";
import { useAuthContext } from "../../../auth/hooks";
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import InputLabel from "../../../components/input-label";

export default function ChangeDataPanel() {
  const { t } = useLocales();
  const params = useParams();
  const { initialize } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState();
  const [message, setMessage] = useState();
  const [otpError, setOtpError] = useState(null);
  const [user, setUser] = useState();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`${HOST_API}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
  const defaultValues = {
    email: user?.email,
    phone: user?.phone,
  };

  const changeDataSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("validation_required"))
      .test("email", t("invalid_email"), (value) =>
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(value)
      ),
    phone: Yup.string()
      .required(t("validation_required"))
      .matches(/^(079|078|077)\d{7}$/, t("Jordanian_number_validation")),
    otp: updatedData
      ? Yup.string().required(t("validation_required"))
      : Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(changeDataSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  let payload;

  const handleOnSubmit = async (data) => {
    // Construct payload based on the existence of updatedData
    payload = {
      Email: data.email,
      Phone: data.phone,
      OTP: data.otp,
    };

    axiosInstance
      .post(`${HOST_API}/UpdateUserInfo`, { ...payload })
      .then((response) => {
        setLoading(false);
        setUpdatedData(payload);
        if (payload.OTP) {
          initialize();
          setMessage(response.data.message);
          setOtpError(null);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
        if (payload.otp) {
          setOtpError(true);
        }
      });
  };

  if (!user) return <CircularProgress />;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      {!message && !updatedData ? (
        <Stack direction="column" gap={2}>
          {/* Email and Phone input fields */}
          <Stack direction="column">
            <InputLabel label={t("email")} />
            <RHFTextField
              name="email"
              placeholder={user?.email}
              inputProps={{ readOnly: true }}
              type="email"
            />
          </Stack>
          <Stack direction="column">
            <InputLabel label={t("phone_number")} />
            <RHFTextField
              name="phone"
              placeholder={user?.phone}
              inputProps={{ readOnly: true }}
            />
          </Stack>
          {user.officerEmail && user.officerPhone && (
            <>
              <Stack direction="column">
                <InputLabel label={t("inst_rep_email")} />
                <RHFTextField
                  name="email"
                  placeholder={user?.officerEmail}
                  inputProps={{ readOnly: true }}
                  type="email"
                />
              </Stack>
              <Stack direction="column">
                <InputLabel label={t("inst_rep_phone_number")} />
                <RHFTextField
                  name="phone"
                  placeholder={user?.officerPhone}
                  inputProps={{ readOnly: true }}
                />
              </Stack>
            </>
          )}

          {/* <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            fullWidth
            sx={{
              mt: 4,
            }}
          >
            {t('send')}
          </Button> */}
        </Stack>
      ) : !message ? (
        <Stack direction="column">
          {/* OTP input field */}
          <InputLabel label={t("otp")} />
          <RHFTextField name="otp" placeholder={t("otp")} />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            fullWidth
            sx={{
              mt: 4,
            }}
          >
            {t("send")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            onClick={() => {
              setUpdatedData(false);
            }}
            fullWidth
            sx={{
              mt: 1,
            }}
          >
            {t("cancel")}
          </Button>
        </Stack>
      ) : (
        <Alert severity="success">
          <AlertTitle>{t("data_updated_successfully")}</AlertTitle>
        </Alert>
      )}

      {otpError && (
        <Alert severity="error">
          <AlertTitle>{t("Wrong_OTP")}</AlertTitle>
        </Alert>
      )}
    </FormProvider>
  );
}
