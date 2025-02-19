import PropTypes from "prop-types";
// @mui
import { Typography } from "@mui/material";

export default function InputLabel({ htmlFor, variant, label, sx, ...other }) {
  return (
    <Typography
      component="label"
      variant={variant || "body2"}
      htmlFor={htmlFor}
      fontWeight="fontWeightBold"
      sx={{
        mb: 1,
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: "#ED8539",
        paddingLeft: 0.5,
        ...sx,
      }}
      {...other}
    >
      {label}
    </Typography>
  );
}

InputLabel.propTypes = {
  id: PropTypes.string,
  variant: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  sx: PropTypes.object,
};
