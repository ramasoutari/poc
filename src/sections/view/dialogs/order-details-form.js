import PropTypes from "prop-types";
// @mui
import { Box, Typography } from "@mui/material";
// hooks
// components
import { useCallback, useEffect, useState } from "react";
import { useLocales } from "../../../locales";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";
import createFormFieldsFromResponse from "../../../utils/create-form-fields-from-response";
import DynamicForm, { getForm } from "../../../components/dynamic-form";

export default function OrderDetailsForm({
  applicationDetails,
  reloadOrders,
  isCPD,
}) {
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState(null);
  const { t } = useLocales();

  useEffect(() => {
    if (applicationDetails) {
      let updatedDetails = applicationDetails.additional_person_info;

      if (isCPD) {
        updatedDetails = updatedDetails.map((field) => ({
          param_GUID: field.GUID,
          param_name: field.RequiredInformation,
          param_type: field.InformationType,
          param_optional: false,
          param_code: field.InformationType_Code,
          param_notes: null,
          param_for_renewal: false,
        }));
      }

      const newFormFields = createFormFieldsFromResponse(
        updatedDetails,
        118,
        12,
        isCPD
      );
      setFormFields(newFormFields);
    }
  }, [isCPD, applicationDetails]);

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        let additionalPersonInfo = Object.entries(data).filter(
          ([param_GUID]) => {
            return (
              !param_GUID.includes("_filename") &&
              !param_GUID.includes("_filename_display") &&
              !param_GUID.includes("_type") &&
              !param_GUID.includes("_base64") &&
              !param_GUID.includes("_attachmentName") &&
              !param_GUID.includes("_attachment_name")
            );
          }
        );
        additionalPersonInfo = additionalPersonInfo.map(
          ([param_GUID, param_value, param_type]) => {
            let param_type_new = param_type;

            if (!param_type_new && isCPD) {
              param_type_new = applicationDetails?.additional_person_info.find(
                (x) => x.GUID === param_GUID
              )?.InformationType_Code;
            }

            let param_value_to_send = param_value;
            if (
              isCPD &&
              Array.isArray(param_value) &&
              param_type_new === "003"
            ) {
              param_value_to_send = param_value[0];
            }

            return {
              param_GUID,
              param_value: param_value_to_send,
              param_type,
            };
          }
        );

        const url = isCPD
          ? `submitCPDHCPAdditionalInfo`
          : `UpdatePersonApplication`;

        const payload = isCPD
          ? {
              applicationGUID: applicationDetails?.guid,
              applicationType:
                applicationDetails?.applicationType ||
                applicationDetails?.serviceType,
              additional_person_info: additionalPersonInfo.map(
                ({ param_GUID, param_type, param_value }) => ({
                  param_GUID,
                  param_type: applicationDetails.additional_person_info.find(
                    (x) => x.GUID === param_GUID
                  )?.InformationType_Code,
                  param_value: param_value,
                })
              ),
            }
          : {
              GUID: applicationDetails?.GUID,
              additional_person_info: additionalPersonInfo,
            };

        await axiosInstance.post(`${HOST_API}/${url}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setSubmitted(true);
        reloadOrders();
        console.log("Submitting Payload:", payload);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [applicationDetails?.additional_person_info]
  );

  return (
    <Box p={2} width="100%">
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        {t("Additional_info_form")}
      </Typography>

      {submitted ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">
            {t("order_sent_successfully")}
          </Typography>
        </Box>
      ) : formFields ? (
        <DynamicForm
          {...getForm(formFields)}
          onSubmit={onSubmit}
          defaultValues={formFields.defaultValues}
          validationMode="onChange"
          submitButtonProps={{
            width: "100%",
            loading: loading,
          }}
        />
      ) : (
        <Typography variant="body2">{t("loading_form")}</Typography> // Display a loading message while the form fields are being set
      )}
    </Box>
  );
}

OrderDetailsForm.propTypes = {
  applicationDetails: PropTypes.object.isRequired,
  reloadOrders: PropTypes.func.isRequired,
  isCPD: PropTypes.bool.isRequired,
};
