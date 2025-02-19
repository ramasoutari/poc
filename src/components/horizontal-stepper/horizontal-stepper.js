import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import HorizontalStepperNav from './horizontal-stepper-nav';

export default function HorizontalStepper({
  steps,
  activeStep,
  onBack,
  onNext,
  onSubmit,
  navigation,
}) {
  // ** Functions
  const handlePrev = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>

        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>


      {
        steps[activeStep]?.renderContent && (
          <Box sx={{ mt: 3 }}>{steps[activeStep].renderContent()}</Box>
        )
      }

      {
        navigation && (
          <HorizontalStepperNav
            steps={steps}
            activeStep={activeStep}
            onBack={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        )
      }
    </Box >
  );
}

HorizontalStepper.defaultProps = {
  steps: [],
  activeStep: 0,
  navigation: false,
  onBack: () => { },
  onNext: () => { },
  onSubmit: () => { },
};

HorizontalStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      renderContent: PropTypes.func,
    })
  ),
  activeStep: PropTypes.number,
  navigation: PropTypes.bool,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  onSubmit: PropTypes.func,
};
