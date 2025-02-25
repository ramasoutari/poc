// @mui
import { styled } from "@mui/material/styles";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";

// ----------------------------------------------------------------------

export const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active, open, depth, config, theme }) => {
  const subItem = depth !== 1;

  const activeStyles = {
    color: theme.palette.common.white,
    backgroundColor: "#1D3E6E",
  };

  return {
    width: "100.06px",
    height: "39.48px",
    marginRight: config.itemGap,
    borderRadius: "8px",
    minHeight: config.itemRootHeight,
    color: theme.palette.text.secondary,
    borderColor: theme.palette.text.secondary,
    borderWidth: "1px",
    borderStyle: !subItem && "solid",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    transition: "all 0.3s ease",

    // Active item styles
    ...(active && {
      ...activeStyles,
    }),

    // Sub item styles
    ...(subItem && {
      margin: 0,
      padding: theme.spacing(0, 1),
      minHeight: config.itemSubHeight,
    }),

    // Hover styles
    "&:hover": {
      backgroundColor: active ? "#1D3E6E" : "#15325A", // Darker blue on hover
      color: theme.palette.common.white, // White text on hover
      borderColor: "#1D3E6E", // Border color changes
    },

    // Open item styles (when hovered but not active)
    ...(open &&
      !active && {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,
      }),
  };
});

// ----------------------------------------------------------------------

export const StyledIcon = styled(ListItemIcon)(({ size }) => ({
  width: size,
  height: size,
  flexShrink: 0,
  marginRight: 0,
}));
