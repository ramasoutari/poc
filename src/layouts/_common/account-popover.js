import { m } from "framer-motion";
// @mui
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button, Switch } from "@mui/material";
// routes
// hooks
// auth
// components
import ChangeLanguageDialog from "./change-language-dialog";
import { useEffect } from "react";
import { useAuthContext } from "../../auth/hooks";
import { paths } from "../../routes/paths";
import { useRouter } from "../../routes/hooks";
import { useTranslation } from "react-i18next";
import Iconify from "../../components/iconify";
import { useAccessibilityContext } from "../../components/accessibility";
import TextMaxLine from "../../components/text-max-line/text-max-line";
import ResetPasswordDialog from "../../sections/auth/jwt-institution-view/jwt-password-reset-dialog";
import CustomPopover, { usePopover } from "../../components/custom-popover";
import { useGlobalDialogContext } from "../../components/global-dialog";
import { useLocales } from "../../locales";
import SvgColor from "../../components/svg-color";
import i18n from "../../locales/i18n";

// ----------------------------------------------------------------------

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  "& .svg-color": {
    width: 20,
    flexShrink: 0,
    color: theme.palette.secondary.main,
  },
}));

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const accessibility = useAccessibilityContext();

  const { t } = useLocales();

  const { user } = useAuthContext();

  const { logout } = useAuthContext();

  const globalDialog = useGlobalDialogContext();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    if (path) {
      router.push(path);
    }
  };
  const handleOpenPassResetDialog = () => {
    globalDialog.onOpen({
      title: t("password_reset"),
      content: (
        <Box p={2}>
          <ResetPasswordDialog />
        </Box>
      ),
      dialogProps: {
        maxWidth: "sm",
      },
    });
  };

  const onChangeLanguageDialogOpen = () => {
    globalDialog.onOpen({
      title: t["language"],
      content: <ChangeLanguageDialog />,
    });
  };

  const renderAvatarUsername = user && (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        textAlign: "left",
      }}
    >
      {/* <Avatar
        src={user?.photoURL}
        alt={user?.displayName}
        sx={{
          width: 48,
          height: 48,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
          borderRadius: 1.5,
        }}
      /> */}
      <Box>
        {/* <TextMaxLine sx={{ filter: 'blur(5px)' }} variant="body2" fontWeight="fontWeightBold" line={2}> */}

        <TextMaxLine variant="body2" fontWeight="fontWeightBold" line={2}>
          {user.type === "user" ? user?.fullName : user.name}
        </TextMaxLine>

        {/* {user?.desc && (
          <Typography
            component="p"
            variant="caption"
            color="GrayText"
            sx={{
              p: 0,
              m: 0,
            }}
          >
            {user.desc}
          </Typography>
        )} */}
      </Box>
    </Box>
  );

  return (
    <div data-tour-id="user_option_menu" sx={{ direction }}>
      <Button component={m.button} onClick={popover.onOpen}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            textAlign: "left",
          }}
        >
          {renderAvatarUsername}
          <Iconify icon="eva:arrow-ios-downward-fill" width={20} height={20} />
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        hiddenArrow
        sx={{ width: 240, p: 0, backgroundColor: "common.white" }}
      >
        {/* <Box sx={{ p: 2, pb: 1.5 }}>{renderAvatarUsername}</Box> */}
        {process.env.REACT_APP_ENVIRONMENT === "development" &&
          user?.type === "user" && (
            <>
              {/* <Stack
                direction="column"
                sx={{
                  p: 1,
                }}
              >
                <StyledMenuItem onClick={() => handleClickItem(paths.dashboard.cpd.orders)}>
                  <SvgColor src="/assets/icons/designer/navbar/my-apps.svg" />
                  {t['cpd_cpd']}
                </StyledMenuItem>
              </Stack>

              <Divider /> */}
            </>
          )}

        <Stack
          direction="column"
          sx={{
            p: 1,
          }}
        >
          {/* <StyledMenuItem
            onClick={onChangeLanguageDialogOpen}
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" gap={1}>
              <SvgColor src="/assets/icons/designer/global.svg" />
              {t['language']}
            </Stack>
            <Label color="secondary">{currentLang.label}</Label>
          </StyledMenuItem> */}
          <StyledMenuItem onClick={accessibility.onToggleColorBlind}>
            <Stack direction="row" gap={1}>
              <SvgColor src="/assets/icons/designer/color-swatch.svg" />
              {t("color_blind_mode")}
            </Stack>
            <Switch checked={accessibility.colorBlind} />
          </StyledMenuItem>

          {user?.type !== "user" && !user?.clinic && (
            <StyledMenuItem onClick={handleOpenPassResetDialog}>
              <SvgColor src="/assets/icons/designer/password_reset.svg" />
              {t("password_reset")}
            </StyledMenuItem>
          )}
        </Stack>
        <Divider />
        <Stack
          direction="column"
          sx={{
            p: 1,
          }}
        >
          <StyledMenuItem onClick={handleLogout}>
            <SvgColor src="/assets/icons/designer/logout.svg" />
            {t("logout")}
          </StyledMenuItem>
        </Stack>
      </CustomPopover>
    </div>
  );
}
