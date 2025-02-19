import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// @mui
import { alpha } from '@mui/material/styles';
import { Table as MuiTable, TableContainer, TableBody, Box, Divider } from '@mui/material';
// components
import TableEmptyRows from './table-empty-rows';
import TableHeadCustom from './table-head-custom';
import TableNoData from './table-no-data';
import TablePaginationCustom from './table-pagination-custom';
import TableSelectedAction from './table-selected-action';
import TableSkeleton from './table-skeleton';
import TableRow from './table-row';
import { emptyRows } from './utils';

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
  enableSelection,
  selected,
  onSort,
  onChangeDense,
  onSelectRow,
  onSelectAllRows,
  headBg,
  tableProps,
  tableContainerProps,
  tableHeadProps,
  tableBodyProps,
  emptyText,
  getUniqueRowId,
  hideChooseRows = false,
}) {
  const denseHeight = dense ? 56 : 76;
  const notFound = !loading && !rows.length;

  // set rows on first load

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
              display: "block",
              width: "10px",
              height: "10px",
              backgroundColor: (t) => alpha(t.palette.primary.main, 0.1),
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "8px",
              backgroundColor: "primary.main",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          {enableSelection && rows.length > 0 && (
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={rows.length}
              canReorder={canReorder}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  rows.map((row) => getUniqueRowId(row))
                )
              }
              actions={() => renderSelectedActions(selected)}
            />
          )}
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
              enableSelection={enableSelection && rows.length > 0}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  rows.map((row) => getUniqueRowId(row))
                )
              }
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
              {!loading &&
                rows.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    isOdd={index % 2 !== 0}
                    columns={columns}
                    row={row}
                    actions={actions}
                    renderActions={renderActions}
                    enableSelection={enableSelection}
                    canReorder={canReorder}
                    selected={selected.some(
                      (selectedRow) => selectedRow === getUniqueRowId(row)
                    )}
                    onSelectRow={() => onSelectRow(getUniqueRowId(row))}
                  />
                ))}
              {/*
              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(
                  pagination?.page,
                  pagination?.rowsPerPage,
                  rows.length
                )}
              /> */}

              {loading &&
                Array.from({
                  length: pagination?.rowsPerPage
                    ? parseInt(pagination?.rowsPerPage)
                    : 10,
                }).map((_, index) => <TableSkeleton key={index} />)}

              {!loading && <TableNoData text={emptyText} notFound={notFound} />}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </Box>
      <Divider sx={{ my: 2 }}></Divider>
      {pagination && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {pagination?.total > 0 && (
            <TablePaginationCustom
              count={pagination?.total || rows.length}
              page={pagination?.page}
              rowsPerPage={pagination?.rowsPerPage}
              onPageChange={(page) => pagination?.onChangePage(page)}
              onRowsPerPageChange={pagination?.onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
              hideChooseRows={hideChooseRows || false}
            />
          )}
        </Box>
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
  enableSelection: false,
  pagination: null,
  loading: false,
  dense: false,
  order: 'asc',
  orderBy: '',
  onSelectRow: null,
  onSelectAllRows: null,
  onSort: null,
  onChangeDense: null,
  renderSelectedActions: null,
  headBg: '',
  tableProps: {},
  tableContainerProps: {},
  tableHeadProps: {},
  tableBodyProps: {},
  getUniqueRowId: (row) => row.id,
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
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  canReorder: PropTypes.bool,
  selected: PropTypes.array,
  enableSelection: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onSelectAllRows: PropTypes.func,
  onSort: PropTypes.func,
  onChangeDense: PropTypes.func,
  headBg: PropTypes.string,
  tableProps: PropTypes.object,
  tableContainerProps: PropTypes.object,
  tableHeadProps: PropTypes.object,
  tableBodyProps: PropTypes.object,
  getUniqueRowId: PropTypes.func,
};
