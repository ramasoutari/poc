import PropTypes from "prop-types";
import { useEffect, useCallback, useState } from "react";
// routes
//
import { useAuthContext } from "../hooks";
import { paths } from "../../routes/paths";
import { useRouter } from "../../routes/hooks";
import { LoadingScreen } from "../../components/loading-screen";

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const router = useRouter();

  const { authenticated, method } = useAuthContext();
  console.log("loginPaths[method]", method);

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];
      console.log("loginPaths[method]", loginPaths[method]);

      const href = `${loginPath}?${searchParams}`;
      console.log("href", href);

      router.replace(href);
      console.log("href", href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
