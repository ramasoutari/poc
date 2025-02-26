import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  SANAD_CLIENT_ID,
  SANAD_REDIRECT_URL,
  SANAD_SIGNFLOW_URL,
} from "../../config-global";
import { useLocales } from "../../locales";

const SanadLoginButton = () => {
  const { t, currentLang } = useLocales();
  const [verifier, setVerifier] = useState(
    "58c90a63c41f11a650375c6c031b3d0e4dd9273a2b33fd13ed7b96df"
  );
  const [challenge, setChallenge] = useState(
    "2Z-GQru430pbJuf31cxMrnRga1xyKVXWbZqQs0-OnYg"
  );
  const culture = currentLang.value;

  const generateChallenge = async () => {
    const randomString = "hussam";
    setVerifier(randomString);
    const encoder = new TextEncoder();
    const data = encoder.encode(randomString);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)));
    setChallenge(challenge);
  };

  useEffect(() => {
    // generateChallenge();
  }, []);

  if (!challenge) return null;
  return (
    <Button
      fullWidth
      component="a"
      // href={`${SANAD_SIGNFLOW_URL}?client_id=${SANAD_CLIENT_ID}&redirect_uri=${SANAD_REDIRECT_URL}&state=${verifier}&challenge=${challenge}&culture=${culture}`}
      href={`${"https://signflow.sanad.gov.jo/signflow/v2/auth"}?client_id=${"5c1f028044754c5281f1dbfe119f8750"}&redirect_uri=${"https://poc.cryptonic-art.com/sanad"}&state=${verifier}&challenge=${challenge}&culture=${culture}`}
      target="_blank"
      sx={{
        backgroundColor: "black",
        color: "white",
        "&:hover": {
          backgroundColor: "darkgray",
        },
      }}
      startIcon={<img src="/logo/sanad-logo.png" style={{ width: 60 }} />}
    >
      {t("login_with_sanad")}
    </Button>
  );
};

export default SanadLoginButton;
