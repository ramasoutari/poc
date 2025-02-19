import React from "react";
import PropTypes from "prop-types";
// @mui
import { Box, Typography } from "@mui/material";

export default function FormSection({ label, description, descriptionStyle }) {
  return (
    <Box py={1}>
      {label && (
        <Typography variant="h5" mb={0}>
          {label}
        </Typography>
      )}

      <Typography variant="body2" color="textSecondary" sx={{
        ...descriptionStyle
      }}>
        {description}
      </Typography>
    </Box>
  );
}

FormSection.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
};
