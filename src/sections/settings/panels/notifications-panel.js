import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Button, Stack } from "@mui/material";
// hooks
// components

import { useLocales } from "../../../locales";
import FormProvider, { RHFListPicker } from "../../../components/hook-form";
//

// ----------------------------------------------------------------------

const createItem = (label, value) => {
  return { label, value };
};

const items = Array.from(Array(8).keys()).map((i) => {
  return createItem(`Item ${i + 1}`, i + 1);
});

export default function NotificationsPanel() {
  const { t } = useLocales();
  const NotificationSettingsSchema = Yup.object().shape({});

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(NotificationSettingsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleOnSubmit = async (data) => {
    // console.log(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Stack direction="column" gap={2}>
        <Stack direction="column" gap={1}>
          <RHFListPicker name="delegate" items={items} />
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
        {t["save"]}
      </Button>
    </FormProvider>
  );
}
