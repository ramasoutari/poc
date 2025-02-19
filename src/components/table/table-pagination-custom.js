import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TablePagination from "@mui/material/TablePagination";
import { useTranslation } from "react-i18next";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  hideChooseRows = false,
  ...other
}) {
  const { t } = useLocales();
  return (
    <Box sx={{ position: "relative", ...sx }}>
      <TablePagination
        rowsPerPageOptions={!!!hideChooseRows ? rowsPerPageOptions : []}
        component="div"
        {...other}
        onPageChange={(e, page) => {
          other?.onPageChange(page);
        }}
        labelDisplayedRows={({ from, to, count, page }) => {
          return (
            <p>
              {page + 1} / {Math.ceil(count / other.rowsPerPage)}
            </p>
          );
        }}
        labelRowsPerPage={t["rows_per_page"]}
        sx={{
          borderTopColor: "transparent",
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: "absolute",
            },
          }}
        />
      )}
    </Box>
  );
}

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};
