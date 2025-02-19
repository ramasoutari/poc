import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import InputLabel from "src/components/input-label/input-label";
import Iconify from "src/components/iconify";
import { useParams } from "react-router";
import { useLocales } from "../../../locales";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";

export default function ChangePasswordPanel() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { t } = useLocales();

  const ChangePasswordSchema = Yup.object().shape({
    old_password: Yup.string().required(t("validation_required")),
    password: Yup.string()
      .required(t("validation_required"))
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        t("Password_schema_error")
      ),
    confirm_password: Yup.string()
      .required(t("validation_required"))
      .oneOf([Yup.ref("password"), null], t("passwords_must_match")),
  });

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    register,
    formState: { errors },
  } = methods;

  const handleOnSubmit = async (data) => {
    const payload = {
      Password: data.password,
      confirmPassword: data.confirm_password,
      OldPassword: data.old_password,
    };

    axiosInstance
      .post(`${HOST_API}/ChangeUserPassword`, { ...payload })
      .then((response) => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "old_password") {
      setShowOldPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === "password") {
      setShowNewPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === "confirm_password") {
      setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
    }
  };

  return (
    <>
      {success ? (
        <Alert severity="success">
          <AlertTitle> {t("data_updated_successfully")}</AlertTitle>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Stack direction="column" gap={2}>
            <Stack direction="column">
              <InputLabel label={t("old_password")} />
              <TextField
                {...register("old_password", {
                  required: t("validation_required"),
                })}
                name="old_password"
                placeholder={t("old_password")}
                type={showOldPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("old_password")}
                      >
                        <Iconify
                          icon={
                            !showOldPassword
                              ? "eva:eye-off-outline"
                              : "eva:eye-outline"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <span style={{ color: "red" }}>
                {errors.old_password && errors.old_password.message}
              </span>
            </Stack>
            <Stack direction="column">
              <InputLabel label={t("new_password")} />
              <TextField
                {...register("password", {
                  required: t("validation_required"),
                })}
                name="password"
                placeholder={t("new_password")}
                type={showNewPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("password")}
                      >
                        <Iconify
                          icon={
                            !showNewPassword
                              ? "eva:eye-off-outline"
                              : "eva:eye-outline"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <span style={{ color: "red" }}>
                {errors.password && errors.password.message}
              </span>
            </Stack>
            <Stack direction="column">
              <InputLabel label={t("confirm_new_password")} />
              <TextField
                {...register("confirm_password", {
                  required: t("validation_required"),
                  validate: (value) =>
                    value === methods.watch("password") ||
                    t("passwords_must_match"),
                })}
                name="confirm_password"
                placeholder={t("confirm_new_password")}
                type={showConfirmPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          togglePasswordVisibility("confirm_password")
                        }
                      >
                        <Iconify
                          icon={
                            !showConfirmPassword
                              ? "eva:eye-off-outline"
                              : "eva:eye-outline"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <span style={{ color: "red" }}>
                {errors.confirm_password && errors.confirm_password.message}
              </span>
            </Stack>
          </Stack>
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
            {t("change_password")}
          </Button>
          {!!error && <Alert severity="error">{error}</Alert>}
        </form>
      )}
    </>
  );
}
