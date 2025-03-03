import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import moment from "moment";
import { LoadingScreen } from "../../../components/loading-screen";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import { HOST_API } from "../../../config-global";
import DynamicForm, { getForm } from "../../../components/dynamic-form";
import axiosInstance from "../../../utils/axios";
import { useLocales } from "../../../locales";
import EntityDataBox from "./entity-data-box";

export default function RegisterationStepOne({ setStep, setRegData, regData }) {
  const { t } = useLocales();

  const globalDialog = useGlobalDialogContext();
  // const { registerInstitute } = useAuthContext();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [stepOneForm, setStepOneForm] = useState(null);
  const [entityData, setEntityData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const form = getForm([
      {
        disabled: isVerified,
        label: "type",
        fieldVariable: "type",
        type: "select",
        typeValue: "string",
        value: "",
        options: [
          {
            label: "شركات",
            value: "002",
          },
          {
            label: "مؤسسة فردية",
            value: "001",
          },
        ],
        placeholder: "type",
        gridOptions: [
          {
            breakpoint: "xs",
            size: 12,
          },
          {
            breakpoint: "md",
            size: 4,
          },
          {
            breakpoint: "lg",
            size: 12,
          },
        ],
        validations: [
          {
            type: "required",
            message: t("required"),
          },
        ],
      },
      {
        disabled: isVerified,
        label: "entityNumber",
        fieldVariable: "entityNumber",
        type: "input",
        inputType: "numeric-text",
        placeholder: "entityNumber",
        gridOptions: [
          {
            breakpoint: "xs",
            size: 12,
          },
          {
            breakpoint: "md",
            size: 6,
          },
          {
            breakpoint: "lg",
            size: 6,
          },
        ],
        validations: [
          {
            type: "required",
            message: t("required"),
          },
        ],
      },
      {
        disabled: isVerified,
        label: "registrationNumber",
        fieldVariable: "registrationNumber",
        type: "input",
        inputType: "numeric-text",
        typeValue: "string",
        placeholder: "registrationNumber",
        gridOptions: [
          {
            breakpoint: "xs",
            size: 12,
          },
          {
            breakpoint: "md",
            size: 6,
          },
          {
            breakpoint: "lg",
            size: 6,
          },
        ],
        validations: [
          {
            type: "required",
            message: t("required"),
          },
        ],
      },
    ]);

    setStepOneForm(form);
  }, [isVerified]);

  const defaultValues = useMemo(
    () => ({
      ...(stepOneForm?.defaultValues || {}),
      ...regData,
    }),
    [stepOneForm?.defaultValues, regData]
  );

  const handleVerify = async (data) => {
    setLoading(true);

    try {
      const companyInfoResponse = await axiosInstance.post(
        `${HOST_API}/Entity/Data`,
        {
          registrationNumber: data.registrationNumber,
          entityNumber: data?.entityNumber?.length ? data.entityNumber : "",
          entityType: data.type,
        }
      );

      const newRegData = [
        {
          label: "registrationNumber",
          value: data.registrationNumber,
        },
        { label: "entityNumber", value: data.entityNumber },
        {
          label: "type",
          value:
            data?.type === "002"
              ? "شركات"
              : data?.type === "001"
              ? "مؤسسة فردية"
              : "N/A",
        },
        {
          label: "name",
          value: companyInfoResponse?.data?.data?.entityName || "N/A",
        },
        {
          label: "registrationDate",
          value: companyInfoResponse?.data?.data?.registrationDate || "N/A",
        },
      ];

      const formattedRegData = Object.fromEntries(
        newRegData.map((item) => [item.label, item.value])
      );

      setRegData((prev) => ({ ...prev, ...formattedRegData }));
      setEntityData(newRegData);
      setIsVerified(true);
      setError();
    } catch (error) {
      setError(t("wrong_entity_info"));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (data) => {
    setRegData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  if (!stepOneForm) return <LoadingScreen />;

  return (
    <>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 1,
          }}
        >
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <DynamicForm
        {...stepOneForm}
        loading={loading}
        onSubmit={isVerified ? handleNext : handleVerify}
        defaultValues={defaultValues}
        submitButtonProps={{
          label: isVerified ? t("verified_successfully") : t("verify"),
          alignment: "center",
          width: "100%",
          loading,
          disabled: isVerified,
          backgroundColor: isVerified ? "#3FAF47" : undefined,
        }}
      />

      <Box py={3}>
        {entityData && (
          <>
            {" "}
            <Typography variant="h6">{t("Entity_Information")}</Typography>
            <EntityDataBox data={entityData} />{" "}
          </>
        )}{" "}
      </Box>
      {isVerified && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleNext(regData)}
        >
          {t("next")}
        </Button>
      )}
    </>
  );
}
