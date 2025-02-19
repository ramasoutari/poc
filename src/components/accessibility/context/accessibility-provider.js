import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState } from 'react';
//
import { AccessibilityContext } from './accessibility-context';

// ----------------------------------------------------------------------

const MIN_FONT_SIZE_PERCENT = 64;
const MAX_FONT_SIZE_PERCENT = 140;
const MIN_LETTER_SPACING = -0.5;
const MAX_LETTER_SPACING = 0.4;

export function AccessibilityProvider({ children, defaultSettings }) {
  const [rootFontSize, setRootFontSize] = useState(defaultSettings.rootFontSize);
  const [colorBlind, setColorBlind] = useState(defaultSettings.colorBlind);
  const [cursorMode, setCursorMode] = useState(defaultSettings.cursorMode);
  const [letterSpacing, setLetterSpacing] = useState(defaultSettings.letterSpacing || 0);

  // Toggle Color Blind
  const onToggleColorBlind = useCallback(() => {
    setColorBlind((prev) => !prev);
  }, []);

  // Root Font Size
  // change between MIN_FONT_SIZE_PERCENT and MAX_FONT_SIZE_PERCENT
  const onDecreaseRootFontSize = useCallback(() => {
    setRootFontSize((prev) => {
      const next = prev - 9;
      return next < MIN_FONT_SIZE_PERCENT ? MIN_FONT_SIZE_PERCENT : next;
    });
  }, []);

  const onIncreaseRootFontSize = useCallback(() => {
    setRootFontSize((prev) => {
      const next = prev + 10;
      return next > MAX_FONT_SIZE_PERCENT ? MAX_FONT_SIZE_PERCENT : next;
    });
  }, []);
  // Letter Spacing
  const onDecreaseLetterSpacing = useCallback(() => {
    setLetterSpacing((prev) => {
      const next = prev - 0.1;
      return next < MIN_LETTER_SPACING ? MIN_LETTER_SPACING : next;
    });
  }, []);

  const onIncreaseLetterSpacing = useCallback(() => {
    setLetterSpacing((prev) => {
      if (prev === MAX_LETTER_SPACING) {
        // Reset letter spacing to its original value
        setLetterSpacing(defaultSettings.letterSpacing || 0);
        return defaultSettings.letterSpacing || 0;
      } else {
        const next = prev + 0.15; // Increase by a larger increment
        return next > MAX_LETTER_SPACING ? MAX_LETTER_SPACING : next;
      }
    });
  }, [defaultSettings]);

  // Cursor Mode
  const onChangeCursorMode = useCallback((mode) => {
    // 'auto' | 'big' | 'reading'
    setCursorMode(mode);
  }, []);

  // Reset
  const onReset = useCallback(() => {
    setRootFontSize(defaultSettings.rootFontSize || 100);
    setColorBlind(defaultSettings.colorBlind || false);
    setCursorMode(defaultSettings.cursorMode || 'auto');
    setLetterSpacing(defaultSettings.letterSpacing || 0);

  }, [defaultSettings]);

  useEffect(() => {
    document.querySelector('html').style.fontSize = `${rootFontSize}%`;
  }, [rootFontSize]);

  useEffect(() => {
    document.querySelector('*').style.letterSpacing = `${letterSpacing}em`;
  }, [letterSpacing]);

  useEffect(() => {
    // Update * filter grayscale
    document.querySelector('*').style.filter = colorBlind ? 'grayscale(100%)' : '';
  }, [colorBlind]);

  // Here we return used values and methods, in order to use them in other components
  const memoizedValue = useMemo(
    () => ({
      // Reset
      onReset,
      // Font Size
      rootFontSize,
      onDecreaseRootFontSize,
      onIncreaseRootFontSize,
      // Letter Spacing
      letterSpacing,
      onDecreaseLetterSpacing,
      onIncreaseLetterSpacing,
      // Color Blind
      colorBlind,
      onToggleColorBlind,
      // Cursor Mode
      cursorMode,
      onChangeCursorMode,
    }),
    [
      onReset,
      rootFontSize,
      onDecreaseRootFontSize,
      onIncreaseRootFontSize,
      letterSpacing,
      onDecreaseLetterSpacing,
      onIncreaseLetterSpacing,
      colorBlind,
      onToggleColorBlind,
      cursorMode,
      onChangeCursorMode,
    ]
  );

  return (
    <AccessibilityContext.Provider value={memoizedValue}>{children}</AccessibilityContext.Provider>
  );
}

AccessibilityProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
