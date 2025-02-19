import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import RegisterationStepOne from "./registeration-step-one";
import RegisterationStepTwo from "./registeration-step-two";
import RegisterationStepThree from "./registration-step-three";

export default function RegistrationView() {
  const [step, setStep] = useState(0);
  const [regData, setRegData] = useState(null);
  useEffect(() => {
    console.log("Updated regData:", regData);
  }, [regData]);

  return (
    <Box>
      {step === 0 && (
        <RegisterationStepOne
          step={step}
          setStep={setStep}
          setRegData={setRegData}
        />
      )}
      {step === 1 && (
        <RegisterationStepTwo
          step={step}
          setStep={setStep}
          setRegData={setRegData}
          regData={regData}
        />
      )}
      {step === 2 && (
        <RegisterationStepThree
          step={step}
          setStep={setStep}
          regData={regData}
          setRegData={setRegData}
        />
      )}
    </Box>
  );
}
