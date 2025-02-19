import PropTypes from "prop-types";
// @mui
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
// hooks
// components
import { useEffect, useState } from "react";
import OrderDetailsForm from "./order-details-form";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import Table from "../../../components/table";
import { useLocales } from "../../../locales";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";
import { LoadingScreen } from "../../../components/loading-screen";
import { useResponsive } from "../../../hooks/use-responsive";
import { useAuthContext } from "../../../auth/hooks";
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

export default function OrderDetailsDialog({
  showStakeholders,
  isCPDDetails,
  reloadOrders,
  applicationInfo,
  fromAppNo,
}) {
  const { accessToken } = useAuthContext();
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [eFwateercomPaymentLoading, setEFwateercomPaymentLoading] =
    useState(false);
  const [didPayViaEfawateercom, setDidPayViaEfawateercom] = useState(false);
  const globalDialog = useGlobalDialogContext();
  const { t } = useLocales();
  const lgUp = useResponsive("up", "lg");
  const getCertificate = (id) => {
    axiosInstance
      .get(`${HOST_API}/GetAttachment/${id}`, {
        responseType: "blob",
      })
      .then((blob) => {
        const fileURL = URL.createObjectURL(blob.data);

        // we need to download the file
        window.open(fileURL, "_blank");
      });
  };

  // const handlePayViaEfawateercom = async () => {
  //   try {
  //     setEFwateercomPaymentLoading(true);
  //     await axiosInstance.post(
  //       `${HOST_API}/UpdatePersonApplicationPayment`,
  //       {
  //         application_payment_type: ['009'].includes(applicationDetails?.StatusCode)
  //           ? '001'
  //           : '002',
  //         payment_number: applicationDetails?.payment_info[0]?.payment_number,
  //         payment_referance: 'qweasdzxca',
  //         payment_reference: 'qweasdzxca',
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setDidPayViaEfawateercom(true);
  //     reloadOrders();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setEFwateercomPaymentLoading(false);
  //   }
  // };
  const handleFetchAppDetailsByType = () => {
    applicationInfo.StatusCode = applicationInfo.statusCode;
    if (
      [
        "POSTPONEMENT_EXEMPTION",
        "COMPLETION_CERT",
        // DWT_GUIDS.applicationType.SELF_ACTIVITY,
      ].includes(applicationInfo?.applicationType) &&
      !(applicationInfo.StatusCode === "2" && !fromAppNo)
    ) {
      let api = "";
      if (applicationInfo?.applicationType === "POSTPONEMENT_EXEMPTION") {
        api = "getCPDPostponeExemptionApplicationDetails";
      } else if (applicationInfo?.applicationType === "COMPLETION_CERT") {
        api = "getCPDCertificateApplicationDetails";
      } else if (
        applicationInfo?.applicationType ===
        HOST_API.applicationType.SELF_ACTIVITY
      ) {
        api = "getCPDSelfActivityApplicationDetails";
      }
      axiosInstance
        .get(`${HOST_API}/${api}?GUID=${applicationInfo?.guid}`)
        .then((response) => {
          setApplicationDetails({ ...applicationInfo, ...response.data.data });
          setApplicationLoading(false);
        });
    } else if (applicationInfo.StatusCode === "2" && !fromAppNo) {
      axiosInstance
        .get(
          `${HOST_API}/getCPDHCPApplicationAdditionalPersonInfo?applicationGUID=${applicationInfo?.guid} `
        )
        .then((response) => {
          setApplicationDetails({
            ...applicationInfo,
            additional_person_info: response.data.data,
          });
          setApplicationLoading(false);
        });
    }
  };

  useEffect(() => {
    if (applicationInfo?.applicationType) {
      handleFetchAppDetailsByType();
    } else {
      axiosInstance
        .post(`${HOST_API}/GetUserApplication`, {
          guid: applicationInfo?.guid,
        })
        .then((response) => {
          setApplicationDetails(response.data.data);
          setApplicationLoading(false);
        });
    }
  }, []);

  const handleCopyToClipboard = (paymentNumber) => {
    if (paymentNumber) {
      navigator.clipboard
        .writeText(paymentNumber)
        .then(() => {})
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    }
  };

  return (
    <Box
      sx={
        showStakeholders
          ? {
              py: 3,
              px: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: 'center',
            }
          : {
              py: 3,
              px: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }
      }
    >
      {applicationLoading && <LoadingScreen />}
      {!applicationLoading && (
        <>
          {showStakeholders && (
            <>
              <Grid2 p={1} container spacing={2}>
                {applicationDetails.stakeholder_info?.map(
                  (stakeholder, index) => (
                    <Grid2
                      key={index}
                      xs={12}
                      md={stakeholder.grid_size || 4}
                      lg={stakeholder.grid_size || 4}
                    >
                      <Box>
                        {/* <StackholderInfoCard
                        data={stakeholder}
                        byPassEntries
                        applicationDetails={applicationDetails}
                      /> */}
                      </Box>
                    </Grid2>
                  )
                )}
                <Box>
                  <Stack display={"flex"} direction={"column"}>
                    {applicationDetails?.all_personal_data?.length > 0 && (
                      <Typography fontWeight={"bold"}>
                        {t["attachments"]}
                      </Typography>
                    )}

                    {applicationDetails?.all_personal_data?.map(
                      (field) =>
                        (field?.param_code == "003" ||
                          field?.param_code == "004") && (
                          <Box
                            key={field.param_GUID}
                            display={"flex"}
                            flexDirection="column"
                            alignItems="flex-start"
                          >
                            <Typography fontWeight={"500"} p={1}>
                              -{field.param_name}:
                            </Typography>
                            <Box
                              display={"flex"}
                              flexDirection={lgUp ? "row" : "column"}
                              alignItems="center"
                            >
                              {!field?.entered && !field.param_attach && (
                                <Typography px={0.5}>
                                  {field?.param_value}
                                </Typography>
                              )}

                              {Array.isArray(field.param_attach) &&
                                field.param_attach?.map((attach, index) => (
                                  <Box
                                    key={index}
                                    display={"flex"}
                                    direction={"column"}
                                    justifyContent="space-between"
                                    mr={1}
                                  >
                                    <Box display={"flex"} mb={1}>
                                      <Button
                                        onClick={() => {
                                          window.open(
                                            `${HOST_API}/GetAttachment/${attach.attach_id}`,
                                            "_blank"
                                          );
                                        }}
                                        size="small"
                                        style={{
                                          backgroundColor: "#e6e6e6",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography px={0.5}>
                                          {attach.attach_name}
                                        </Typography>
                                        <Iconify icon={"mdi:eye"} width={15} />
                                      </Button>
                                    </Box>
                                  </Box>
                                ))}

                              {field.param_attach &&
                                !Array.isArray(field.param_attach) && (
                                  <Typography>
                                    {field.param_attach.attach_name}
                                  </Typography>
                                )}
                            </Box>
                          </Box>
                        )
                    )}
                  </Stack>
                </Box>
              </Grid2>

              {isCPDDetails && (
                <>
                  {/* I need to show all the following label/values with you can find under "filledFormInfo"*/}
                  {/* Country_of_Residence,ExemptionPostponeHours,Name_of_University,Practice_in_country_residence,Reasons_for_exemption,Reasons_for_postponement,Serial,Type,Type_of_disease,professional_development_activities,yearsOfPostponement */}
                  <Typography variant="h6" component="h1" mb={1}>
                    {t["details"]}
                  </Typography>
                  <Box
                    component="ul"
                    style={{
                      listStyleType: "none",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {applicationDetails?.filledFormInfoBulletPoints?.map(
                      (x, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography fontWeight={"bold"}>
                            {Array.isArray(x?.value) && x?.value > 1
                              ? t["attachmnets"]
                              : x?.label}
                            :
                          </Typography>
                          {x?.type === "FILE" ? (
                            <>
                              {typeof x?.value === "string" && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    window.open(
                                      HOST_API.showAttachment(x.value)
                                    )
                                  }
                                >
                                  {t["view_attachment"]}
                                </Button>
                              )}
                              {Array.isArray(x?.value) && (
                                <>
                                  {x.value.map((y, index) => (
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() =>
                                        window.open(HOST_API.showAttachment(y))
                                      }
                                    >
                                      {t["view_attachment"]}{" "}
                                      {x?.value?.length > 1
                                        ? `(${index + 1})`
                                        : ""}
                                    </Button>
                                  ))}
                                </>
                              )}
                            </>
                          ) : (
                            x.value
                          )}
                        </Box>
                      )
                    )}

                    {/* Additional CPD Info */}
                    {applicationDetails?.filledAdditionalInfoBulletPoints?.map(
                      (x, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography fontWeight={"bold"}>
                            {x?.label}:
                          </Typography>
                          {x?.type === "FILE" && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                window.open(HOST_API.showAttachment(x.value))
                              }
                            >
                              {t["view_attachment"]}
                            </Button>
                          )}

                          {x?.type === "FILES" && (
                            <>
                              {x?.value?.map((y) => (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    window.open(HOST_API.showAttachment(y))
                                  }
                                >
                                  {t["view_attachment"]}
                                </Button>
                              ))}
                            </>
                          )}

                          {!["FILE", "FILES"].includes(x?.type) && (
                            <>{x?.value}</>
                          )}
                        </Box>
                      )
                    )}
                  </Box>
                </>
              )}
            </>
          )}
          {!showStakeholders && (
            <>
              {applicationDetails?.certificate_info?.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    getCertificate(
                      applicationDetails?.certificate_info[0]?.certificateFile
                    )
                  }
                >
                  {t["download_certificate"]}
                </Button>
              )}

              <>
                {["011", "5"].includes(applicationDetails?.StatusCode) && (
                  <>
                    <Typography variant="h6" component="h1" mb={1}>
                      {t["rejection_info"]}
                    </Typography>
                    {applicationDetails?.StatusCode === "011" && (
                      <Typography p={"10px"} variant="body2" py={3}>
                        {applicationDetails?.rejection_info[0]?.RejectionReason
                          ? applicationDetails?.rejection_info[0]
                              ?.RejectionReason
                          : t["no_rejection_reason"]}
                      </Typography>
                    )}
                    {applicationDetails?.StatusCode === "5" && (
                      <Typography p={"10px"} variant="body2" py={3}>
                        {applicationDetails?.Rejection_reason
                          ? applicationDetails?.Rejection_reason
                          : t["no_rejection_reason"]}
                      </Typography>
                    )}
                  </>
                )}
              </>

              {["009", "016", "3"].includes(applicationDetails?.StatusCode) && (
                <>
                  {["009", "016"].includes(applicationDetails?.StatusCode) &&
                    applicationDetails?.payment_info?.length > 0 && (
                      <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                      >
                        <Typography variant="h6" component="h1" mb={1}>
                          {t["payment_info"]}
                        </Typography>
                        <Typography m={2} variant="body2" sx={{ mb: 2 }}>
                          {t["please_pay_via_efawateercom"]}
                        </Typography>
                        <Stack
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          gap={1}
                        >
                          <Typography mx={2} variant="body2">
                            <b>{t["payment_number"]}</b>:
                            {
                              applicationDetails?.payment_info[0]
                                ?.payment_number
                            }
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleCopyToClipboard(
                              applicationDetails?.payment_info[0]
                                ?.payment_number
                            )}
                          >
                            {t["copy"]}
                          </Button>
                        </Stack>

                        <Typography variant="body2">
                          <b>{t["payment_amount"]}</b>:{" "}
                          {applicationDetails?.payment_info[0]?.payment_value}{" "}
                          {t["JOD"]}
                        </Typography>

                        <Box my={2}>
                          <Button
                            component="a"
                            href="//customer.efawateercom.jo"
                            target="_blank"
                            rel="noopener noreferrer"
                            loading={eFwateercomPaymentLoading}
                            variant="contained"
                            color="primary"
                          >
                            {t["pay_via_efawateercom"]}
                          </Button>
                        </Box>
                      </Stack>
                    )}
                  {applicationDetails?.StatusCode === "3" && (
                    <>
                      <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                      >
                        <Typography variant="h6" component="h1" mb={1}>
                          {t["payment_info"]}
                        </Typography>
                        <Typography m={2} variant="body2" sx={{ mb: 2 }}>
                          {t["please_pay_via_efawateercom"]}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            gap={2}
                          >
                            <Typography mx={2} variant="body2">
                              <b>{t["payment_number"]}</b>:
                              {applicationDetails?.PaymentNumber}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => {
                                handleCopyToClipboard(
                                  applicationDetails?.PaymentNumber
                                );
                              }}
                            >
                              {t["copy"]}
                            </Button>
                          </Stack>
                        </Box>

                        <Typography variant="body2">
                          <b>{t["payment_amount"]}</b>:{" "}
                          {applicationDetails?.Fees} {t["JOD"]}
                        </Typography>

                        <Box my={2}>
                          <Button
                            component="a"
                            href="//customer.efawateercom.jo"
                            target="_blank"
                            rel="noopener noreferrer"
                            loading={eFwateercomPaymentLoading}
                            variant="contained"
                            color="primary"
                          >
                            {t["pay_via_efawateercom"]}
                          </Button>
                        </Box>
                      </Stack>
                    </>
                  )}
                </>
              )}

              {["004", "2"].includes(applicationDetails?.StatusCode) && (
                <>
                  {applicationDetails.StatusCode === "004" &&
                    (applicationDetails?.additional_person_info?.length > 0 ? (
                      <OrderDetailsForm
                        applicationDetails={applicationDetails}
                        reloadOrders={reloadOrders}
                      />
                    ) : (
                      <Typography variant="body2" py={3}>
                        {t["no_additional_person_info"]}
                      </Typography>
                    ))}
                  {applicationDetails.StatusCode === "2" && (
                    <>
                      <OrderDetailsForm
                        applicationDetails={applicationDetails}
                        reloadOrders={reloadOrders}
                        isCPD={true}
                      />
                    </>
                  )}
                </>
              )}
              {["017"].includes(applicationDetails?.StatusCode) && (
                <>
                  {applicationDetails?.exam_info?.length > 0 && (
                    <Box width={"100%"}>
                      <Table
                        columns={[
                          {
                            id: "exam_name",
                            label: t["exam_name"],
                          },
                          { id: "exam_date", label: t["exam_date"] },
                          {
                            id: "exam_time",
                            label: t["exam_time"],
                          },
                          {
                            id: "notes",
                            label: t["notes"],
                          },
                        ]}
                        rows={applicationDetails?.exam_info?.map((exam) => ({
                          ...exam,
                          exam_name: exam?.ExamName ? exam.ExamName : "",
                          exam_date: exam?.Exam_Date
                            ? new Date(exam.Exam_Date).toLocaleDateString(
                                "en-US"
                              )
                            : "",
                          exam_time: exam?.Exam_Time
                            ? exam.Exam_Time.split(":").slice(0, 2).join(":")
                            : "",
                          notes: exam?.Notes ? exam.Notes : "",
                        }))}
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <Button
        onClick={() => globalDialog.onClose()}
        variant="contained"
        color="secondary"
        width="auto"
        sx={{
          mt: 4,
        }}
      >
        {t["close"]}
      </Button>
    </Box>
  );
}

OrderDetailsDialog.propTypes = {
  additional_person_info: PropTypes.array.isRequired,
};

OrderDetailsDialog.propTypes = {};
