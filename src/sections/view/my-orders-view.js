import {
  Container,
  Card,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router";
import { DatePicker } from "@mui/x-date-pickers";
import { useParams, useRouter } from "../../routes/hooks";
import { useGlobalDialogContext } from "../../components/global-dialog";
import { useLocales } from "../../locales";
import { useResponsive } from "../../hooks/use-responsive";
import { useSettingsContext } from "../../components/settings/context";
import { useAuthContext } from "../../auth/hooks";
import Table from "../../components/table copy/table";
import { StyledActionButton } from "../../components/custom-styled-components";
import Label from "../../components/label";
import i18n from "../../locales/i18n";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { HOST_API } from "../../config-global";
import OrderDetailsDialog from "./dialogs/order-details-dialog";
import EmptyContent from "../../components/empty-content";

const MyOrdersView = () => {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const [filters, setFilters] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [appNumber, setAppNumber] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isValidFromDate, setIsValidFromDate] = useState();
  const [isValidToDate, setIsValidToDate] = useState();
  const [filterNationalNumber, setFilterNationalNumber] = useState("");
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
      id: "step.descriptionAr", // Update the id to reflect the nested property
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

  const onChangeRowsPerPage = (rows) => {
    setCurrentPage(1);
    setRowsPerPage(rows);
    // handleSearch(filters, 1, rows)
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
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

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const validateFromDate = () => {
      const currentDate = new Date();
      if (fromDate) {
        if (
          isNaN(fromDate.getTime()) ||
          fromDate > currentDate ||
          (toDate && fromDate > toDate)
        ) {
          setIsValidFromDate(false);
        } else {
          setIsValidFromDate(true);
        }
      } else setIsValidFromDate(true);
    };

    const validateToDate = () => {
      const currentDate = new Date();
      if (toDate) {
        if (
          isNaN(toDate.getTime()) ||
          toDate > currentDate ||
          (fromDate && fromDate > toDate)
        ) {
          setIsValidToDate(false);
        } else setIsValidToDate(true);
      } else setIsValidToDate(true);
    };

    validateFromDate();
    validateToDate();
  }, [fromDate, toDate]);

  const clearFilters = () => {
    setToDate();
    setFromDate();
    setAppNumber("");
    setFilterNationalNumber("");
    setFilters({
      order_number: null,
      from: null,
      to: null,
      national_number: null,
    });
  };

  const onSubmit = () => {
    setFilters({
      order_number: appNumber,
      from: fromDate,
      to: toDate,
      national_number: filterNationalNumber,
    });
  };
  const onDetailsClick = async (row) => {
    console.log("row", row);
    globalDialog.onOpen({
      title: t("application_ditails"),
      content: <OrderDetailsDialog applicationNumber={row.applicationNumber} />,
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

  const onExtraInfoClick = (row) => {
    globalDialog.onOpen({
      content: (
        <Box p={2} sx={{ direction }}>
          <Typography variant="h6" mb={2}>
            {t("extra_info")}
          </Typography>
          <TextField
            fullWidth
            multiline
            label={row?.extraRequestedInfo?.label || ""}
            value={row?.extraRequestedInfo?.field || ""}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            // onClick={() =>}
            fullWidth
            sx={{
              mt: 4,
            }}
          >
            {t("submit")}
          </Button>
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
                  helperText: !isValidFromDate ? t("invalid_dates") : null,
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
                  helperText: !isValidToDate ? t("invalid_dates") : null,
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
              onClick={() => onSubmit()}
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
              onClick={() => clearFilters()}
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
                        {["003"].includes(row.statusCode) && (
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
                        {["006"].includes(row.statusCode) &&
                          t("download_certificate")}
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
