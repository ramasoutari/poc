import React from 'react';
import SvgColor from './svg-color';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

const LocalDialog = ({ title, content, isOpen, onClose, dismissable = true, big }) => {
  return (
    <Dialog maxWidth="lg" open={isOpen} onClose={onClose}>
      {dismissable && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: (theme) => theme.spacing(1),
            right: (theme) => theme.spacing(1),
            zIndex: 1100,
          }}
        >
          <SvgColor src="/assets/icons/designer/close.svg" color="text.secondary" width={24} />
        </IconButton>
      )}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          ...(big
            ? {
                minWidth: {
                  md: '50vw',
                },
                minHeight: '50vh',
              }
            : {
                minWidth: {
                  md: '30vw',
                },
                minHeight: '50vh',
              }),
          pb: 3,
        }}
      >
        {typeof content === 'string' ? (
          <>{content}</>
        ) : (
          React.cloneElement(content, {
            onClose,
          })
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LocalDialog;
