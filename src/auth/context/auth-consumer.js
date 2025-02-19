import PropTypes from 'prop-types';
// components
//
import { AuthContext } from './auth-context';
import { SplashScreen } from '../../components/loading-screen';

// ----------------------------------------------------------------------

export function AuthConsumer({ children }) {



  return (
    <AuthContext.Consumer>
      {(auth) => (auth.loading ? <SplashScreen /> : children)}
    </AuthContext.Consumer>
  );
}

AuthConsumer.propTypes = {
  children: PropTypes.node,
};
