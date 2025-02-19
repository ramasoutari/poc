import { Box, Typography } from "@mui/material";
import { useLocales } from "../../../locales";
import { useEffect } from "react";

export default function EntityDataBox({ data }) {
  const { t } = useLocales();
  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <>
      <Box
        sx={{
          py: 1,
        }}
      ></Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          top: 532.43,
          borderRadius: 1,
          borderWidth: 1,
          borderColor: "#000000",
          borderStyle: "solid",
          backgroundColor: "#F5F5F5",
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {data?.map(({ label, value }) => (
            <Box sx={{ width: "27.33%" }} key={label}>
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {t(label)}:
              </Typography>{" "}
              <Typography component="span">{value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
