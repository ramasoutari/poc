import { Container, Card, Button, TextField, Box } from "@mui/material";
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
  const direction = i18n.language === "ar" ? "ltr" : "rtl";

  const dummyOrders = [
    {
      order_number: "ORD001",
      national_number: "123456789",
      full_name: "John Doe",
      service_name: "Service A",
      submission_date: moment().subtract(5, "days").toISOString(),
      certificate_issue_date: moment().subtract(2, "days").toISOString(),
      certificate_expiry_date: moment().add(1, "year").toISOString(),
      order_status: "Pending",
      applicationType: "",
      isMigrated: false,
    },
    {
      order_number: "ORD002",
      national_number: "987654321",
      full_name: "Jane Smith",
      service_name: "Service B",
      submission_date: moment().subtract(10, "days").toISOString(),
      certificate_issue_date: moment().subtract(5, "days").toISOString(),
      certificate_expiry_date: moment().add(2, "years").toISOString(),
      order_status: "Approved",
      applicationType: "",
      isMigrated: false,
    },
    {
      order_number: "ORD003",
      national_number: "456123789",
      full_name: "Alice Johnson",
      service_name: "Service C",
      submission_date: moment().subtract(20, "days").toISOString(),
      certificate_issue_date: moment().subtract(10, "days").toISOString(),
      certificate_expiry_date: moment().add(3, "years").toISOString(),
      order_status: "Rejected",
      applicationType: "",
      isMigrated: false,
    },
  ];

  const columns = [
    {
      id: "order_number",
      label: t("order_number"),
      renderRow: (row, column) => (
        <>
          {(!row.isMigrated && !(row?.applicationType?.length > 0)) ||
          [].includes(row?.applicationType) ? (
            <a
              role="button"
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
      id: "submission_date",
      label: t("submission_date"),
      renderRow: (row) => (
        <Label variant="ghost" sx={{}}>
          {moment(row["submission_date"]).locale("en").format("YYYY/MM/DD")}
        </Label>
      ),
    },
    {
      id: "order_status",
      label: t("order_status"),
      renderRow: (row, column) => (
        <Label variant="ghost" sx={{}}>
          {row[column.id]}
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
    // handleSearch(filters, page)
  };

  useEffect(() => {
    setData({ items: dummyOrders || [] }); // Default to an empty array if dummyOrders is undefined
    setLoading(false);
  }, []);

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
            gap: 1,
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
              rows={data?.items || []} // Provide an empty array if data?.items is undefined
              pagination={
                data?.items
                  ? {
                      onChangePage: (page) => {
                        onPageChange(page + 1);
                      },
                      onChangeRowsPerPage: (e) => {
                        onChangeRowsPerPage(e.target.value);
                      },
                      rowsPerPage,
                      page: currentPage - 1,
                      total: data?.totalRecords,
                    }
                  : false
              }
              renderActions={(row) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <>
                    {/* "011" اسباب رفض الطلب */}
                    {/* "004" معلومات اضافية */}
                    {/* "009" + "016" طلب دفع */}
                    {[
                      "004",
                      "009",
                      "011",
                      "016",
                      "017",
                      "3",
                      "2",
                      "5",
                    ].includes(row.statusCode) && (
                      <StyledActionButton
                        // onClick={() => ()}
                        variant="outlined"
                        color="secondary"
                        size="small"
                      >
                        {["004", "017", "2"].includes(row.statusCode) &&
                          t("details")}
                        {["011", "012", "5"].includes(row.statusCode) &&
                          t("rejection_details")}
                        {["009", "016", "3"].includes(row.statusCode) &&
                          t("payment_details")}
                      </StyledActionButton>
                    )}
                  </>
                </Box>
              )}
            />
          </Box>
          <Button>
hhi
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default MyOrdersView;
