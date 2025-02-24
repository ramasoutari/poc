// @mui
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Box, IconButton } from "@mui/material";
// hooks
import { useGlobalPromptContext } from "./context";
// components
import SvgColor from "../svg-color/svg-color";
import Iconify from "../iconify";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function GlobalPrompt() {
  const { prompts } = useGlobalPromptContext();
  const { t } = useLocales();

  return (
    <>
      {prompts.map((prompt) => {
        const GlobalPrompt = prompt;

        return (
          <Dialog
            key={GlobalPrompt.id}
            fullWidth
            maxWidth={GlobalPrompt?.dialogProps?.maxWidth || "xs"}
            open
            onClose={GlobalPrompt.onClose}
            sx={{
              ...GlobalPrompt?.dialogProps?.sx,
              "& .MuiDialog-paper": {
                ...GlobalPrompt?.dialogProps?.sx.paper,
              },
            }}
          >
            <IconButton
              onClick={GlobalPrompt.onClose}
              sx={{
                position: "absolute",
                top: (theme) => theme.spacing(1),
                right: (theme) => theme.spacing(1),
                zIndex: 1100,
              }}
            >
              <SvgColor
                src="/assets/icons/designer/close.svg"
                color="text.secondary"
                width={24}
              />
            </IconButton>
            {GlobalPrompt.title && (
              <DialogTitle sx={{ pb: 2, textAlign: "center" }}>
                {GlobalPrompt.title}
              </DialogTitle>
            )}

            {GlobalPrompt.content && (
              <DialogContent
                sx={{
                  ...GlobalPrompt?.dialogProps?.sx?.content,
                  typography: "body2",
                  mt: 2,
                  ...(!GlobalPrompt.title && {
                    pt: 2,
                  }),
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  {["", "warning"].includes(
                    GlobalPrompt?.promptProps?.icon
                  ) && (
                    <Iconify
                      icon="octicon:alert-fill-24"
                      color="warning.main"
                      width={92}
                      height={92}
                    />
                  )}
                  {GlobalPrompt?.promptProps?.icon === "success" && (
                    <Iconify
                      icon="mdi:check-circle-outline" // ✅ Use outlined version
                      color="green"
                      width={200}
                      height={200}
                    />
                  )}
                  {GlobalPrompt?.promptProps?.icon === "error" && (
                    <Iconify
                      icon="mdi:close-circle"
                      color="error.main"
                      width={92}
                      height={92}
                    />
                  )}
                </Box>

                {/* Text */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {typeof GlobalPrompt.content === "function"
                    ? GlobalPrompt.content({
                        onClose: GlobalPrompt.onClose,
                      })
                    : GlobalPrompt.content}
                </Box>
              </DialogContent>
            )}

            {/* eslint-disable-next-line no-extra-boolean-cast */}
            <DialogActions>
              {!!GlobalPrompt?.promptProps?.hideActions && (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      GlobalPrompt.onClose();
                      GlobalPrompt.promptProps.onConfirm();
                    }}
                    fullWidth
                  >
                    {GlobalPrompt.promptProps?.confirmText || t["yes"]}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      GlobalPrompt.onClose();
                      GlobalPrompt.promptProps.onCancel();
                    }}
                    fullWidth
                  >
                    {GlobalPrompt.promptProps?.cancelText || t["no"]}
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        );
      })}
    </>
  );
}
