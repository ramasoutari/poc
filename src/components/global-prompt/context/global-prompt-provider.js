import PropTypes from 'prop-types';
import { useMemo, useCallback, useState } from 'react';
import shortid from 'shortid';
//
import { GlobalPromptContext } from './global-prompt-context';

// ----------------------------------------------------------------------

export function GlobalPromptProvider({ children }) {
  // ** State
  const [prompts, setPrompts] = useState([]);

  // ** Functions
  const onOpen = useCallback(async (options) => {
    const randomId = shortid.generate();
    setPrompts((prevPrompts) => [
      ...prevPrompts,
      {
        ...options,
        id: randomId,
        onClose: () => onClose(randomId),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = useCallback((id) => {
    // If provided an Id then close only that prompt, otherwise close latest prompt
    setPrompts((prevPrompts) =>
      id
        ? prevPrompts.filter((prompt) => prompt.id !== id)
        : prevPrompts.slice(0, prevPrompts.length - 1)
    );
  }, [prompts]);

  const memoizedValue = useMemo(
    () => ({
      prompts,
      onOpen,
      onClose,
    }),
    [prompts, onOpen, onClose]
  );

  return (
    <GlobalPromptContext.Provider value={memoizedValue}>{children}</GlobalPromptContext.Provider>
  );
}

GlobalPromptProvider.propTypes = {
  children: PropTypes.node,
};
