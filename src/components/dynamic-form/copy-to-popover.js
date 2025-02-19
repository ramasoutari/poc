import React from "react";
import PropTypes from "prop-types";
// @mui
import { Box, Button, Grid2 } from "@mui/material";
// locales
// components
import Iconify from "../iconify";
import CustomPopover, { usePopover } from "../custom-popover";
import { useLocales } from "../../locales";

export default function CopyToPopover({ fields, onChooseField, onChooseAll }) {
  const { t } = useLocales();

  // Popover
  const copyToFieldsMenu = usePopover();

  return (
    <>
      <Button
        onClick={copyToFieldsMenu.onOpen}
        size="small"
        variant="outlined"
        startIcon={<Iconify icon="mdi:content-copy" />}
      >
        {t("copy_to")}
      </Button>
      <CustomPopover
        open={copyToFieldsMenu.open}
        onClose={copyToFieldsMenu.onClose}
        hiddenArrow
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box p={1} maxWidth={250}>
          <Grid2 container spacing={1}>
            {fields.map((field, index) => (
              <Grid2 key={index} xs={12}>
                <Button
                  onClick={() => {
                    copyToFieldsMenu.onClose();
                    onChooseField(field.fieldVariable);
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {t(field.label)}
                </Button>
              </Grid2>
            ))}
            {fields.length > 1 && (
              <Grid2 xs={12}>
                <Button
                  onClick={() => {
                    copyToFieldsMenu.onClose();
                    onChooseAll();
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {t("all")}
                </Button>
              </Grid2>
            )}
          </Grid2>
        </Box>
      </CustomPopover>
    </>
  );
}

CopyToPopover.propTypes = {
  onChooseField: PropTypes.func,
  onChooseAll: PropTypes.func,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};
