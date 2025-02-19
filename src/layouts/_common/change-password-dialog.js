import { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
// hooks
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import InputLabel from "../../components/input-label";
import Iconify from "../../components/iconify";
import { useLocales } from "../../locales";
import SvgColor from "../../components/svg-color";

export default function ChangePasswordDialog() {
  const { t } = useLocales();
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState({});
  const ChangePasswordSchema = Yup.object().shape({
    old_password: Yup.string().required(t("validation_required")),
    password: Yup.string().required(t("validation_required")),
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
  } = methods;

  const handleOnSubmit = async (data) => {
    setPayload({
      OldPassword: data.old_password,
      Password: data.password,
      confirmPassword: data.confirm_password,
      helle: data.confirm_password,
    });
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    handleOpen();
  }, []);

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: (theme) => theme.spacing(1),
            right: (theme) => theme.spacing(1),
            zIndex: 1000,
          }}
        >
          <SvgColor
            src="/assets/icons/designer/close.svg"
            color="text.secondary"
            width={24}
          />
        </IconButton>
        <DialogTitle sx={{ pb: 2, textAlign: "center" }}>
          {t("change_password")}
        </DialogTitle>

        <DialogContent
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box py={3}>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <Stack direction="column" gap={2}>
                <Stack direction="column">
                  <InputLabel label={t("confirm_new_password")} />
                  <RHFTextField
                    name="confirm_password"
                    placeholder={t("confirm_new_password")}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            <Iconify
                              icon={
                                showPassword
                                  ? "eva:eye-off-outline"
                                  : "eva:eye-outline"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Stack direction="column">
                  <InputLabel label={t("new_password")} />
                  <RHFTextField
                    name="password"
                    placeholder={t("new_password")}
                    type="password"
                  />
                </Stack>
                <Stack direction="column">
                  <InputLabel label={t("confirm_new_password")} />
                  <RHFTextField
                    name="confirm_password"
                    placeholder={t("confirm_new_password")}
                    type="password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            <Iconify
                              icon={
                                showPassword
                                  ? "eva:eye-off-outline"
                                  : "eva:eye-outline"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
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
            </FormProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
