import PropTypes from "prop-types";
// @mui
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
// locales
import { useTranslation } from "react-i18next";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function TableSelectedAction({
  dense,
  actions,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  ...other
}) {
  const { t } = useLocales();

  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        width: 1,
        zIndex: 9,
        height: 58,
        bgcolor: "primary.lighter",
        color: "white",
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event) => onSelectAllRows(event.target.checked)}
        color="warning"
      />

      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} {t["selected"]}
      </Typography>

      {actions && actions()}
    </Stack>
  );
}

TableSelectedAction.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  dense: PropTypes.bool,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  rowCount: PropTypes.number,
  sx: PropTypes.object,
};
