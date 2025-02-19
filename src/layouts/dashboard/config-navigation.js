import { useCallback, useMemo } from "react";
import { useAuthContext } from "../../auth/hooks";
import { paths } from "../../routes/paths";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();
  const { t } = useLocales();

  const getMenuItems = useCallback(() => {
    if (user) {
      return [
        {
          title: t("my_orders"),
          path: paths.dashboard.root,
          auth: true,
          border: true,
          "data-tour-id": "my_orders_btn",
        },
        {
          title: t("services"),
          path: paths.dashboard.services.root,
          auth: true,
          border: true,
          "data-tour-id": "services_btn",
        },
      ];
    } else {
      return [
        {
          title: t("home"),
          path: paths.dashboard.root,
          guest: true,
          border: true,
        },
      ];
    }
  }, [t]);

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        // subheader: t('overview'),
        items: getMenuItems(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, user?.clinic?.EntityStatus_Code, t]
  );

  return data;
}

