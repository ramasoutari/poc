import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
// @mui
import { alpha } from "@mui/material/styles";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";

//
import SvgColor from "../svg-color/svg-color";
//
import RejectionFiles from "./errors-rejection-files";
import { useTranslation } from "react-i18next";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function UploadField({
  error,
  file,
  disabled,
  helperText,
  sx,
  loading,
  multiple,
  ...other
}) {
  const { t } = useLocales();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: multiple,
    disabled: disabled || loading,
    // accept: {
    //   'image/jpg': [],
    //   'image/jpeg': [],
    //   'image/png': [],
    //   'image/gif': [],
    //   'application/pdf': [],
    //   'application/msword': [],
    // },
    ...other,
  });

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const fileUrl = ["string", "number"].includes(typeof file)
    ? file
    : file?.path;
  const renderPlaceholder = (
    <Box sx={{ position: "relative" }}>
      <TextField
        sx={{
          color: "text.disabled",
          "&:hover": {
            opacity: 0.72,
          },
          ...(hasError && {
            color: "error.main",
          }),
        }}
        value={fileUrl ? fileUrl : t("click_to_attach_file")}
        disabled
        InputProps={{
          startAdornment: <>{loading && <CircularProgress size={24} />}</>,
          endAdornment: (
            <IconButton
            // {...getRootProps()}
            >
              <SvgColor src="/icons/attach.svg" color="primary.main" />
            </IconButton>
          ),
        }}
        fullWidth
      />

      <div
        {...getRootProps()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );

  const renderContent = <>{renderPlaceholder}</>;

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          ...(hasFile && {
            ...(hasError && {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }),
          }),
          ...sx,
        }}
      >
        <input
          {...getInputProps()}
          onChange={(e) => {
            getInputProps().onChange(e);
            e.target.value = null;
          }}
        />

        {renderContent}
      </Box>

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}

UploadField.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.string,
  sx: PropTypes.object,
};
