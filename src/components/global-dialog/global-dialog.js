// @mui
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Box,
  alpha,
} from '@mui/material';
// hooks
import { useGlobalDialogContext } from './context';
// components
import SvgColor from '../svg-color/svg-color';
import Button from '@mui/material/Button';
import { t } from 'i18next';



// ----------------------------------------------------------------------

export default function GlobalDialog() {
  const { dialogs } = useGlobalDialogContext();
  return (
    <>
      {dialogs.map((dialog) => {
        const globalDialog = dialog;

        return (
          <Dialog
            key={globalDialog.id}
            open
            fullWidth
            PaperComponent={(props) => <Paper {...props} />}
            maxWidth={globalDialog?.dialogProps?.maxWidth || 'xs'}
            // onClose={globalDialog.onClose}
            sx={{
              ...globalDialog?.dialogProps?.sx,
              '& .MuiDialog-paper': {
                ...globalDialog?.dialogProps?.sx?.paper,
              },

            }}
          >
            {globalDialog?.dismissable && (
              <IconButton
                onClick={globalDialog.onClose}
                sx={{
                  position: 'absolute',
                  top: (theme) => theme.spacing(1),
                  right: (theme) => theme.spacing(1),
                  zIndex: 1100,
                }}
              >
                <SvgColor src="/icons/close.svg" color="text.secondary" width={24} />
              </IconButton>
            )}
            {globalDialog.title && (
              <DialogTitle
                sx={{
                  pb: 2,
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                {globalDialog.title}
              </DialogTitle>
            )}

            {globalDialog.content && (
              <DialogContent
                sx={{
                  ...globalDialog?.dialogProps?.sx?.content,
                  typography: 'body2',
                  ...(!globalDialog.title && {
                    pt: 2,
                  }),
                  "&::-webkit-scrollbar": {
                    display: "block",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    borderRadius: "8px",
                    backgroundColor: t => alpha("#ED8539", 0.8),
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                {globalDialog.content}
              </DialogContent>

            )}
            {globalDialog.action && <DialogActions>{globalDialog?.action}</DialogActions>}
          </Dialog>
        );
      })}
    </>
  );
}
