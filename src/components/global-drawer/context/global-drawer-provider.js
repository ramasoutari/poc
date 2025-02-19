import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState } from 'react';
// hooks
//
import { GlobalDrawerContext } from './global-drawer-context';

// ----------------------------------------------------------------------

export function GlobalDrawerProvider({ children }) {
  // ** State
  const [open, setOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [closeOnBackdrop, setCloseOnBackdrop] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [renderRightOptions, setRenderRightOptions] = useState(null);

  // ** Functions
  const onOpen = useCallback((options) => {
    setOpen(true);
    setBackdrop(options?.backdrop !== undefined ? options.backdrop : true);
    setCloseOnBackdrop(options?.closeOnBackdrop !== undefined ? options.closeOnBackdrop : true);
    setTitle(options?.title || options?.title === '' ? options.title : 'Global Drawer Title');
    setContent(
      options?.content || options?.content === '' ? options.content : 'Global Drawer Content'
    );
    setRenderRightOptions(options?.renderRightOptions || options?.renderRightOptions === '');
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setBackdrop(false);
    setCloseOnBackdrop(true);
    setTitle('');
    setContent('');
    setRenderRightOptions(null);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      open,
      backdrop,
      closeOnBackdrop,
      title,
      content,
      renderRightOptions,
      onOpen,
      onClose,
    }),
    [open, backdrop, closeOnBackdrop, title, content, renderRightOptions, onOpen, onClose]
  );

  return (
    <GlobalDrawerContext.Provider value={memoizedValue}>{children}</GlobalDrawerContext.Provider>
  );
}

GlobalDrawerProvider.propTypes = {
  children: PropTypes.node,
};
