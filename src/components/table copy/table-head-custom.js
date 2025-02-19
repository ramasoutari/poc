import PropTypes from "prop-types";
import clsx from "clsx";
// @mui
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

// ----------------------------------------------------------------------

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
  headBg,
  canReorder,
  ...other
}) {
  const renderHeadCell = (headCell, index) => {
    return (
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
        {headCell.icon && headCell.icon(headCell, index)}
        {headCell.render && headCell.render(headCell, index)}
        {!headCell.render && headCell.label}
      </Box>
    );
  };

  return (
    <TableHead
      sx={{
        ...sx,
      }}
      {...other}
    >
      <TableRow>
        {onSelectAllRows && (
          <TableCell
            padding="checkbox"
            sx={{
              backgroundColor: headBg,
            }}
          >
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel.map((headCell, index) => (
          <TableCell
            key={index}
            align={headCell.align || "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={clsx({
              stickyTableCell: headCell.sticky,
            })}
            sx={{
              width: headCell.width,
              minWidth: headCell.minWidth,
              color:"black",
              backgroundColor: headBg,
              ...(headCell.sticky && {
                // left property
                // first sticky column should be 0
                // second sticky column should be first column width
                // third sticky column should be first column width + second column width
                // and so on, dont use reduce, it will be slow
                ...(headLabel.filter((column) => column.sticky).length > 1
                  ? {
                      left: headLabel
                        .filter((column) => column.sticky)
                        .slice(0, canReorder ? index - 1 : index)
                        .map((column, index) => {
                          //  if there is only one sticky column, it should be 0
                          if (!column.sticky) {
                            return 0;
                          }
                          return column.minWidth;
                        })
                        .reduce((a, b) => a + b, 0),
                    }
                  : {
                      left: 0,
                    }),
              }),
            }}
          >
            {headCell.sortable && onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={() => onSort(headCell.id)}
              >
                {renderHeadCell(headCell, index)}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              renderHeadCell(headCell, index)
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeadCustom.propTypes = {
  sx: PropTypes.object,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(["asc", "desc"]),
  headBg: PropTypes.string,
};
