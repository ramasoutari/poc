import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Box, Button, Divider, Stack, TextField } from "@mui/material";
// hooks
// components
import { useLocales } from "../../../locales";
import SvgColor from "../../../components/svg-color";
import FormProvider, {
  RHFDatePicker,
  RHFListPicker,
} from "../../../components/hook-form";
//

// ----------------------------------------------------------------------

const createPerson = (id, name) => {
  return { id, name };
};

const persons = Array.from(Array(2).keys()).map((i) => {
  const id = i + 1;
  return createPerson(id, `Person ${id}`);
});

export default function ManagementAuthorizationPanel() {
  const { t } = useLocales();
  const ManagementAuthSchema = Yup.object().shape({
    // delegate min 1 max 2
    delegate: Yup.array().min(1).max(2).required(t("validation_required")),
    // start_date must be in the future
    start_date: Yup.date()
      .min(new Date(), t("validation_date_in_future"))
      .required(t("validation_required")),
  });

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(ManagementAuthSchema),
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
          <TextField
            placeholder={t("choose_delegate")}
            InputProps={{
              startAdornment: (
                <Box
                  sx={{
                    mr: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SvgColor
                    src="/assets/icons/designer/search.svg"
                    color="secondary.main"
                    width={24}
                  />
                </Box>
              ),
            }}
          />
          <RHFListPicker
            name="delegate"
            items={persons}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
          />
        </Stack>
        <Divider />
        <Stack direction="column" spacing={1} mt="auto">
          <RHFDatePicker
            name="start_date"
            minDate={new Date()}
            slotProps={{ textField: { placeholder: t("specify_period")} }}
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
        {t("save")}
      </Button>
    </FormProvider>
  );
}
