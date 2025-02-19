import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
// routes
import { RouterLink } from "../../routes/components";
import { useAuthContext } from "../../auth/hooks";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const { user } = useAuthContext();

  const mohLogo = (
    <>
      <Box
        ref={ref}
        component="div"
        sx={{
          width: "260.28570556640625",
          height: "93.83690643310547",
          top: "36.93px",
          left: "918.79px",
        }}
        {...other}
      >
        <img
          src="/logo/logo2.png"
          alt="psd Logo"
          style={{
            width: "auto",
            height: "60px",
          }}
        />
      </Box>
    </>
  );

  if (disabledLink) {
    return mohLogo;
  }

  return (
    <Link
      component={RouterLink}
      href={
        ["cpd-entity", "cpd_entity"].includes(user?.type)
          ? "/cpd-dashboard/training-activity"
          : "/dashboard"
      }
      sx={{ display: "contents" }}
    >
      {mohLogo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
