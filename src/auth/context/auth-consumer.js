import PropTypes from "prop-types";
// components
//
import { AuthContext } from "./auth-context";
import { SplashScreen } from "../../components/loading-screen";
import { useSkipFirstRender } from "../../hooks/use-skip-first-render";
import { useAuthContext } from "../hooks";
import { useLocales } from "../../locales";
import { useEffect } from "react";

// ----------------------------------------------------------------------

export function AuthConsumer({ children }) {
  const { initialize } = useAuthContext();
  const { currentLang } = useLocales();
  console.log("currentLang", currentLang);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <AuthContext.Consumer>
      {(auth) => (auth.loading ? <SplashScreen /> : children)}
    </AuthContext.Consumer>
  );
}

AuthConsumer.propTypes = {
  children: PropTypes.node,
};
