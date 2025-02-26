import { formControlClasses, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { useAuthContext } from "../../auth/hooks";
import { useRouter } from "../../routes/hooks";
import { varHover } from "../../components/animate";
import { useLocales } from "../../locales";
import SvgColor from "../../components/svg-color";
function HelpButton({ id }) {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const { user } = useAuthContext();
  const [serviceCode, setServiceCode] = useState();

  const serviceCodeHandler = () => {
    const pathname = window.location.pathname;
    const getServiceCode = (basePath) =>
      pathname.split("/")[pathname.split("/").indexOf(basePath) + 1];

    if (user?.type === "user" && !pathname.includes("my-clinic")) {
      if (pathname.includes("cpd-activities")) {
        setServiceCode(getServiceCode("cpd-activities"));
      } else {
        setServiceCode(getServiceCode("services") || "001");
      }
    } else if (pathname.includes("my-clinic")) {
      if (pathname.includes("cpd-activities")) {
        const type = "-Clinic";
        setServiceCode(getServiceCode("cpd-activities") + type);
      } else {
        setServiceCode("059");
      }
    } else if (
      user?.type === "entity" &&
      !pathname.includes("my-clinic") &&
      !user?.clinic
    ) {
      if (pathname.includes("cpd-activities")) {
        const type = "-Entity";
        setServiceCode(getServiceCode("cpd-activities") + type);
      } else {
        setServiceCode("060");
      }
    } else if (user?.type === "cpd_entity") {
      setServiceCode(id || "addActivity");
    } else {
      setServiceCode("001");
    }
  };

  useEffect(() => {
    serviceCodeHandler();
  }, [window.location.pathname]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <IconButton
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={() => {
          router.push(`/help/${serviceCode}`);
        }}
        sx={
          currentLang?.value === "ar"
            ? {
                color: "primary.main",
              }
            : {
                color: "primary.main",
                transform: "scale(-1,1)",
              }
        }
      >
        <SvgColor src="/assets/icons/designer/navbar/help.svg" />
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {t["help"]}
      </Typography>
    </div>
  );
}

export default HelpButton;
