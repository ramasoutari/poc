import PropTypes from "prop-types";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import { useLocales } from "../../../locales";
import axiosInstance from "../../../utils/axios";
import { HOST_API } from "../../../config-global";
import Iconify from "../../../components/iconify";
import i18n from "../../../locales/i18n";
import { LoadingScreen } from "../../../components/loading-screen";

export default function OrderDetailsDialog({ applicationNumber }) {
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const globalDialog = useGlobalDialogContext();
  const { t } = useLocales();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const handleFetchAppDetails = () => {
    axiosInstance
      .get(`${HOST_API}/applications/one/${applicationNumber}`, {
        headers: {
          "x-session-id": localStorage.getItem("sessionId"),
        },
      })
      .then((response) => {
        setApplicationDetails(response.data.application);
      })
      .catch((error) => {
        console.error("Error fetching application details:", error);
      })
      .finally(() => {
        setApplicationLoading(false);
      });
  };

  useEffect(() => {
    if (applicationNumber) {
      handleFetchAppDetails();
    }
  }, [applicationNumber]);

  if (applicationLoading) {
    return <LoadingScreen />;
  }

  if (!applicationDetails) {
    return <Typography>{t("no_data_available")}</Typography>;
  }

  const {
    soilAttachments = [],
    environmantalAttachments = [],
    noObjectionAttachment = [],
    additional_attachments = [],
  } = applicationDetails;
  const hasAnyAttachments =
    soilAttachments.length > 0 ||
    environmantalAttachments.length > 0 ||
    noObjectionAttachment.length > 0 ||
    additional_attachments.length > 0;
  return (
    <Box sx={{ direction, p: 2 }}>
      <Stack display="flex" direction="column">
        {hasAnyAttachments && (
          <Typography fontWeight="bold">{t("attachments")}:</Typography>
        )}

        {soilAttachments.length > 0 && (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography fontWeight="500" p={1}>
              {t("soilTestAttachment")}:
            </Typography>
            <Box display="flex" alignItems="center">
              {soilAttachments.map((attachId, index) => (
                <Box key={index} display="flex" flexDirection="column" mr={1}>
                  <Button
                    onClick={() =>
                      window.open(
                        `${HOST_API}/GetAttachment/${attachId.id}`,
                        "_blank"
                      )
                    }
                    size="small"
                    sx={{
                      backgroundColor: "#e6e6e6",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography px={0.5}>{attachId.fileName}</Typography>
                    <Iconify icon={"mdi:eye"} width={15} />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {environmantalAttachments.length > 0 && (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography fontWeight="500" p={1}>
              {t("environmentalAttachment")}:
            </Typography>
            <Box display="flex" alignItems="center">
              {environmantalAttachments.map((attachId, index) => (
                <Box key={index} display="flex" flexDirection="column" mr={1}>
                  <Button
                    onClick={() =>
                      window.open(
                        `${HOST_API}/GetAttachment/${attachId.id}`,
                        "_blank"
                      )
                    }
                    size="small"
                    sx={{
                      backgroundColor: "#e6e6e6",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography px={0.5}>{attachId.fileName}</Typography>
                    <Iconify icon={"mdi:eye"} width={15} />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {noObjectionAttachment.length > 0 && (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography fontWeight="500" p={1}>
              {t("noObjectionAttachment")}:
            </Typography>
            <Box display="flex" alignItems="center">
              {noObjectionAttachment.map((attachId, index) => (
                <Box key={index} display="flex" flexDirection="column" mr={1}>
                  <Button
                    onClick={() =>
                      window.open(
                        `${HOST_API}/GetAttachment/${attachId.id}`,
                        "_blank"
                      )
                    }
                    size="small"
                    sx={{
                      backgroundColor: "#e6e6e6",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography px={0.5}>{attachId.fileName}</Typography>
                    <Iconify icon={"mdi:eye"} width={15} />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {additional_attachments.length > 0 && (
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography fontWeight="500" p={1}>
              {t("additional_attachments")}:
            </Typography>
            <Box display="flex" alignItems="center">
              {additional_attachments.map((attachId, index) => (
                <Box key={index} display="flex" flexDirection="column" mr={1}>
                  <Button
                    onClick={() =>
                      window.open(
                        `${HOST_API}/GetAttachment/${attachId.id}`,
                        "_blank"
                      )
                    }
                    size="small"
                    sx={{
                      backgroundColor: "#e6e6e6",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography px={0.5}>{attachId.fileName}</Typography>
                    <Iconify icon={"mdi:eye"} width={15} />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

OrderDetailsDialog.propTypes = {
  applicationNumber: PropTypes.string.isRequired,
};
