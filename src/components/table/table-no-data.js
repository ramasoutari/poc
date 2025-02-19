import PropTypes from "prop-types";
// @mui
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// locales
//
import EmptyContent from "../empty-content";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function TableNoData({ notFound, sx, text }) {
  const { t } = useLocales();

  return (
    <TableRow>
      {notFound ? (
        <>
          <TableCell colSpan={12} sx={{ textAlign: "center" }}>
            {text ? (
              text
            ) : (
              <EmptyContent
                hideImg
                title={t["no_data"]}
                sx={{
                  py: 1,
                  ...sx,
                }}
              />
            )}
          </TableCell>
        </>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );

}

TableNoData.propTypes = {
  notFound: PropTypes.bool,
  sx: PropTypes.object,
  text: PropTypes.string,
};
