import PropTypes from "prop-types";
import { useMemo, useCallback, useState, useEffect } from "react";
import shortid from "shortid";
// hooks
//
import { GlobalDialogContext } from "./global-dialog-context";
import { usePathname } from "../../../routes/hooks";

// ----------------------------------------------------------------------

export function GlobalDialogProvider({ children }) {
  const pathname = usePathname()
  // ** State
  const [dialogs, setDialogs] = useState([]);

  // ** Functions
  const onOpen = useCallback((options) => {
    const randomId = shortid.generate();
    setDialogs((prevDialogs) => [
      ...prevDialogs,
      {
        ...options,
        backdrop: options.backdrop ?? true,
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        title: options.title ?? "",
        content: options.content ?? "",
        dismissable: options.dismissable ?? true,
        dialogProps: options.dialogProps ?? {},
        id: randomId,
        onClose: () => onClose(randomId),
      },
    ]);
  }, []);

  const onClose = useCallback(() => {
    // Close last dialog
    setDialogs((prevDialogs) => {
      const newDialogs = [...prevDialogs];
      newDialogs.pop();
      return newDialogs;
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      dialogs,
      onOpen,
      onClose,
    }),
    [dialogs, onOpen, onClose]
  );


  useEffect(() => {
    if (!pathname.includes("services")) {
      onClose();
    }
  }, [pathname]);
  return (
    <GlobalDialogContext.Provider value={memoizedValue}>
      {children}
    </GlobalDialogContext.Provider>
  );
}

GlobalDialogProvider.propTypes = {
  children: PropTypes.node,
};
