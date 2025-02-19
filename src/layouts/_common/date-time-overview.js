import { useEffect, useState } from "react";
// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SvgColor from "../../components/svg-color";
// components

export default function DateTimeOverview() {
  // TIME
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "common.white",
          borderRadius: 1,
          p: 1,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <SvgColor src="/assets/icons/designer/clock.svg" width={20} />
          <Typography
            variant="caption"
            sx={{ color: "white" }}
            style={{
              direction: "ltr",
            }}
          >
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
            |{" "}
            {date.toLocaleDateString(["en-uk"], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </Typography>
        </Stack>
      </Box>
    </>
  );
}
