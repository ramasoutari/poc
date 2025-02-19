import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
// routes
//
import { useAuthContext } from '../hooks';
import { paths } from '../../routes/paths';
import { useRouter, useSearchParams } from '../../routes/hooks';

// ----------------------------------------------------------------------

export default function GuestGuard({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { authenticated, user } = useAuthContext();

  const returnTo =
    user?.type === 'cpd_entity'
      ? paths.cpdDashboard.trainingActivity.root
      : searchParams.get('returnTo') || paths.dashboard.root;

  const check = useCallback(() => {
    if (authenticated) {
      // Must be navigated depending on user type, if cpd to cpd-dashboard
      router.push(returnTo);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};
