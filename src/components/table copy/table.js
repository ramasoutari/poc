import PropTypes from "prop-types";
// @mui
import {
  Table as MuiTable,
  TableContainer,
  TableBody,
  Box,
} from "@mui/material";
// components
import TableEmptyRows from "./table-empty-rows";
import TableHeadCustom from "./table-head-custom";
import TableNoData from "./table-no-data";
import TablePaginationCustom from "./table-pagination-custom";
import TableSelectedAction from "./table-selected-action";
import TableSkeleton from "./table-skeleton";
import TableRow from "./table-row";
import { emptyRows } from "./utils";
import Scrollbar from "../scrollbar";

// ----------------------------------------------------------------------

export default function Table({
  columns,
  rows,
  actions,
  renderActions,
  renderSelectedActions,
  pagination,
  loading,
  dense,
  order,
  orderBy,
  canReorder,
  enableSelect,
  selected,
  onSort,
  onChangeDense,
  onSelectAllRows,
  headBg,
  tableProps,
  tableContainerProps,
  tableHeadProps,
  tableBodyProps,
  emptyText,
}) {
  const denseHeight = dense ? 56 : 76;
  const notFound = !loading && !rows.length;

  return (
    <>
      <Box
        sx={{
          ...(tableProps?.stickyHeader && {
            overflow: "auto",
          }),
        }}
      >
        <TableContainer
          {...tableContainerProps}
          sx={{
            position: "relative",
            overflow: "unset",
            ...tableContainerProps?.sx,
            // Create a nice rounded scrollbar
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            },
          }}
        >
          {enableSelect && (
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={rows.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  rows.map((row) => row.id)
                )
              }
              action={(selected) => renderSelectedActions(selected[0])}
            />
          )}
          <Scrollbar>
            <MuiTable
              {...tableProps}
              size={dense ? "small" : "medium"}
              sx={{ ...tableProps?.sx }}
            >
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={columns}
                rowCount={rows?.length || 0} // Fallback to 0 if rows is undefined
                numSelected={selected?.length || 0} // Fallback to 0 if selected is undefined
                onSort={onSort}
                headBg={headBg || "common.white"}
                canReorder={canReorder}
                {...tableHeadProps}
                sx={{
                  ...tableHeadProps?.sx,
                }}
              />

              <TableBody
                {...tableBodyProps}
                sx={{
                  ...tableBodyProps?.sx,
                }}
              >
                {rows.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    columns={columns}
                    row={row}
                    actions={actions}
                    renderActions={renderActions}
                    enableSelect={enableSelect}
                    canReorder={canReorder}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(
                    pagination?.page,
                    pagination?.rowsPerPage,
                    rows.length
                  )}
                />

                {loading && <TableSkeleton />}

                {!loading && (
                  <TableNoData text={emptyText} notFound={notFound} />
                )}
              </TableBody>
            </MuiTable>
          </Scrollbar>
        </TableContainer>
      </Box>
      {pagination && (
        <TablePaginationCustom
          count={pagination?.total || rows.length}
          page={pagination?.page}
          rowsPerPage={pagination?.rowsPerPage}
          onPageChange={pagination?.onChangePage}
          onRowsPerPageChange={pagination?.onChangeRowsPerPage}
          dense={dense}
          onChangeDense={onChangeDense}
        />
      )}
    </>
  );
}

Table.defaultProps = {
  columns: [],
  rows: [],
  actions: [],
  renderActions: null,
  selected: [],
  enableSelect: false,
  pagination: null,
  loading: false,
  dense: false,
  order: "asc",
  orderBy: "",
  onSelectAllRows: null,
  onSort: null,
  onChangeDense: null,
  renderSelectedActions: null,
  headBg: "",
  tableProps: {},
  tableContainerProps: {},
  tableHeadProps: {},
  tableBodyProps: {},
};

Table.propTypes = {
  // Columns, Rows, Actions
  columns: PropTypes.array,
  rows: PropTypes.array,
  actions: PropTypes.array,
  renderActions: PropTypes.func,
  renderSelectedActions: PropTypes.func,
  emptyText: PropTypes.string,
  // Pagination
  pagination: PropTypes.shape({
    total: PropTypes.number,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangeRowsPerPage: PropTypes.func,
  }),
  // Loading
  loading: PropTypes.bool,
  dense: PropTypes.bool,
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  canReorder: PropTypes.bool,
  selected: PropTypes.array,
  enableSelect: PropTypes.bool,
  onSelectAllRows: PropTypes.func,
  onSort: PropTypes.func,
  onChangeDense: PropTypes.func,
  headBg: PropTypes.string,
  tableProps: PropTypes.object,
  tableContainerProps: PropTypes.object,
  tableHeadProps: PropTypes.object,
  tableBodyProps: PropTypes.object,
};
