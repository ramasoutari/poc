import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// sections
import { useResponsive } from "../../../hooks/use-responsive";
import MyOrdersView from "../../../sections/view/my-orders-view";
import { useLocales } from "../../../locales";
import { useOnboardingTourContext } from "../../../components/onboarding-tour/context/onboarding-tour-context";

// ----------------------------------------------------------------------

export default function MyOrdersPage() {
  const { t } = useLocales();
  const onBoarding = useOnboardingTourContext();
  const [onBoardingState, setOnboardingState] = useState(
    sessionStorage.getItem("onBoadring:my-orders") || false
  );
  // ('onBoadring:my-orders', false);
  const lgUp = useResponsive("up", "lg");

  // useEffect(() => {
  //   if (!onBoardingState) {
  //     sessionStorage.setItem("onBoadring:my-orders", true);
  //     onBoarding.onStart([
  //       {
  //         target: '[data-tour-id="accessiblity_toolbar"]',
  //         content: t("accessiblity_options"),
  //         disableBeacon: true,
  //       },
  //       ...(lgUp
  //         ? [
  //             {
  //               target: '[data-tour-id="my_orders_btn"]',
  //               content: t("my_orders_btn"),
  //               disableBeacon: true,
  //             },
  //             {
  //               target: '[data-tour-id="services_btn"]',
  //               content: t("services_btn"),
  //               disableBeacon: true,
  //             },
  //             {
  //               target: '[data-tour-id="orders_filters"]',
  //               content: t("orders_filters"),
  //               disableBeacon: true,
  //             },
  //             {
  //               target: '[data-tour-id="switch_orders_certificates"]',
  //               content: t("switch_orders_certificates"),
  //               disableBeacon: true,
  //             },
  //             // {
  //             //   target: '[data-tour-id="user_option_menu"]',
  //             //   content: tl['user_option_menu'],
  //             //   disableBeacon: true,
  //             //   callback: () => {
  //             //     const invokeSidbarBtn = document.getElementById('nav-toggle-btn');
  //             //     if (invokeSidbarBtn) {
  //             //       invokeSidbarBtn.click();
  //             //     }
  //             //   }
  //             // },
  //           ]
  //         : [
  //             {
  //               target: '[data-tour-id="nav-toggle"]',
  //               content: t("browse_app_ser"),
  //               disableBeacon: true,
  //             },
  //             {
  //               target: '[data-tour-id="user_option_menu"]',
  //               content: t("user_option_menu"),
  //               disableBeacon: true,
  //             },
  //             {
  //               target: '[data-tour-id="orders_filters"]',
  //               content: t("orders_filters"),
  //               disableBeacon: true,
  //             },
  //             {
  //               target: '[data-tour-id="switch_orders_certificates"]',
  //               content: t("switch_orders_certificates"),
  //               disableBeacon: true,
  //             },

  //             // {
  //             //   target: '[data-tour-id="nav-toggle-btn"]',
  //             //   content: tl['my_orders_btn'],
  //             //   disableBeacon: true,

  //             // }
  //             // ,
  //             // {
  //             //   target: '[data-tour-id="my_orders_btn"]',
  //             //   content: 'se1',
  //             //   disableBeacon: true,

  //             // },
  //             // {
  //             //   target: '[data-tour-id="services_btn"]',
  //             //   content: 'se2',
  //             //   disableBeacon: true,
  //             // },
  //           ]),
  //     ]);
  //   }
  // }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: My Applications</title>
      </Helmet>

      <MyOrdersView />
    </>
  );
}

