import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function HorizontalStepperNav({
  steps,
  activeStep,
  onBack,
  onNext,
  onSubmit,
  submitText,
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
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {activeStep > 0 && activeStep < steps.length - 1 && (
        <Button variant="contained" color="primary" onClick={handlePrev} sx={{ mr: 1 }}>
          Prev
        </Button>
      )}
      {activeStep < steps.length - 1 && (
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      )}

      {activeStep === steps.length - 1 && (
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {submitText || 'Submit'}
        </Button>
      )}
    </Box>
  );
}

HorizontalStepperNav.defaultProps = {
  steps: [],
  activeStep: 0,
  onBack: () => {},
  onNext: () => {},
  onSubmit: () => {},
};

HorizontalStepperNav.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      renderContent: PropTypes.func,
    })
  ),
  activeStep: PropTypes.number,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  onSubmit: PropTypes.func,
  submitText: PropTypes.string,
};
