import { useCallback } from "react";
import { m } from "framer-motion";
// @mui
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
// locales
// components
import { varHover } from "../../components/animate";
import { t } from "i18next";
import { Typography } from "@mui/material";
import CustomPopover, { usePopover } from "../../components/custom-popover";
import { useLocales } from "../../locales";
import SvgColor from "../../components/svg-color";

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const locales = useLocales();

  const popover = usePopover();

  const handleChangeLang = useCallback(
    (newLang) => {
      locales.onChangeLang(newLang);
      popover.onClose();
      window.location.reload();
    },
    [locales, popover]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          sx={{
            width: 40,
            height: 40,
            ...(popover.open && {
              bgcolor: "action.selected",
            }),
          }}
        >
          <SvgColor src={locales.currentLang.icon} color="#000" />
        </IconButton>

        <Typography variant="body2" color="text.secondary">
          {
            locales.allLangs.find(
              (item) => item.value !== locales.currentLang?.value
            )?.label
          }
        </Typography>
      </div>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 65 }}
        hiddenArrow
      >
        {locales.allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === locales.currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            {/* <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} /> */}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
