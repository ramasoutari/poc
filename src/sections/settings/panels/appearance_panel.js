// @mui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Switch,
} from "@mui/material";
// hooks
// components
import ChangeLanguageDialog from "../../../layouts/_common/change-language-dialog";
import { useGlobalDialogContext } from "../../../components/global-dialog";
import { useLocales } from "../../../locales";
import SvgColor from "../../../components/svg-color";
import { useAccessibilityContext } from "../../../components/accessibility";

// ----------------------------------------------------------------------

export default function AppearancePanel() {
  const globalDialog = useGlobalDialogContext();
  const accessibility = useAccessibilityContext();
  const { t } = useLocales();

  const onChangeLanguageDialogOpen = () => {
    globalDialog.onOpen({
      title: t["language"],
      content: <ChangeLanguageDialog />,
    });
  };

  return (
    <>
      <List>
        {/* <ListItem>
          <ListItemIcon>
            <SvgColor src="/assets/icons/designer/global.svg" color="secondary.main" />
          </ListItemIcon>
          <ListItemText primary={tl['language']} />
          <Button
            onClick={onChangeLanguageDialogOpen}
            color="secondary"
            variant="contained"
            size="small"
          >
            {currentLang.label}
          </Button>
        </ListItem> */}
        <ListItem>
          <ListItemIcon>
            <SvgColor
              src="/assets/icons/designer/color-swatch.svg"
              color="secondary.main"
            />
          </ListItemIcon>
          <ListItemText primary={t["color_blind_mode"]} />
          <Switch
            onClick={accessibility.onToggleColorBlind}
            checked={accessibility.colorBlind}
          />
        </ListItem>
      </List>
    </>
  );
}
