import { useState } from "react";
// @mui
import { Box, Button, MenuItem, Select, Stack } from "@mui/material";
// hooks
//
import { useTranslation } from "react-i18next";
import { useLocales } from "../../locales";

export default function ChangeLanguageDialog() {
  const locales = useLocales();
  const {t} = useLocales();

  const [selectedLang, setSelectedLang] = useState(locales.currentLang.value);

  return (
    <Box py={3}>
      <Stack direction="column" spacing={2}>
        <Select
          fullWidth
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          {locales.allLangs.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {/* <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} /> */}
                {option.label}
              </Stack>
            </MenuItem>
          ))}
        </Select>

        <Button
          onClick={() => locales.onChangeLang(selectedLang)}
          variant="contained"
          color="secondary"
          fullWidth
        >
          {t["save"]}
        </Button>
      </Stack>
    </Box>
  );
}
