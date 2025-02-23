// @mui
import {
  Container,
  Card,
  Box,
  alpha,
  CardHeader,
  Typography,
} from "@mui/material";
// hooks
import { useEffect, useState } from "react";
import { LoadingScreen } from "../../../components/loading-screen";
import { useResponsive } from "../../../hooks/use-responsive";
import { useSettingsContext } from "../../../components/settings/context";
import { useAuthContext } from "../../../auth/hooks";
import { useLocales } from "../../../locales";
import Warning from "./warning";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import { HOST_API } from "../../../config-global";
import i18n from "../../../locales/i18n";
import axiosInstance from "../../../utils/axios";

export default function ServicesListView() {
  const { t } = useLocales();
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const mdUp = useResponsive("up", "md");
  const direction = i18n.language === "ar" ? "ltr" : "rtl";

  const isUserUnder45 = user?.age < 45;
  const form = getForm([
    {
      fieldVariable: "phone_number",
      label: t("phone_number"),
      placeholder: t("phone_number"),
      type: "phonefield",
      typeValue: "string",
      multiline: false,
      disabled: false,
      validations: [
        {
          type: "required",
          message: "required",
        },
      ],
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 6,
        },
      ],
    },
    {
      type: "input",
      inputType: "text",
      fieldVariable: "email",
      label: "email",
      // tip: 'email',
      placeholder: "email",
      isAffectedByOtherFields: false,
      affectingFields: [],
      optionsSourceType: null,
      optionsSourceApi: "",
      optionsSourceApiToken: "",
      optionsSourceApiValueKey: "",
      optionsSourceApiLabelKey: "",
      options: [],
      fields: [],
      multiline: null,
      rows: "",
      value: "",
      validations: [
        {
          type: "required",
          dependent_field: "",
          value: "",
          message: "required",
        },
        {
          type: "email",
          dependent_field: "",
          value: "",
          message: "invalid_email",
        },
      ],
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      visibilityRules: [],
    },
    {
      fieldVariable: "environmentalAttachment",
      label: t("environmentalAttachment"),
      placeholder: t("environmentalAttachment"),
      type: "upload",
      typeValue: "array",
      disabled: false,
      value: [],
      uploadStrategy: "tempId",
      destinationApi: `${HOST_API}/UploadAttachment`,
      destinationApiToken: "",
      destinationExtraArgs: {
        Location: "118",
      },
      maxFileSize: "2048",
      allowedExtensions: ["png", "jpg", "bmp", "heif", "jpeg", "pdf"],
      responseFileNameKey: "fileIds",
      validations: [
        {
          type: "required",
          message: "required",
        },
      ],
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 6,
        },
      ],
    },
    {
      fieldVariable: "soilTestAttachment",
      label: t("soilTestAttachment"),
      placeholder: t("soilTestAttachment"),
      type: "upload",
      typeValue: "array",
      disabled: false,
      value: [],
      uploadStrategy: "tempId",
      destinationApi: `${HOST_API}/UploadAttachment`,
      destinationApiToken: "",
      destinationExtraArgs: {
        Location: "118",
      },
      maxFileSize: "2048",
      allowedExtensions: ["png", "jpg", "bmp", "heif", "jpeg", "pdf"],
      responseFileNameKey: "fileIds",
      validations: [
        {
          type: "required",
          message: "required",
        },
      ],
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 6,
        },
      ],
    },
    {
      fieldVariable: "noObjectionAttachment",
      label: t("noObjectionAttachment"),
      placeholder: t("noObjectionAttachment"),
      type: "upload",
      typeValue: "array",
      disabled: false,
      value: [],
      uploadStrategy: "tempId",
      destinationApi: `${HOST_API}/UploadAttachment`,
      destinationApiToken: "",
      destinationExtraArgs: {
        Location: "118",
      },
      maxFileSize: "2048",
      allowedExtensions: ["png", "jpg", "bmp", "heif", "jpeg", "pdf"],
      responseFileNameKey: "fileIds",
      validations: [
        {
          type: "required",
          message: "required",
        },
      ],
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 6,
        },
      ],
    },
    {
      fieldVariable: "extraAttachment",
      label: t("addittional_attachments"),
      placeholder: t("addittional_attachments"),
      type: "upload",
      typeValue: "array",
      disabled: false,
      value: [],
      uploadStrategy: "tempId",
      destinationApi: `${HOST_API}/UploadAttachment`,
      destinationApiToken: "",
      destinationExtraArgs: {
        Location: "118",
      },
      maxFileSize: "2048",
      allowedExtensions: ["png", "jpg", "bmp", "heif", "jpeg", "pdf"],
      responseFileNameKey: "fileIds",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 6,
        },
      ],
    },
    {
      fieldVariable: "notes",
      label: t("notes"),
      value: "",
      placeholder: t("notes"),
      type: "input",
      typeValue: "string",
      inputType: "text",
      multiline: true,
      disabled: false,
      rows: 4,
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
      ],
    },
  ]);
    const defaultValues = {
      phone_number: user?.phoneNumber || "",
      email: user?.email || "",
      ...form.defaultValues,
    };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `${HOST_API}/applications/submit`,
        data,
        {
          headers: {
            "x-session-id": localStorage.getItem("sessionId"),
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      {isUserUnder45 ? (
        <Warning />
      ) : (
        <Card>
          <CardHeader
            title={t("الرجاء تعبئة نموذج الطلب")}
            sx={{ textAlign: "center", p: 2 }}
          />

          <Box
            sx={{
              pt: 2,
              mt: 2,
              px: 1,
              direction,
              maxHeight: mdUp ? "calc(100vh - 280px)" : "calc(100vh - 224px)",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                display: "block",
                width: "10px",
                height: "10px",
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "8px",
                backgroundColor: (t) => alpha(t.palette.primary.main, 0.8),
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <DynamicForm
              {...form}
              defaultValues={defaultValues}
              validationMode="onChange"
              onSubmit={onSubmit}
              submitButtonProps={{
                alignment: "center",
                width: "100%",
              }}
            />
          </Box>
        </Card>
      )}
    </Container>
  );
}
