/* eslint-disable jsx-a11y/iframe-has-title */
import PropTypes from "prop-types";
import { useFormContext, Controller, useController } from "react-hook-form";
import { useRequest } from "alova";
// @mui
import FormHelperText from "@mui/material/FormHelperText";
// utils
//
import { UploadAvatar, Upload, UploadBox, UploadField } from "../upload";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import uuidv4 from "../../utils/uuidv4";
import _ from "lodash";
import SvgColor from "../svg-color";
import imageCompression from "browser-image-compression";
import { PDFDocument } from "pdf-lib";
import { useResponsive } from "../../hooks/use-responsive";
import { useGlobalDialogContext } from "../global-dialog";
import axiosInstance from "../../utils/axios";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, sx, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox
          files={field.value}
          error={!!error}
          sx={{
            ...sx,
          }}
          {...other}
        />
      )}
    />
  );
}

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ "image/*": [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ "image/*": [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}

// ----------------------------------------------------------------------
export function RHFUploadField({
  name,
  sx,
  uploadStrategy,
  viewAttachmentApiLink,
  destinationApi,
  destinationApiToken,
  destinationExtraArgs,
  responseFileNameKey,
  allowedExtensions,
  attachmentName,
  minFileSize,
  maxFileSize,
  multiple,
  maximimFiles,
  ...other
}) {
  const allowedExtensionsList = allowedExtensions.slice();
  const { control, getValues, setValue, setError, clearErrors } =
    useFormContext();
  const [eFileId, setEFileId] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [viewFile, setViewFile] = useState(null);
  const { t } = useLocales();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const [loading, setLoading] = useState(false);
  // const {
  //   loading,
  //   send,
  //   data: options,
  // } = useRequest(
  //   (data) => uploadFileRequest(destinationApi, destinationApiToken, data, uploadStrategy), {
  //   immediate: false,
  // });

  const getSizeInMB = (size) => {
    return parseFloat(Number(size) / 1024).toFixed(2);
  };

  const parseExtension = (fileName) => {
    return fileName?.split(".")?.pop();
    // if (extension.includes("/")) {
    //   return extension.split("/")[1]
    // } else {
    //   return extension
    // }
  };

  const compressAndConvert = async (file) => {
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const compressedPdfBytes = await pdfDoc.save();
      const compressedBlob = new Blob([compressedPdfBytes]);
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf(".");
      const baseName = fileName.substring(0, lastDotIndex).replace(/\./g, "");
      const extension = fileName.substring(lastDotIndex);
      const cleanedFileName = baseName + extension;
      const compressedFile = new File([compressedBlob], cleanedFileName, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      return compressedFile;
    } catch (error) {
      console.error("Error during PDF compression:", error);
      throw error;
    }
  };

  // Function to upload a file
  const uploadFile = async (file) => {
    setCurrentFiles([]);

    // File extensions and initial error variable
    const fileSizeKiloBytes = file.size / 1024;

    const fileExt = file?.name.split(".");
    let error = "";

    // Validate file name and extension
    if (!file.name) {
      error = t?.translateValue("cannot_upload_file");
    } else if (
      // fileExt.length !== 2 ||
      !fileExt[0]
    ) {
      error = t?.translateValue("cannot_upload_file");
    } else if (
      allowedExtensionsList?.length > 0 &&
      !allowedExtensionsList?.includes(fileExt[fileExt.length - 1])
    ) {
      error = t?.translateValue("extension_not_allowed", {
        allowed_extensions: allowedExtensionsList
          .slice()
          // .map(ext => {
          //   return parseExtension(ext)
          // })
          .join(", "),
        extension: fileExt,
      });
    } else if (minFileSize && fileSizeKiloBytes < Number(minFileSize)) {
      error = t?.translateValue("file_size_cant_be_less_than", {
        size: getSizeInMB(minFileSize),
        unit: t("megabyte"),
      });
    } else {
      setCurrentFiles([file]);
    }

    // Handle non-image files directly without compression
    if (error) {
      setError(name, {
        message: error,
      });
      return;
    } else {
      clearErrors(name);
    }

    // Check if the file is an image
    if (file.type.startsWith("image/")) {
      try {
        // Compress the image
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920, // You can limit the dimensions as well
          useWebWorker: true,
        };

        const fileName = file.name;
        const lastDotIndex = fileName.lastIndexOf(".");
        const baseName = fileName.substring(0, lastDotIndex).replace(/\./g, "");
        const extension = fileName.substring(lastDotIndex);
        const cleanedFileName = baseName + extension;
        const updatedFile = new File([file], cleanedFileName, {
          type: file.type,
          lastModified: file.lastModified,
        });

        let compressedFile;
        try {
          const compressed = await imageCompression(updatedFile, options);
          compressedFile = compressed;
        } catch {
          compressedFile = updatedFile;
        }

        // Check the compressed file size
        const compressedFileSizeKiloBytes = compressedFile.size / 1024;
        if (compressedFileSizeKiloBytes > Number(maxFileSize)) {
          error = t?.translateValue("file_size_cant_be_larger_than", {
            size: getSizeInMB(maxFileSize),
            unit: t["megabyte"],
          });
          setError(name, { message: error });
          return;
        }

        // If there are no errors, continue with upload logic
        setCurrentFiles([compressedFile]);

        // Check upload strategy
        if (uploadStrategy === "form-data") {
          const formData = new FormData();
          formData.append("File", compressedFile);

          // Append Extra Args
          if (Object.keys(destinationExtraArgs).length > 0) {
            Object.keys(destinationExtraArgs).forEach((key) => {
              formData.append(key, destinationExtraArgs[key]);
            });
          }

          const response = await axiosInstance.post(destinationApi, formData, {
            headers: {
              ...(destinationApiToken && { token: destinationApiToken }),
              "Content-Type": "multipart/form-data",
            },
          });

          return response.data[responseFileNameKey];
        }

        if (uploadStrategy === "tempId") {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = (err) => {
              console.error("Error reading file:", err);
              reject(err);
            };
            reader.readAsDataURL(compressedFile);
          });

          const response = await axiosInstance.post(
            destinationApi,
            {
              base64: base64.toString().split("base64,").pop(),
            },
            {
              headers: {
                ...(destinationApiToken && { token: destinationApiToken }),
              },
            }
          );

          if (!eFileId) {
            setEFileId(response?.data);
          }
          const randomFileId = uuidv4().toString();
          return (
            _.get(response.data, responseFileNameKey)?.toString() ||
            randomFileId
          );
        }

        if (uploadStrategy === "base64") {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = (err) => {
              console.error("Error reading file:", err);
              reject(err);
            };
            reader.readAsDataURL(compressedFile);
          });

          const response = await axiosInstance.post(
            destinationApi,
            {
              base64: base64.toString().split("base64,").pop(),
            },
            {
              headers: {
                ...(destinationApiToken && { token: destinationApiToken }),
              },
            }
          );
          console.log(
            "response.data.data[responseFileNameKey];",
            response.data[responseFileNameKey]
          );
          return response.data[responseFileNameKey];
        }
      } catch (compressionError) {
        console.error("Error:", compressionError);
        setError(name, { message: t?.translateValue("Error") });
        return;
      }
    } else {
      const compressedFile = await compressAndConvert(file);

      const compressedFileSize = compressedFile.size / 1024;

      if (maxFileSize && compressedFileSize > Number(maxFileSize)) {
        error = t?.translateValue("file_size_cant_be_larger_than", {
          size: getSizeInMB(maxFileSize),
          unit: t["megabyte"],
        });
      }

      if (error) {
        setError(name, {
          message: error,
        });
        return;
      } else {
        clearErrors(name);
      }

      setCurrentFiles([compressedFile]);

      try {
        if (uploadStrategy === "form-data") {
          const formData = new FormData();

          // Append File
          formData.append("File", compressedFile);

          // Append Extra Args
          if (Object.keys(destinationExtraArgs).length > 0) {
            Object.keys(destinationExtraArgs).forEach((key) => {
              formData.append(key, destinationExtraArgs[key]);
            });
          }

          try {
            const response = await axiosInstance.post(
              destinationApi,
              formData,
              {
                headers: {
                  ...(destinationApiToken && {
                    token: destinationApiToken,
                  }),
                  "Content-Type": "multipart/form-data",
                  // access_key: ACCESS_KEY,
                },
              }
            );

            return response.data[responseFileNameKey];
          } catch (error) {
            console.log(error);
          }
        }

        if (uploadStrategy === "tempId") {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => {
              console.error("FileReader error:", error);
              reject(error);
            };
            reader.readAsDataURL(compressedFile);
          });

          try {
            const response = await axiosInstance.post(
              destinationApi,
              {
                base64: base64.toString().split("base64,").pop(),
              },
              {
                headers: {
                  ...(destinationApiToken && {
                    token: destinationApiToken,
                  }),
                  // access_key: ACCESS_KEY,
                },
              }
            );

            if (!eFileId) {
              setEFileId(response?.data);
            }

            const randomFileId = uuidv4().toString();

            return (
              _.get(response.data, responseFileNameKey)?.toString() ||
              randomFileId
            );
          } catch (error) {
            console.log(error);
          }
        }
        if (uploadStrategy === "base64") {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(compressedFile);
          });

          try {
            const response = await axiosInstance.post(
              destinationApi,
              {
                base64: base64.toString().split("base64,").pop(),
              },
              {
                headers: {
                  ...(destinationApiToken && {
                    token: destinationApiToken,
                  }),
                  // access_key: ACCESS_KEY,
                },
              }
            );
            console.log(
              "response.data.data[responseFileNameKey]",
              response.data[responseFileNameKey]
            );
            return response.data[responseFileNameKey];
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error("Error uploading non-image file:", error);
        setError(name, { message: t?.translateValue("file_read_failed") });
        return;
      }
    }
  };

  const reader = new FileReader();

  const uploadFiles = async (files) => {
    console.log("jjejejejejejejejej");
    // check if files count is more than maximum allowed files

    // if files count is more than maximum allowed files
    // or if old files count + new files count is more than maximum allowed files
    if (
      (maximimFiles && files.length > maximimFiles) ||
      (field.value && field.value.length + files.length > maximimFiles)
    ) {
      setError(name, {
        message: t?.translateValue("maximum_files_allowed", {
          max: maximimFiles,
        }),
      });
      return;
    } else {
      clearErrors(name);
    }

    try {
      let uploadedFilesIds = [];

      setLoading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          const base64Data = reader.result.split(",")[1];
          file.base64 = base64Data;
        };
        const uploadedFileId = await uploadFile(file);

        if (uploadedFileId) {
          uploadedFilesIds.push(uploadedFileId);
          file.id = uploadedFilesIds[0];
          const updatedFiles = !multiple ? [file] : [...currentFiles, file];
          setCurrentFiles(updatedFiles);

          // (!multiple ? setCurrentFiles([file]) : setCurrentFiles([...currentFiles, file]))
        }
      }

      setLoading(false);

      // field.onChange(response.data.data[responseFileNameKey]);
      // setValue(name + '_filename', file.name);

      if (uploadedFilesIds.length > 0) {
        if (!multiple) {
          setValue(name + "_filename_display", files[0]?.name?.toString());
          setValue(
            name + "_filename",
            files[0]?.name?.toString()?.replace((/\./g, "-"))
          );
          setValue(name + "_base64", files[0].base64);
          setValue(name + "_type", files[0].type);
          setValue(name + "_attachmentName", attachmentName);
          field.onChange(uploadedFilesIds);
        } else {
          field.onChange(
            field.value
              ? field.value.concat(uploadedFilesIds)
              : uploadedFilesIds
          );
          uploadedFilesIds.forEach((id, index) => {
            setValue(
              name + id + "_filename_display",
              String(files[index]?.path)
            );
            setValue(
              name + id + "_filename",
              String(files[index]?.path)?.replace((/\./g, "-"))
            );
            setValue(name + id + "_base64", files[index].base64);
            setValue(name + id + "_type", files[index].type);
            setValue(
              name + id + "_attachmentName",
              files[index].attachmentName
            );
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (other.defaultValue) {
      setValue(name, other?.value || other.defaultValue || []);
    }
  }, [other.defaultValue]);
  const removeAttachment = (id) => {
    clearErrors(name);
    if (!multiple) {
      field.onChange([]);
      setValue(name + "_filename", "");
      setValue(name + "_filename_display", "");
      setValue(name + "_type", "");
      setValue(name + "_base64", "");
      setValue(name + "_attachment_name", "");
      setCurrentFiles([]);
    } else {
      field.onChange(field.value.filter((file) => file !== id));
      // const updatedFiles = field.value.filter((file) => file !== id);
      // field.onChange(updatedFiles.length > 0 ? updatedFiles : []);
      setValue(name + id + "_filename", "");
      setValue(name + "_filename_display", "");
      setValue(name + id + "_type", "");
      setValue(name + id + "_base64", "");
      setValue(name + "_attachment_name", "");
      setCurrentFiles(currentFiles.filter((file) => file.id !== id));
    }
  };
  const globalDialog = useGlobalDialogContext();

  const handleOpenViewFileDialog = (id) => {
    if (viewAttachmentApiLink) {
      if (typeof viewAttachmentApiLink === "function") {
        const file = Array.isArray(getValues(name))
          ? getValues(name)?.[0]
          : getValues(name);
        const link = viewAttachmentApiLink(id || file);
        return window.open(link, "_blank");
      }
    }

    let selectedFile;

    if (!multiple) {
      selectedFile = {
        name: getValues(name + "_filename"),
        type: getValues(name + "_type"),
        base64: getValues(name + "_base64"),
      };
    } else {
      const myFiles = [];
      const filesIds = getValues(name);
      for (let i = 0; i < filesIds.length; i++) {
        myFiles.push({
          id: filesIds[i],
          name: getValues(name + filesIds[i] + "_filename"),
          type: getValues(name + filesIds[i] + "_type"),
          base64: getValues(name + filesIds[i] + "_base64"),
        });
      }

      selectedFile = myFiles.find((file) => file.id === id);
    }

    setViewFile(selectedFile);
  };

  const handleCloseViewFileDialog = () => {
    setViewFile(null);
  };
  const smUp = useResponsive("up", "sm");
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.5)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
      )}

      <Stack direction="row" alignItems="center" gap={1}>
        <Stack
          flex={1}
          sx={{
            position: "relative",
          }}
        >
          {other?.disabled && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.5)",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></div>
          )}
          <UploadField
            multiple={multiple}
            error={!!error}
            file={getValues(name + "_filename_display") || getValues(name)}
            onDrop={(acceptedFiles) => {
              uploadFiles(acceptedFiles);
            }}
            loading={loading}
            sx={{
              ...sx,
              ...(error && {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) =>
                    `${theme.palette.error.main} !important`,
                },
              }),
            }}
            {...other}
          />
          {/* <iframe title=multiple width='500' height='200' alt="" src={`data:${currentFiles.type};base64,${currentFiles.base64}`} /> */}
        </Stack>

        {!multiple && (field?.value?.length > 0 || !!viewAttachmentApiLink) && (
          <Box>
            {!viewAttachmentApiLink && getValues(name + "_base64") && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenViewFileDialog}
                size={!smUp ? "small" : "medium"}
              >
                {t("show")}
              </Button>
            )}
            {!!viewAttachmentApiLink &&
              ((Array.isArray(getValues(name)) &&
                getValues(name)?.length > 0) ||
                (typeof getValues(name) === "string" && getValues(name))) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenViewFileDialog}
                  size={!smUp ? "small" : "medium"}
                >
                  {t["show"]}
                </Button>
              )}
            {(getValues(name + "_base64") && !viewAttachmentApiLink) ||
            (!!viewAttachmentApiLink &&
              Array.isArray(getValues(name)) &&
              getValues(name)?.length > 0) ||
            (typeof getValues(name) === "string" && getValues(name)) ? (
              <Button
                onClick={removeAttachment}
                variant="text"
                size="small"
                color="error"
                disabled={other?.disabled}
              >
                {t("remove")}
              </Button>
            ) : null}
          </Box>
        )}
      </Stack>

      {/* List attachment names + remove btn */}

      {multiple && field.value?.length > 0 && (
        <Stack direction="column" gap={1} sx={{ mt: 1 }}>
          {field.value.map((id) => (
            <Stack key={id} direction="row" alignItems="center" gap={1}>
              <Typography variant="body2">
                {getValues(name + id + "_filename_display")}
              </Typography>
              <Button
                onClick={() => removeAttachment(id)}
                variant="text"
                size="small"
                color="error"
              >
                {t("remove")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenViewFileDialog(id)}
              >
                {t("show")}
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
      <FormHelperText sx={{ px: 2 }}>
        {
          t[
            ("file_size_cant_be_larger_than",
            {
              size: getSizeInMB(maxFileSize)?.replace(".00", ""),
              unit: t("megabyte"),
            })
          ]
        }
        <br />
        {t("allowed_extensions")}:{" "}
        {allowedExtensionsList
          .slice()
          // .map(ext => {
          //   return parseExtension(ext)
          // })
          .join(", ")}
        <br />
        {!!multiple &&
          t[
            ("maximum_files_allowed",
            {
              max: maximimFiles,
            })
          ]}
      </FormHelperText>

      {!!error && (
        <FormHelperText error sx={{ px: 2 }}>
          {error.message}
        </FormHelperText>
      )}

      {/* Our View File Dialog */}
      {viewFile && (
        <>
          <Dialog
            fullWidth
            maxWidth={"md"}
            open
            onClose={handleCloseViewFileDialog}
            sx={{
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={handleCloseViewFileDialog}
              sx={{
                position: "absolute",
                top: (theme) => theme.spacing(1),
                right: (theme) => theme.spacing(1),
                zIndex: 1000,
              }}
            >
              <SvgColor
                src="/assets/icons/designer/close.svg"
                color="text.secondary"
                width={24}
              />
            </IconButton>
            <hr></hr>
            <DialogTitle
              sx={{
                maxWidth: "100%",
                pb: 1,
                textAlign: "center",
                overflowWrap: "break-word",
              }}
            >
              <Typography variant="h6">{viewFile?.name}</Typography>
            </DialogTitle>

            {/* <DialogContent */}
            {viewFile?.type === "application/pdf" ? (
              <iframe src={`data:application/pdf;base64,${viewFile?.base64}`} />
            ) : (
              <Box
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  // width: "100%",
                  height: "100%",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  pb: 4,
                  px: 4,
                }}
              >
                <img
                  src={`data:${viewFile?.type};base64,${viewFile?.base64}`}
                />
              </Box>
            )}

            {/* </DialogContent> */}
          </Dialog>
        </>
      )}
    </div>
  );
}

RHFUploadField.propTypes = {
  name: PropTypes.string,
  sx: PropTypes.object,
  uploadStrategy: PropTypes.string,
  destinationApi: PropTypes.string,
  destinationApiToken: PropTypes.string,
  destinationExtraArgs: PropTypes.object,
  responseFileNameKey: PropTypes.string,
  allowedExtensions: PropTypes.arrayOf(PropTypes.string),
  minFileSize: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  maxFileSize: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
};

RHFUpload.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  sx: PropTypes.object,
};
