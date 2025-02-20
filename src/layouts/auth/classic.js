import PropTypes from "prop-types";
// @mui
import { alpha } from "@mui/material/styles";
import { Box, Stack, Typography, Container } from "@mui/material";
import Logo from "../../components/logo";
import { LoadingScreen } from "../../components/loading-screen";
import i18n from "../../locales/i18n";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children }) {
  const { t } = useLocales();
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Logo
          sx={{
            width: "160px",
          }}
        />
      </Box>
    </Stack>
  );
  const renderContent = <Box>{children}</Box>;
  if (!t) {
    return <LoadingScreen />;
  }

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Left Side - Image Section */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `url(/logo/login-image.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            bgcolor: (theme) => alpha(theme.palette.common.black, 0.6),
          }}
        />
        {/* Centered Text */}
        <Box
          sx={{
            position: "absolute",
            top: "360.95px",
            left: "450.11px",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            color="common.white"
            sx={{
              fontFamily: "Droid Arabic Kufi",
              fontWeight: 550,
              fontSize: "10px",
              lineHeight: "60px",
              textAlign: "center",
            }}
          >
            نظام الموافقة على تركيب المضخات والتزود بالوقود في محطة محروقات
          </Typography>
        </Box>
      </Box>
      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "782.1265258789062",
          height: "1024",
          backgroundColor: "common.white",
          borderTopRightRadius: "37px",
          borderBottomRightRadius: "37px",
          position: "relative",
          zIndex: 55,
          mr: "-40px",
          boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          {/* Form Container */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "90%",
                  lg: 600,
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "common.white",
                  // border: (t) => `solid 1px ${t.palette.divider}`,
                  // borderRadius: 1.5,
               
                }}
              >
                {" "}
                {renderHead} {renderContent}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
};
