import PropTypes from "prop-types";
import { Fragment } from "react";
import clsx from "clsx";
// @mui
import {
  Box,
  Button,
  Checkbox,
  Divider,
  MenuItem,
  TableRow as MuiTableRow,
  TableCell,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// locales
// components
import { useGlobalPromptContext } from "../global-prompt";
import moment from "moment";
import Iconify from "../iconify";
import CustomPopover, { usePopover } from "../custom-popover";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

const CustomTableCell = styled(TableCell)(({ theme }) => ({}));

export default function TableRow({
  enableSelection,
  columns,
  row,
  actions,
  renderActions,
  onSelectRow,
  selected,
  isOdd,
}) {
  const { t } = useLocales();
  const popover = usePopover();
  const globalPrompt = useGlobalPromptContext();
  const onViewColumnArrayValue = (value) => {
    globalPrompt.onOpen({
      title: t["view_values"],
      content: (
        <Box sx={{ width: 400 }}>
          {value.map((item, index) => {
            return (
              <Fragment key={index}>
                {Object.keys(item)
                  .slice()
                  .filter((key) => item[key])
                  .map((key, index) => {
                    return (
                      <Box key={index} sx={{}}>
                        <Typography variant="body2" noWrap>
                          <strong>{t[key] ? t[key] : key}:</strong> {item[key]}
                        </Typography>
                      </Box>
                    );
                  })}
                {index < value.length - 1 && (
                  <Divider
                    sx={{
                      my: 2,
                    }}
                  />
                )}
              </Fragment>
            );
          })}
        </Box>
      ),
      actions: [
        {
          label: t["close"],
          onClick: globalPrompt.onClose,
        },
      ],
    });
  };

  return (
    <>
      <MuiTableRow
        sx={{
          "& .MuiTableCell-root": {
            backgroundColor: (theme) =>
              isOdd % 2 === 0
                ? theme.palette.grey[100]
                : theme.palette.common.white,
            zIndex: 1,
          },
          "&:hover": {
            "& .MuiTableCell-root": {
              backgroundColor: (theme) => theme.palette.grey[200],
            },
          },
        }}
      >
        {enableSelection && (
          <CustomTableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </CustomTableCell>
        )}
        {columns
          .filter((column) => column.type !== "actions")
          .map((column, index) => {
            let columnId = column.id;
            if (Array.isArray(columnId)) {
              let hasFound = false;
              columnId.forEach((ci) => {
                if (row[ci]) {
                  hasFound = true;
                  columnId = ci;
                }
              });
            }
            return (
              <CustomTableCell
                key={index}
                // key={column.id || index}
                align={column.align}
                width={column.width}
                sx={{
                  py: 1.5,
                  ...column.sx,
                  // if column is sticky,
                  ...(column.sticky && {
                    left: 0,
                  }),
                }}
                className={clsx({
                  stickyTableCell: column.sticky,
                })}
              >
                {!column.renderRow && (
                  <Typography variant="body2" noWrap>
                    {/* String Value */}
                    {typeof row[columnId] !== "object" &&
                      !Array.isArray(row[columnId]) && (
                        <>{row[columnId] ? row[columnId] : "---"}</>
                      )}

                    {/* Date Value */}
                    {row[columnId] instanceof Date && (
                      <>
                        {moment(row[columnId])
                          .locale("en")
                          .format("YYYY-MM-DD")}
                      </>
                    )}

                    {/* Array Value */}
                    {Array.isArray(row[columnId]) && (
                      <>
                        {row[columnId].length > 0 ? (
                          <Button
                            key={index}
                            onClick={() =>
                              onViewColumnArrayValue(row[columnId])
                            }
                            variant="outlined"
                            size="small"
                            startIcon={<Iconify icon="eva:eye-outline" />}
                          >
                            {t["view_values"]}
                          </Button>
                        ) : (
                          "---"
                        )}
                      </>
                    )}
                  </Typography>
                )}
                {column.renderRow && (
                  <>{column.renderRow(row, column, index)}</>
                )}
              </CustomTableCell>
            );
          })}
        {(renderActions || actions?.length > 0) && (
          <CustomTableCell
            sx={{
              py: 1.5,
            }}
            align={columns.find((column) => column.type === "actions")?.align}
            width={columns.find((column) => column.type === "actions")?.width}
          >
            {renderActions && renderActions(row)}
            {actions?.length > 0 && (
              <IconButton
                color={popover.open ? "inherit" : "default"}
                onClick={popover.onOpen}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            )}
          </CustomTableCell>
        )}
      </MuiTableRow>
      {actions?.length < 0 && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          sx={{ width: 160 }}
        >
          {actions.map((action, index) => {
            return (
              <Fragment key={index}>
                <MenuItem
                  onClick={() => {
                    popover.onClose();
                    action?.onClick();
                  }}
                >
                  {/* builder icon */}
                  {action?.icon}
                  {action?.label}
                </MenuItem>
                {index < actions.length - 1 && (
                  <Divider sx={{ borderStyle: "dashed" }} />
                )}
              </Fragment>
            );
          })}
        </CustomPopover>
      )}
    </>
  );
}

TableRow.propTypes = {
  enableSelection: PropTypes.bool,
  columns: PropTypes.array,
  row: PropTypes.object,
  actions: PropTypes.array,
  renderActions: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.bool,
  isOdd: PropTypes.bool,
  canReorder: PropTypes.bool,
};
