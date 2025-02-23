import React from "react";
import PropTypes from "prop-types";
// @mui
import { Box, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

// locales
import CustomPopover, { usePopover } from "../custom-popover";
import { useLocales } from "../../locales";
// hooks
// components

export default function PresetPopover({ presets, onSelectPreset }) {
  const { t } = useLocales();

  // Popover
  const presetsMenu = usePopover();

  return (
    <>
      <Button onClick={presetsMenu.onOpen} size="small" variant="outlined">
        {t["select_preset"]}
      </Button>
      <CustomPopover
        open={presetsMenu.open}
        onClose={presetsMenu.onClose}
        hiddenArrow
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box p={1} maxWidth={250}>
          <Grid2 container spacing={1}>
            {presets.map((preset, index) => (
              <Grid2 key={index} xs={6}>
                <Button
                  onClick={() => {
                    presetsMenu.onClose();
                    onSelectPreset(preset.addMethod, preset.value);
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {preset.label}
                </Button>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </CustomPopover>
    </>
  );
}

PresetPopover.propTypes = {
  onSelectPreset: PropTypes.func,
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
  ),
};
