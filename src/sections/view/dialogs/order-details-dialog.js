import PropTypes from "prop-types";
// @mui
import { Box, Button, Stack, Typography } from "@mui/material";
// hooks
import { useEffect, useState } from "react";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import { useLocales } from "../../../locales";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";
import { LoadingScreen } from "../../../components/loading-screen";
import { useAuthContext } from "../../../auth/hooks";
import Iconify from "../../../components/iconify";
import Grid2 from "@mui/material/Unstable_Grid2";

// ----------------------------------------------------------------------

export default function OrderDetailsDialog({ applicationInfo }) {
  const [applicationDetails, setApplicationDetails] = useState({});
  const [applicationLoading, setApplicationLoading] = useState(true);
  const globalDialog = useGlobalDialogContext();
  const { t } = useLocales();

  const handleFetchAppDetails = () => {
    axiosInstance
      .get(`${HOST_API}/applications/one/${applicationInfo?.applicationNumber}`)
      .then((response) => {
        setApplicationDetails(response.data.application);
        setApplicationLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching application details:", error);
        setApplicationLoading(false);
      });
  };

  useEffect(() => {
    handleFetchAppDetails();
  }, [applicationInfo]);

  return (
    <Box>
      {applicationLoading && <LoadingScreen />}
      {!applicationLoading && (
        <Grid2 p={1} container spacing={2}>
          <Grid2 xs={12}>
            <Typography fontWeight={"bold"}>
              {t("extraInfo")}: {applicationDetails.extraInfo}
            </Typography>
          </Grid2>

          <Box>
            <Stack display={"flex"} direction={"column"}>
              {/* Display environmental attachments */}
              {applicationDetails.environmantalAttachments?.length > 0 && (
                <>
                  <Typography fontWeight={"bold"}>
                    {t("environmentalAttachments")}
                  </Typography>
                  {applicationDetails.environmantalAttachments.map((attach) => (
                    <Box key={attach.id} display={"flex"} mb={1}>
                      <Button
                        onClick={() => {
                          window.open(
                            `${HOST_API}/GetAttachment/${attach.id}`,
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
                        <Typography px={0.5}>{attach.fileName}</Typography>
                        <Iconify icon={"mdi:eye"} width={15} />
                      </Button>
                    </Box>
                  ))}
                </>
              )}

              {/* Display soil attachments */}
              {applicationDetails.soilAttachments?.length > 0 && (
                <>
                  <Typography fontWeight={"bold"}>
                    {t("soilAttachments")}
                  </Typography>
                  {applicationDetails.soilAttachments.map((attach) => (
                    <Box key={attach.id} display={"flex"} mb={1}>
                      <Button
                        onClick={() => {
                          window.open(
                            `${HOST_API}/GetAttachment/${attach.id}`,
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
                        <Typography px={0.5}>{attach.fileName}</Typography>
                        <Iconify icon={"mdi:eye"} width={15} />
                      </Button>
                    </Box>
                  ))}
                </>
              )}
            </Stack>
          </Box>
        </Grid2>
      )}
      <Button
        onClick={() => globalDialog.onClose()}
        variant="contained"
        color="secondary"
        width="auto"
        sx={{ mt: 4 }}
      >
        {t("close")}
      </Button>
    </Box>
  );
}

OrderDetailsDialog.propTypes = {
  applicationInfo: PropTypes.shape({
    guid: PropTypes.string.isRequired,
    applicationNumber: PropTypes.string,
    applicantType: PropTypes.string,
    // Add other relevant props as needed
  }).isRequired,
};
