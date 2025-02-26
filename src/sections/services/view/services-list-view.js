// @mui
import {
  Container,
  Card,
  Box,
  alpha,
  CardHeader,
  Typography,
  Stack,
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
import { useGlobalPromptContext } from "../../../components/global-prompt";
import { useNavigate } from "react-router-dom";

export default function ServicesListView() {
  const { t } = useLocales();
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const mdUp = useResponsive("up", "md");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const globalPrompt = useGlobalPromptContext();
  const navigate = useNavigate();

  const isUserUnder45 = user?.age < 45;
  const form = getForm([
    {
      fieldVariable: "phoneNumber",
      label: t("phone_number"),
      placeholder: t("phone_number"),
      type: "phonefield",
      typeValue: "string",
      multiline: false,
      disabled: false,
      validations: [
        {
          type: "required",
          message: t("required"),
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
          message: t("required"),
        },
        {
          type: "email",
          dependent_field: "",
          value: "",
          message: t("invalid_email"),
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
      multiple: true,
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
          type: "min",
          value: 1,
          message: t("required"),
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
      multiple: true,
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
          type: "min",
          value: 1,
          message: t("required"),
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
      multiple: true,
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
          type: "min",
          value: 1,
          message: t("required"),
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
      multiple: true,
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
      fieldVariable: "extraInfo",
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
    applicantType:
      user?.type === "individual"
        ? "003"
        : user?.type === "entity"
        ? "004"
        : "",
    applicantName: user?.name || "",
    entityRegistrationDate:
      user?.type === "entity" ? user?.registrationDate : null,
    nationalRegistrationNumber:
      user?.type === "entity" ? user?.entityNumber : user?.nationalNumber || "",
    birthDate: user?.type === "individual" ? user?.birthdate : null,
    gender: user?.type === "individual" ? user?.gender : null,
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    ...form.defaultValues,
  };
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      let payload = {
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        applicantType:
          user?.type === "individual"
            ? "003"
            : user?.type === "entity"
            ? "004"
            : "",
        applicantName: user?.name || "",
        entityRegistrationDate:
          user?.type === "entity" ? user?.registrationDate : null,
        nationalRegistrationNumber:
          user?.type === "entity"
            ? user?.entityNumber
            : user?.nationalNumber || "",
        birthDate: user?.type === "individual" ? user?.birthdate : null,
        gender: user?.type === "individual" ? user?.gender : null,
        extraInfo: data.extraInfo || "",
      };

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) && key.includes("Attachment")) {
          payload[key] = value.map((file) => {
            console.log("File object:", file);
            return file || null;
          });
        }
      });

      console.log("Final Payload:", payload);

      const response = await axiosInstance.post(
        `${HOST_API}/applications/submit`,
        payload,
        {
          headers: {
            "x-session-id": localStorage.getItem("sessionId"),
          },
        }
      );
      if (response.status === 201) {
        handlesucceess();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };
  const handlesucceess = () => {
    globalPrompt.onOpen({
      type: "success",
      content: (
        <Stack direction="column" spacing={1}>
          <Typography component="h6" variant="h6" fontWeight="fontWeightBold">
            {t("order_sent_successfully")}
          </Typography>
        </Stack>
      ),
      promptProps: {
        icon: "success",
      },
    });
  };
  // if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      {user.type === "user" && isUserUnder45 ? (
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
