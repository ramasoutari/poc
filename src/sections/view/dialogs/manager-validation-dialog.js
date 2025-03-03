import { Box, Button, Stack } from "@mui/material";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";
import i18n from "../../../locales/i18n";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import { useGlobalDialogContext } from "../../../components/global-dialog/context/global-dialog-context";
import { useState } from "react";
import { useLocales } from "../../../locales";
import EntityDataBox from "../../auth/jwt-institution-view/entity-data-box";

export default function ManagerValidationDialog({ onManagerVerified }) {
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { t } = useLocales();
  const globalDialog = useGlobalDialogContext();
  const [isVerified, setIsVerified] = useState(false);
  const [managerData, setManagerData] = useState(null);

  const VERIFY_MANAGER_AGE = [
    {
      label: "national_id",
      fieldVariable: "nationalNumber",
      type: "input",
      inputType: "numeric-text",
      typeValue: "string",
      placeholder: "national_id",
      gridOptions: [{ breakpoint: "xs", size: 12 }],
      validations: [{ type: "required", message: i18n.t("required") }],
    },
  ];

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.get(
        `${HOST_API}/manager/data?nationalNumber=${data.nationalNumber}`,
        {
          headers: {
            "x-session-id": localStorage.getItem("sessionId"),
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log(response.data.data);
        setManagerData(response.data.data);
        setIsVerified(true);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleNext = () => {
    onManagerVerified(managerData);
  };

  const form = getForm(VERIFY_MANAGER_AGE);
  const defaultValues = { ...form.defaultValues };

  return (
    <>
      <Box sx={{ direction, p: 2 }}>
        {!isVerified && (
          <DynamicForm
            {...form}
            defaultValues={defaultValues}
            validationMode="onChange"
            onSubmit={onSubmit}
            submitButtonProps={{
              alignment: "center",
              width: "300px",
              label: isVerified ? t("verified_successfully") : t("verify"),
              disabled: isVerified,
              sx: isVerified
                ? { backgroundColor: "#3FAF47", color: "white" }
                : {},
            }}
          />
        )}

        {isVerified && managerData && (
          <EntityDataBox
            data={[
              { label: "fullName", value: managerData?.fullName },
              { label: "age", value: managerData?.age },
              {
                label: "gender",
                value:
                  managerData?.gender === "Male"
                    ? "ذكر"
                    : managerData?.gender === "Female"
                    ? "انثى"
                    : "غير محدد",
              },
            ]}
          />
        )}

        {isVerified && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {t("next")}
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
}
