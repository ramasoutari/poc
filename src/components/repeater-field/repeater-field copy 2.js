import PropTypes from "prop-types";
// @mui
import { Box, Button, FormHelperText, IconButton, Stack, Typography } from "@mui/material";
// hooks
import { useGlobalDrawerContext } from "../global-drawer";
import { useGlobalPromptContext } from "../global-prompt";
// components
import Table, { useTable } from "../table";
import AddEditEntryDialog from "./add-edit-entry-dialog";
import { useEffect, useMemo } from "react";
import fetchOptionsFromApiSource from "../dynamic-form/utils/fetch-options-from-api-source";
import _ from "lodash";
import shortid from "shortid";
import { useTranslation } from 'react-i18next';
import Iconify from "../iconify";
import { useGlobalDialogContext } from "../global-dialog";
import { useLocales } from "../../locales";
//

const COLUMN_WIDTH = 150;

export default function RepeaterField({
  label,
  fields,
  value,
  onChange,
  error,
  helperText,
  hideEmptyTable = true,
  tableEmptyText,
  addEditFieldLayout = "dialog",
  visibleColumns = [],
  canDelete = true,
  canEdit = true,
  canAdd = true,
  canDuplicate,
  canReorder,
  enableSelection,
  submitButtonProps,
  isDynamicFormRepeater,
}) {
  const { t } = useLocales();
  const globalDrawer = useGlobalDrawerContext();
  const globalDialog = useGlobalDialogContext();
  const globalPrompt = useGlobalPromptContext();
  const table = useTable({
    defaultSelected: [],
    enableSelection: enableSelection,
  });

  const columns = useMemo(() => {
    let allColumns = [];
    if (visibleColumns.length > 0) {
      visibleColumns.filter(vc => typeof vc === "object").forEach((vc) => {
        allColumns.push({
          ...fields.find((f) => f.fieldVariable === vc.readForm[0]),
          label: t[vc.label] ? t[vc.label] : vc.label,
          id: vc.readForm,
          minWidth: COLUMN_WIDTH,
          sx: {
            maxWidth: COLUMN_WIDTH,
          },
        });
      })
    }
    allColumns = allColumns
      // if field is either "select" or "radio-group", we need to "renderRow" to show the label
      .map((field) => {
        if (["select", "radio-group", "upload"].includes(field?.type)) {
          return {
            ...field,
            id: field?.fieldVariable,
            label: t[field?.label] ? t[field?.label] : field?.label,
            minWidth: COLUMN_WIDTH,
            sx: {
              maxWidth: COLUMN_WIDTH,
            },
            renderRow: (row) => {
              let labelId = field?.id || field?.fieldVariable;
              if (Array.isArray(field?.id)) {
                field.id.forEach((fId) => {
                  if (row[fId + "_label"]) {
                    labelId = fId;
                  }
                });
              }
              return (
                <Typography variant="body2" noWrap>
                  {row[labelId + "_label"] || "---"}
                </Typography>
              );
            },
          };
        } else if (["phonefield"].includes(field?.type)) {
          return {
            ...field,
            id: field?.fieldVariable,
            label: t[field?.label] ? t[field?.label] : field?.label,
            minWidth: COLUMN_WIDTH,
            sx: {
              maxWidth: COLUMN_WIDTH,
            },
            renderRow: (row) => {
              return (
                <Typography
                  variant="body2"
                  noWrap
                  style={{
                    direction: "ltr",
                  }}
                >
                  {row[field?.id || field?.fieldVariable]}
                </Typography>
              );
            },
          };
        }

        return field;
      })

    allColumns = allColumns.concat([
      ...fields
        ?.filter((field) => {
          if (visibleColumns.length > 0) {
            // if (visibleColumns.find(vc => vc.readForm?.includes(field.fieldVariable))) {
            //   return visibleColumns.find(vc => vc.readForm?.includes(field.fieldVariable))
            // }
            return visibleColumns.includes(field.fieldVariable)
          } else if (!isDynamicFormRepeater) {
            return !["form-section"].includes(field?.type);
          }

          return true;
        })
        // if field is either "select" or "radio-group", we need to "renderRow" to show the label
        .map((field) => {
          if (["select", "radio-group", "upload"].includes(field?.type)) {
            return {
              ...field,
              id: field?.fieldVariable,
              label: t[field?.label] ? t[field?.label] : field?.label,
              minWidth: COLUMN_WIDTH,
              sx: {
                maxWidth: COLUMN_WIDTH,
              },
              renderRow: (row) => {
                return (
                  <Typography variant="body2" noWrap>
                    {row[field?.fieldVariable + "_label"] || "---"}
                  </Typography>
                );
              },
            };
          } else if (["phonefield"].includes(field?.type)) {
            return {
              ...field,
              id: field?.fieldVariable,
              label: t[field?.label] ? t[field?.label] : field?.label,
              minWidth: COLUMN_WIDTH,
              sx: {
                maxWidth: COLUMN_WIDTH,
              },
              renderRow: (row) => {
                return (
                  <Typography
                    variant="body2"
                    noWrap
                    style={{
                      direction: "ltr",
                    }}
                  >
                    {row[field?.id || field?.fieldVariable]}
                  </Typography>
                );
              },
            };
          }

          return {
            ...field,
            id: field?.fieldVariable,
            label: t(field?.label)? t(field?.label) : field?.label,
            minWidth: COLUMN_WIDTH,
            sx: {
              maxWidth: COLUMN_WIDTH,
            },
          };
        })
    ]);

    // Re-arrange columns
    let fieldsVariables = fields.slice().map(f => f.fieldVariable)
    allColumns = _.sortBy(allColumns, function (item) {
      return !Array.isArray(item.id) ? fieldsVariables.indexOf(item.id) : fieldsVariables.indexOf(item.id[0])
    })

    // if one  of canEdit, canDuplicate, canDelete is true, we need to add an extra column for actions
    if (canEdit || canDuplicate || canDelete) {
      allColumns.push({
        id: "actions",
        type: "actions",
        label: t["action"],
        align: "center",
      });
    }

    return allColumns
  }, [fields, isDynamicFormRepeater, t]);

  const onAddEntryClick = () => {
    if (addEditFieldLayout === "drawer") {
      return globalDrawer.onOpen({
        title: t["add"],
        content: (
          <AddEditEntryDialog
            fields={fields}
            value={value}
            onChange={onChange}
            onClose={globalDrawer.onClose}
            submitButtonProps={submitButtonProps}
          />
        ),
      });
    }
    globalDialog.onOpen({
      // title: t("add"),
      content: (
        <AddEditEntryDialog
          fields={fields}
          value={value}
          onChange={onChange}
          onClose={globalDialog.onClose}
          submitButtonProps={submitButtonProps}
        />
      ),
      dialogProps: {
        maxWidth: "md",
      },
    });
  };

  const onEditEntryClick = (row) => {
    if (addEditFieldLayout === "drawer") {
      return globalDrawer.onOpen({
        title: t["add"],
        content: (
          <AddEditEntryDialog
            fields={fields}
            value={value}
            onChange={onChange}
            onClose={globalDrawer.onClose}
            row={row}
            isEdit
          />
        ),
      });
    }
    globalDialog.onOpen({
      title: t["edit"],
      content: (
        <AddEditEntryDialog
          fields={fields}
          value={value}
          onChange={onChange}
          onClose={globalDialog.onClose}
          row={row}
          isEdit
        />
      ),
      dialogProps: {
        maxWidth: "md",
      },
    });
  };

  const onDuplicateEntryClick = (row) => {
    const duplicateEntry = () => {
      const newValue = [
        ...value,
        {
          ...row,
          uniqueRepeaterId: shortid.generate(),
        },
      ];
      onChange(newValue);
    };

    globalPrompt.onOpen({
      type: "warning",
      content: t["are_you_sure_to_duplicate_entry"],
      promptProps: {
        hideActions: true,
        icon: "warning",
        onConfirm: () => {
          duplicateEntry();
          globalPrompt.onOpen({
            type: "success",
            content: t["duplicate_success"],
            promptProps: {
              icon: "success",
            },
          });
        },
        onCancel: () => {},
      },
    });
  };

  const onDuplicateEntriesClick = (uniqueRepeaterIds) => {
    const duplicateEntries = () => {
      const newValue = [...value];
      const indexes = uniqueRepeaterIds.map((uniqueRepeaterId) =>
        newValue.findIndex((item) => item.uniqueRepeaterId === uniqueRepeaterId)
      );

      const minIndex = Math.min(...indexes);
      const maxIndex = Math.max(...indexes);

      const duplicatedEntries = newValue
        .slice(minIndex, maxIndex + 1)
        .map((item) => ({
          ...item,
          uniqueRepeaterId: shortid.generate(),
        }));

      newValue.splice(maxIndex + 1, 0, ...duplicatedEntries);
      onChange(newValue);
    };

    globalPrompt.onOpen({
      type: "warning",
      content: t["are_you_sure_to_duplicate_entries"],
      promptProps: {
        hideActions: true,
        icon: "warning",
        onConfirm: () => {
          duplicateEntries();
          globalPrompt.onOpen({
            type: "success",
            content: t["duplicate_success"],
            promptProps: {
              icon: "success",
            },
          });
        },
        onCancel: () => {},
      },
    });
  };

  const onMoveEntryClick = (row, direction) => {
    const moveEntry = () => {
      const index = value.indexOf(row);
      const newValue = [...value];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newValue.length) {
        return;
      }
      const removedElement = newValue.splice(index, 1)[0];
      newValue.splice(newIndex, 0, removedElement);
      onChange(newValue);
    };

    moveEntry();
  };

  const onMoveEntriesClick = (uniqueRepeaterIds, direction) => {
    // -1 is up, 1 is down
    // each item in value array has a uniqueRepeaterId property
    const moveEntries = () => {
      const newValue = [...value];
      const indexes = uniqueRepeaterIds.map((uniqueRepeaterId) =>
        newValue.findIndex((item) => item.uniqueRepeaterId === uniqueRepeaterId)
      );

      const minIndex = Math.min(...indexes);
      const maxIndex = Math.max(...indexes);

      if (
        (direction === -1 && minIndex === 0) ||
        (direction === 1 && maxIndex === newValue.length - 1)
      ) {
        return;
      }

      const removedElements = newValue.splice(minIndex, indexes.length);
      newValue.splice(minIndex + direction, 0, ...removedElements);
      onChange(newValue);
    };

    moveEntries();
  };

  const onDeleteEntryClick = (row) => {
    const deleteEntry = () => {
      const newValue = value.filter((item) => item !== row);
      onChange(newValue);
    };

    globalPrompt.onOpen({
      type: "warning",
      content: t["delete_confirmation"],
      promptProps: {
        hideActions: true,
        icon: "warning",
        onConfirm: () => {
          deleteEntry();
          globalPrompt.onOpen({
            type: "success",
            content: t["delete_success"],
            promptProps: {
              icon: "success",
            },
          });
        },
        onCancel: () => {},
      },
    });
  };

  const onDeleteEntriesClick = (uniqueRepeaterIds) => {
    const deleteEntries = () => {
      const newValue = value.filter(
        (item) => !uniqueRepeaterIds.includes(item.uniqueRepeaterId)
      );
      onChange(newValue);
    };

    globalPrompt.onOpen({
      type: "warning",
      content: t["delete_confirmation"],
      promptProps: {
        hideActions: true,
        icon: "warning",
        onConfirm: () => {
          deleteEntries();
          globalPrompt.onOpen({
            type: "success",
            content: t["delete_success"],
            promptProps: {
              icon: "success",
            },
          });
        },
        onCancel: () => {},
      },
    });
  };

  const onDeleteAllEntriesClick = () => {
    const deleteAllEntries = () => {
      onChange([]);
    };

    globalPrompt.onOpen({
      type: "warning",
      content: t["delete_confirmation"],
      promptProps: {
        hideActions: true,
        icon: "warning",
        onConfirm: () => {
          deleteAllEntries();
          globalPrompt.onOpen({
            type: "success",
            content: t["delete_success"],
            promptProps: {
              icon: "success",
            },
          });
        },
        onCancel: () => {},
      },
    });
  };

  // When an entry is deleted, we need to update selected
  useEffect(() => {
    if (value?.length === 0) {
      table.setSelected([]);
    }
  }, [value]);

  useEffect(() => {
    // if selected is not empty, we need to check if the selected items are still in value
    if (table.selected?.length) {
      const selected = table.selected.filter((item) =>
        value.find((valueItem) => valueItem.uniqueRepeaterId === item)
      );

      table.setSelected(selected);
    }
  }, [value, table.selected]);

  if (hideEmptyTable && !value?.length && canAdd) {
    return (
      <Box
        sx={{
          p: 1,
        }}
      >
        <Button
          onClick={onAddEntryClick}
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mdi:plus" />}
        >
          {t["add"]}
        </Button>
        <FormHelperText error={error}>{helperText}</FormHelperText>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: "divider",
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={1}>
        {canAdd && (
          <Button
            onClick={onAddEntryClick}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            {t["add"]}
          </Button>
        )}
        {value?.length > 0 && canDelete && (
          <Button
            onClick={onDeleteAllEntriesClick}
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Iconify icon="mdi:delete" />}
          >
            {t["remove_all"]}
          </Button>
        )}
      </Stack>
      <Table
        {...table}
        getUniqueRowId={(row) => row.uniqueRepeaterId}
        tableContainerProps={{
          sx: {
            maxHeight: 500,
            overflow: "auto",
          },
        }}
        tableHeadProps={{
          // bold
          sx: {
            "& th": {
              fontWeight: "bold",
            },
          },
        }}
        canReorder={canReorder}
        columns={
          canReorder
            ? [
                {
                  id: "order",
                  label: t["order"],
                  renderRow: (row) => (
                    <Stack direction="row" spacing={0}>
                      <IconButton
                        onClick={() => onMoveEntryClick(row, -1)}
                        size="small"
                      >
                        <Iconify icon="mdi:arrow-up" />
                      </IconButton>
                      <IconButton
                        onClick={() => onMoveEntryClick(row, 1)}
                        size="small"
                      >
                        <Iconify icon="mdi:arrow-down" />
                      </IconButton>
                    </Stack>
                  ),
                },
                ...columns,
              ]
            : columns
        }
        rows={value}
        emptyText={tableEmptyText}
        renderSelectedActions={(selected) => {
          return (
            <Stack direction="row" spacing={1}>
              {canReorder && selected.length !== value.length && (
                <>
                  <IconButton
                    onClick={() => onMoveEntriesClick(selected, -1)}
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    <Iconify icon="mdi:arrow-up" />
                  </IconButton>
                  <IconButton
                    onClick={() => onMoveEntriesClick(selected, 1)}
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    <Iconify icon="mdi:arrow-down" />
                  </IconButton>
                </>
              )}
              {canDuplicate && (
                <IconButton
                  onClick={() => onDuplicateEntriesClick(selected)}
                  variant="outlined"
                  color="inherit"
                  size="small"
                >
                  <Iconify icon="mdi:content-copy" />
                </IconButton>
              )}
              {canDelete && (
                <IconButton
                  onClick={() => onDeleteEntriesClick(selected)}
                  variant="outlined"
                  color="inherit"
                  size="small"
                >
                  <Iconify icon="mdi:delete" />
                </IconButton>
              )}
            </Stack>
          );
        }}
        {...((canEdit || canDelete || canDuplicate) && {
          renderActions: (row) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {canEdit && (
                  <Button
                    onClick={() => onEditEntryClick(row)}
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<Iconify icon="mdi:pencil" />}
                  >
                    {t["edit"]}
                  </Button>
                )}
                {canDuplicate && (
                  <Button
                    onClick={() => onDuplicateEntryClick(row)}
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Iconify icon="mdi:content-copy" />}
                  >
                    {t["duplicate"]}
                  </Button>
                )}
                {canDelete && (
                  <Button
                    onClick={() => onDeleteEntryClick(row)}
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="mdi:delete" />}
                  >
                    {t["remove"]}
                  </Button>
                )}
              </Box>
            );
          },
        })}
      />

      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Box>
  );
}

RepeaterField.propTypes = {
  fields: PropTypes.array,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.array,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  hideEmptyTable: PropTypes.bool,
  tableEmptyText: PropTypes.string,
  addEditFieldLayout: PropTypes.oneOf(["drawer", "dialog"]),
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canAdd: PropTypes.bool,
  canDuplicate: PropTypes.bool,
  canReorder: PropTypes.bool,
  enableSelection: PropTypes.bool,
  isDynamicFormRepeater: PropTypes.bool,
};
