import React, { useState } from "react";
import PropTypes from "prop-types";
// @mui
import { Box, Typography } from "@mui/material";
// hooks
// components
import DynamicForm, { getForm } from "../dynamic-form";
import _ from "lodash";
import shortid from "shortid";
import { useTranslation } from "react-i18next";
import { useLocales } from "../../locales";

export default function AddEditEntryDialog({
  fields,
  value,
  onOpen,
  onChange,
  onAddEntry,
  onEditEntry,
  onAddEditEntry,
  row,
  isEdit,
  onClose,
  submitButtonProps,
  filterValues,
  handleFetchEntries,
}) {
  const { t } = useLocales();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = getForm(fields);

  const defaultValues = {
    ...form.defaultValues,
    ...row,
  };

  const handleSubmit = async (data) => {
    const createNewValue = (newData) => {
      return isEdit
        ? value.map((item) => (item === row ? newData : item))
        : [...value, { ...newData, uniqueRepeaterId: shortid.generate() }];
    };

    setLoading(true);
    setIsSubmitted(true);
    if (!isEdit) {
      // Add Case
      if (onAddEditEntry) {
        return await onAddEditEntry(data, async (newData) => {
          await onChange(createNewValue(newData || data));
          if (handleFetchEntries && typeof handleFetchEntries === "function") {
            await handleFetchEntries(1);
          }
          if (onClose) onClose();
        });
      } else if (onAddEntry) {
        return await onAddEditEntry(data, async (newData) => {
          await onChange(createNewValue(newData || data));
          if (onClose) onClose();
        });
      }
    } else {
      // Edit Case
      if (onAddEditEntry) {
        return await onAddEditEntry(
          {
            ...data,
            oldData: row,
          },
          async (newData) => {
            await onChange(createNewValue(newData || data));
            if (onClose) onClose();
          }
        );
      } else if (onAddEntry) {
        return await onEditEntry(data, async (newData) => {
          await onChange(createNewValue(newData || data));
          if (onClose) onClose();
        });
      }
    }

    onChange(createNewValue(data));
    setLoading(false);

    if (onClose) onClose();
  };

  return (
    <>
      <Box
        sx={{
          py: 2,
          px: 3,
          minHeight: 600,
        }}
      >
        <DynamicForm
          {...form}
          isInRepeater={true}
          defaultValues={defaultValues}
          filterValues={filterValues}
          onOpen={onOpen}
          onSubmit={handleSubmit}
          submitButtonProps={{
            ...submitButtonProps,
            disabled: loading || isSubmitted,
            loading: loading,
            ...(submitButtonProps?.label && {
              label: t(submitButtonProps?.label) || t("submit"),
            }),
            ...(isEdit && {
              label: t(submitButtonProps?.label) || t("edit"),
            }),
          }}
        />
      </Box>
    </>
  );
}

AddEditEntryDialog.propTypes = {
  fields: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onAddEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  onAddEditEntry: PropTypes.func,
  row: PropTypes.object,
  isEdit: PropTypes.bool,
};
