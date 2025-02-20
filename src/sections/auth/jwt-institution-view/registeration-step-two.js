import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import { HOST_API } from "../../../config-global";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import axiosInstance from "../../../utils/axios";
import { useLocales } from "../../../locales";
import EntityDataBox from "./entity-data-box";

export default function RegisterationStepTwo({ regData, setRegData, setStep }) {
  const { t } = useLocales();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [formattedData, setFormattedData] = useState([
  {
    label: "officerNationalNumber",
    value: "1234567890",
  },
  {
    label: "officerName",
    value: "John Doe",
  },
  {
    label: "OfficerAge",
    value: "35",
  },
  {
    label: "gender",
    value: "Male",
  },
  {
    label: "phoneNumber",
    value: "+962791234567",
  },
  {
    label: "officerPhoneNumber",
    value: "+962798765432",
  },
  {
    label: "email",
    value: "john.doe@example.com",
  },
  {
    label: "OfficerEmail",
    value: "officer.doe@example.com",
  },
]
);

  const globalDialog = useGlobalDialogContext();

  const institutionFields = getForm([
    {
      disabled: isVerified,
      label: "inst_rep_national_id",
      fieldVariable: "inst_rep_national_id",
      type: "input",
      inputType: "numeric-text",
      typeValue: "string",
      // value: '',
      placeholder: "inst_rep_national_id",
      gridOptions: [
        {
          breakpoint: "lg",
          size: 12,
        },
        {
          breakpoint: "md",
          size: 6,
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
      disabled: isVerified,
      label: "inst_rep_birth_date",
      type: "date",
      inputType: "date",
      typeValue: "string",
      fieldVariable: "inst_rep_birth_date",
      placeholder: "inst_rep_birth_date",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "xs",
          size: 6,
        },
      ],
      validations: [
        { type: "required", message: t("required") },
        {
          type: "max",
          value: "today",
        },
      ],
    },
    {
      disabled: isVerified,
      label: "OfficerCivNum",
      type: "input",
      inputType: "string",
      typeValue: "string",
      fieldVariable: "OfficerCivNum",
      placeholder: "OfficerCivNum",
      gridOptions: [
        {
          breakpoint: "xs",
          size: 12,
        },
        {
          breakpoint: "xs",
          size: 6,
        },
      ],
      validations: [{ type: "required", message: t("required") }],
    },
  ]);

  const liaisonOfficerFields = getForm([
    {
      label: "inst_rep_phone_number",
      type: "phonefield",
      typeValue: "string",
      fieldVariable: "inst_rep_phone_number",
      placeholder: "inst_rep_phone_number",
      defaultCountry: "jo",
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      validations: [
        { type: "required", message: t("required") },
        { type: "phone", message: t("Jordanian_number_validation_962") },
      ],
    },
    {
      label: "inst_rep_email",
      type: "input",
      inputType: "text",
      typeValue: "string",
      fieldVariable: "liaisonOfficerEmail",
      placeholder: "inst_rep_email",
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      validations: [
        { type: "required", message: t("required") },
        { type: "email", message: t("invalid_email") },
      ],
    },
    {
      label: "inst_phone_number",
      type: "phonefield",
      typeValue: "string",
      fieldVariable: "inst_phone_number",
      placeholder: "inst_phone_number",
      defaultCountry: "jo",
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      validations: [
        { type: "required", message: t("required") },
        { type: "phone", message: t("Jordanian_number_validation_962") },
      ],
    },
    {
      label: "inst_email",
      type: "input",
      inputType: "text",
      typeValue: "string",
      fieldVariable: "inst_email",
      placeholder: "inst_email",
      gridOptions: [
        { breakpoint: "xs", size: 12 },
        { breakpoint: "md", size: 6 },
      ],
      validations: [
        { type: "required", message: t("required") },
        { type: "email", message: t("invalid_email") },
      ],
    },
  ]);

  const handleVerify = async (data) => {
    setLoading(true);

    try {
      // Make API request to fetch liaison officer data
      const response = await axiosInstance.post(
        `http://192.168.0.181:6001/api/prf/Officer/Data`,
        {
          nationalNumber: data?.inst_rep_national_id,
          birthdate: data?.inst_rep_birth_date,
          OfficerCivNum: data?.OfficerCivNum,
        }
      );
      const officerData = response?.data?.data || {};

      const updatedRegData = {
        ...regData,
        national_id: data?.inst_rep_national_id,
        officerName: officerData?.fullName || "",
        OfficerAge: officerData?.age || "",
        gender: officerData?.gender || "",
      };

      const formattedData = [
        {
          label: "officerNationalNumber",
          value: updatedRegData.national_id || "",
        },
        { label: "officerName", value: updatedRegData.officerName || "" },
        {
          label: "OfficerAge",
          value: updatedRegData.OfficerAge || "",
        },
        {
          label: "gender",
          value: updatedRegData.gender || "",
        },
      ];
      setFormattedData(formattedData);
      setRegData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          formattedData.map((item) => [item.label, item.value])
        ),
      }));
      setIsVerified(true);
    } catch (error) {
      console.error("Verification error:", error);
      setError(
        error?.response?.data?.message ||
          "An error occurred during verification."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (regData) => {
    if (!regData) return;

    setLoading(true);

    const updatedRegData = {
      ...regData,
      phoneNumber: regData?.inst_phone_number || "",
      officerPhoneNumber: regData?.inst_rep_phone_number || "",
      email: regData?.inst_email || "",
      OfficerEmail: regData?.liaisonOfficerEmail || "",
    };

    const formattedData = [
      { label: "phoneNumber", value: updatedRegData.phoneNumber },
      { label: "officerPhoneNumber", value: updatedRegData.officerPhoneNumber },
      { label: "email", value: updatedRegData.email },
      { label: "OfficerEmail", value: updatedRegData.OfficerEmail },
    ];
    setRegData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        formattedData.map((item) => [item.label, item.value])
      ),
    }));
    setStep((prev) => prev + 1);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  if (error?.message)
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Alert severity="error">
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={globalDialog.onClose}
        >
          {t["close"]}
        </Button>
      </Stack>
    );

  return (
    <>
      <Box sx={{ py: 1, px: 3 }}>
        <Box sx={{ py: 4 }}>
          {" "}
          <Typography variant="h6">{t("inst_rep_info")}</Typography>
        </Box>

        <DynamicForm
          {...institutionFields}
          onSubmit={handleVerify}
          defaultValues={regData || {}}
          loading={loading}
          extraButtons={
            <>
              {!isVerified && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ width: "300px" }}
                  onClick={() => setStep(0)}
                >
                  {t("previous")}
                </Button>
              )}
            </>
          }
          submitButtonProps={{
            label: isVerified ? t("verified_successfully") : t("verify"),
            alignment: "center",
            loading,
            width: "100%",
            disabled: isVerified,
          }}
        />

        {isVerified && (
          <>
            <Box sx={{ py: 3 }}>
              <EntityDataBox data={formattedData} />
            </Box>
            <DynamicForm
              {...liaisonOfficerFields}
              onSubmit={handleSubmit}
              defaultValues={regData}
              loading={loading}
              extraButtons={
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ width: "300px" }}
                    onClick={() => {}}
                  >
                    {t("previous")}
                  </Button>
                </>
              }
              submitButtonProps={{
                label: t("next"),
                alignment: "center",
                width: "100%",
              }}
            />
          </>
        )}
      </Box>
    </>
  );
}
