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
import { alpha, styled } from "@mui/material/styles";
// locales
// components
import { useGlobalPromptContext } from "../global-prompt";
import Iconify from "../iconify";
import { useTranslation } from "react-i18next";
import CustomPopover, { usePopover } from "../custom-popover";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export default function TableRow({
  enableSelect,
  columns,
  row,
  actions,
  renderActions,
  onSelectRow,
  selected,
  canReorder,
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

  const CustomTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
  }));

  return (
    <>
      <MuiTableRow
        hover
        sx={{
          borderBottom: "2px solid black", // Add a black bottom border
        }}
      >
        {enableSelect && (
          <CustomTableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </CustomTableCell>
        )}
        {columns
          .filter((column) => column.type !== "actions")
          .map((column, index) => {
            return (
              <CustomTableCell
                key={column.id || index}
                align={column.align}
                width={column.width}
                sx={{
                  textAlign: 'right',
                  py: 3,
                  ...column.sx,
                  // if column is sticky,
                  ...(column.sticky && {
                    // left property
                    // first sticky column should be 0
                    // second sticky column should be first column width
                    // third sticky column should be first column width + second column width
                    // and so on, dont use reduce, it will be slow
                    // dont use reduce, it will be slow
                    ...(columns.filter((column) => column.sticky).length > 1
                      ? {
                          left: columns
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
                className={clsx({
                  stickyTableCell: column.sticky,
                })}
              >
                {!column.renderRow && (
                  <Typography variant="body2" noWrap>
                    {/* String Value */}
                    {typeof row[column.id] !== "object" &&
                      !Array.isArray(row[column.id]) && (
                        <>{row[column.id] ? row[column.id] : "---"}</>
                      )}

                    {/* Array Value */}
                    {Array.isArray(row[column.id]) && (
                      <>
                        {row[column.id].length > 0 ? (
                          <Button
                            key={index}
                            onClick={() =>
                              onViewColumnArrayValue(row[column.id])
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
  enableSelect: PropTypes.bool,
  columns: PropTypes.array,
  row: PropTypes.object,
  actions: PropTypes.array,
  renderActions: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.bool,
};
