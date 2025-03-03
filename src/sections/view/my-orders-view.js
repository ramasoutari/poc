import {
  Container,
  Card,
  Button,
  TextField,
  Box,
  Typography,
  InputLabel,
  Stack,
} from "@mui/material";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import { useGlobalDialogContext } from "../../components/global-dialog";
import { useLocales } from "../../locales";
import { useResponsive } from "../../hooks/use-responsive";
import { useSettingsContext } from "../../components/settings/context";
import { useAuthContext } from "../../auth/hooks";
import Table from "../../components/table copy/table";
import Label from "../../components/label";
import i18n from "../../locales/i18n";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axios";
import { HOST_API } from "../../config-global";
import OrderDetailsDialog from "./dialogs/order-details-dialog";
import EmptyContent from "../../components/empty-content";
import { useForm } from "react-hook-form";
import DynamicForm, { getForm } from "../../components/dynamic-form";
import { useGlobalPromptContext } from "../../components/global-prompt";

const MyOrdersView = () => {
  const { user } = useAuthContext();
  const globalPrompt = useGlobalPromptContext();
  const settings = useSettingsContext();
  const [appNumber, setAppNumber] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isValidFromDate, setIsValidFromDate] = useState();
  const [isValidToDate, setIsValidToDate] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ items: [] });
  const { t } = useLocales();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const globalDialog = useGlobalDialogContext();

  const columns = [
    {
      id: "applicationNumber",
      label: t("order_number"),
      renderRow: (row, column) => (
        <>
          {(!row.isMigrated && !(row?.applicationType?.length > 0)) ||
          [].includes(row?.applicationType) ? (
            <a
              role="button"
              onClick={() => {
                onDetailsClick(row, true);
              }}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "#E5A023",
              }}
            >
              {row[column.id]}
            </a>
          ) : (
            row[column.id]
          )}
        </>
      ),
    },
    {
      id: "createdAt",
      label: t("submission_date"),
      renderRow: (row) => (
        <Label variant="ghost" sx={{}}>
          {moment(row["submission_date"]).locale("en").format("YYYY/MM/DD")}
        </Label>
      ),
    },
    {
      id: "step.descriptionAr",
      label: t("order_status"),
      renderRow: (row) => (
        <Label variant="ghost" sx={{}}>
          {row.step?.descriptionAr || "N/A"}
        </Label>
      ),
    },
    {
      type: "actions",
      label: t("action"),
      align: "center",
      minWidth: 80,
    },
  ];

  const attachmentForm = getForm([
    {
      fieldVariable: "attachmentResponse",
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
          size: 12,
        },
      ],
    },
  ]);
  const textForm = getForm([
    {
      fieldVariable: "textResponse",
      value: "",
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
  const fetchData = async () => {
    try {
      const nationalNumber =
        user.type === "user" ? user?.nationalNumber : user?.entityNumber;

      const response = await axiosInstance.get(
        `${HOST_API}/applications/all/${nationalNumber}`,
        {
          headers: {
            "x-session-id": localStorage.getItem("sessionId"),
          },
        }
      );

      const result = response.data.data;

      setData({
        items: result || [],
      });
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onDetailsClick = async (row) => {
    console.log("row", row);
    globalDialog.onOpen({
      title: t("application_ditails"),
      content: <OrderDetailsDialog appId={row.id} />,
      dialogProps: {
        maxWidth: "md",
        sx: {
          content: {
            // minHeight: '75vh',
            minWidth: "100hv",
          },
        },
      },
    });
  };
  const onRejectionReasonClick = (row) => {
    globalDialog.onOpen({
      content: (
        <Box p={2}>
          <Typography variant="h6" mb={2} sx={{ textAlign: "center" }}>
            {t("rejection_details")}
          </Typography>
          {/* <Typography variant="body1">{row.rejectionReason}</Typography> */}
          <Typography variant="body1" sx={{ textAlign: "center" }} mb={2}>
            {row.rejectionReason}
          </Typography>
        </Box>
      ),
      dialogProps: {
        maxWidth: "sm",
      },
    });
  };
  const textFormDefaultValues = {
    ...textForm.defaultValues,
  };
  const attachmentFormDefaultValues = {
    ...attachmentForm.defaultValues,
  };
  const onDownloadCertificateClick = async (id) => {
    try {
      const response = await fetch(`${HOST_API}/certificate/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      a.download = "certificate.pdf";

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };
  const onExtraInfoClick = (row) => {
    const handleSubmit = async (data) => {
      setLoading(true);
      try {
        const requestBody = row?.extraRequestedInfo?.map((info) => ({
          extraInfoId: info.id,
          ...(info.type === "001" && {
            attachmentResponse: data.attachmentResponse || [],
          }),
          ...(info.type === "002" && {
            textResponse: data.textResponse || "",
          }),
        }));

        const response = await axiosInstance.patch(
          `${HOST_API}/applications/extra/${row.id}`,
          requestBody,
          {
            headers: {
              "x-session-id": localStorage.getItem("sessionId"),
            },
          }
        );
        setLoading(false);
        console.log("Submission successful!");
        fetchData();
        globalDialog.onClose();
        globalPrompt.onOpen({
          type: "success",
          content: (
            <Stack direction="column" spacing={1}>
              <Typography
                component="h6"
                variant="h6"
                fontWeight="fontWeightBold"
              >
                {t("order_sent_successfully")}
              </Typography>
            </Stack>
          ),
          promptProps: {
            icon: "success",
          },
        });
      } catch (error) {
        console.error("Error submitting extra info:", error);
      }
    };

    globalDialog.onOpen({
      content: (
        <Box p={2} sx={{ direction }}>
          <Typography variant="h6" mb={2}>
            {t("extra_info")}
          </Typography>

          {row?.extraRequestedInfo?.map((info) => (
            <Box key={info.id} mb={2}>
              {info.type === "002" ? (
                <>
                  <InputLabel variant="body1" mb={1}>
                    {info.title}
                  </InputLabel>
                  <DynamicForm
                    {...textForm}
                    defaultValues={textFormDefaultValues}
                    validationMode="onChange"
                    onSubmit={handleSubmit}
                    submitButtonProps={{
                      alignment: "center",
                      width: "100%",
                    }}
                  />{" "}
                </>
              ) : info.type === "001" ? (
                <Box>
                  <Typography variant="body1" mb={1}>
                    {info.title}
                  </Typography>
                  <DynamicForm
                    {...attachmentForm}
                    defaultValues={attachmentFormDefaultValues}
                    validationMode="onChange"
                    onSubmit={handleSubmit}
                    submitButtonProps={{
                      alignment: "center",
                      width: "100%",
                      loading,
                    }}
                  />{" "}
                </Box>
              ) : (
                <Typography variant="body1">{t("no_extra_info")}</Typography>
              )}
            </Box>
          ))}
        </Box>
      ),
      dialogProps: {
        maxWidth: "sm",
      },
    });
  };

  const lgUp = useResponsive("up", "lg");
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");

  return (
    <Container
      sx={{ direction }}
      maxWidth={settings.themeStretch ? false : "xl"}
    >
      <Card>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        ></Box>
        <Box
          data-tour-id="orders_filters"
          sx={{
            display: "flex",
            flexDirection: lgUp && mdUp ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            pt: 1,
            mb: 2.5,
          }}
        >
          <>
            <TextField
              placeholder={t("order_number")}
              onChange={(event) => setAppNumber(event.target.value)}
              value={appNumber}
              sx={{
                width: "500px",
                padding: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "2px solid black",
                  },
                  "&:hover fieldset": {
                    border: "2px solid black",
                  },
                  "&.Mui-focused fieldset": {
                    border: "2px solid black",
                  },
                },
              }}
            />

            <DatePicker
              views={["year", "month", "day"]}
              format={"yyyy/MM/dd"}
              maxDate={toDate ? toDate : new Date()}
              value={fromDate ? fromDate : null}
              onChange={(fromDate) => {
                setFromDate(fromDate);
              }}
              fullWidth
              slotProps={{
                textField: {
                  placeholder: t("from"),
                  // helperText: !isValidFromDate ? t("invalid_dates") : null,
                  sx: {
                    width: "250px",
                    padding: "8px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "2px solid black",
                      },
                      "&:hover fieldset": {
                        border: "2px solid black",
                      },
                      "&.Mui-focused fieldset": {
                        border: "2px solid black",
                      },
                    },
                  },
                },
              }}
            />

            <DatePicker
              views={["year", "month", "day"]}
              format={"yyyy/MM/dd"}
              minDate={fromDate}
              maxDate={new Date()}
              value={toDate ? toDate : null}
              onChange={(toDate) => {
                setToDate(toDate);
              }}
              fullWidth
              slotProps={{
                textField: {
                  placeholder: t("to"),
                  // helperText: !isValidToDate ? t("invalid_dates") : null,
                  sx: {
                    width: "250px",
                    padding: "8px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "2px solid black",
                      },
                      "&:hover fieldset": {
                        border: "2px solid black",
                      },
                      "&.Mui-focused fieldset": {
                        border: "2px solid black",
                      },
                    },
                  },
                },
              }}
            />
          </>

          <Box
            sx={{
              ...(smUp &&
                mdUp && {
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }),
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <Button
              // onClick={() => onSubmit()}
              disabled={!isValidToDate || !isValidFromDate}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1D3E6E",
                minWidth: "150px",
                padding: "10px 20px",
              }}
            >
              {t("search")}
            </Button>
            <Button
              // onClick={() => clearFilters()}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1D3E6E",
                minWidth: "150px",
                padding: "10px 20px",
              }}
            >
              {t("remove")}
            </Button>
          </Box>
        </Box>

        <Box sx={{ overflow: "auto" }}>
          <Box
            sx={{ width: "100%", display: "table", tableLayout: "fixed", p: 5 }}
          >
            <Table
              columns={columns}
              loading={loading}
              emptyText={<EmptyContent hideImg title={t("no_data")} />}
              rows={data?.items || []}
              renderActions={(row) => {
                const statusColors = {
                  "004": "#FFA500",
                  "017": "#FFA500",
                  2: "#FFA500",
                  "011": "#FF4242",
                  "012": "#FF4242",
                  5: "#FF4242",
                  3: "#FFA500",
                  "016": "#3FAF47",
                };

                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {["001", "002", "003", "004", "005", "006"].includes(
                      row.statusCode
                    ) && (
                      <a
                        style={{
                          color: statusColors[row.statusCode],
                          fontWeight: "bold",
                        }}
                      >
                        {["003"].includes(row.statusCode) &&
                          row.step.descriptionEn !== "In Progress" && (
                            <a
                              onClick={() => onExtraInfoClick(row)}
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: statusColors[row.statusCode],
                                fontWeight: "bold",
                              }}
                            >
                              {t("details")}
                            </a>
                          )}
                        {["005"].includes(row.statusCode) && (
                          <a
                            onClick={() => onRejectionReasonClick(row)}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: statusColors[row.statusCode],
                              fontWeight: "bold",
                            }}
                          >
                            {t("rejection_details")}
                          </a>
                        )}{" "}
                        {/* {["3"].includes(row.statusCode) && t("payment_details")} */}
                        {["006"].includes(row.statusCode) && (
                          <a
                            onClick={() => {
                              onDownloadCertificateClick(row?.id);
                            }}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: statusColors[row.statusCode],
                              fontWeight: "bold",
                            }}
                          >
                            {t("download_certificate")}
                          </a>
                        )}
                        {["001", "002", "004"].includes(row.statusCode) &&
                          "----"}
                      </a>
                    )}
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default MyOrdersView;
