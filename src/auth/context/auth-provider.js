import PropTypes from 'prop-types';
import { useReducer, useCallback, useMemo } from 'react';
// utils
//
import { AuthContext } from './auth-context';
import { setSession } from './utils';
import { useAuthContext } from '../hooks';
import { HOST_API } from '../../config-global';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};
const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuthContext();

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      // if (accessToken && isValidToken(accessToken)) {
      if (accessToken) {
        setSession(accessToken);

        const response = await axiosInstance.get(`${HOST_API}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let user = response.data.data;
        setSession(user.token);

        delete user.token;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        logout();
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      logout();
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  // LOGIN
  const login = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(`${HOST_API}/JordanianUserLogin`, data);

      const user = response?.data?.data;
      const { token, ...userWithoutToken } = user;
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: '001',
      };

      setSession(token);

      onSuccess?.();
      dispatch({
        type: 'LOGIN',
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      console.log('error1', JSON.stringify(error));
      throw error;
    }
  }, []);

  const rmsLogin = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(`${HOST_API}/RmsLogin`, data);

      const user = response?.data?.data;
      const { token, ...userWithoutToken } = user;
      setSession(token);
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: '001',
      };

      onSuccess?.();
      dispatch({
        type: 'LOGIN',
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const entityLogin = useCallback(async (data, onSuccess, onOtpSent) => {
    try {
      const response = await axiosInstance.post(`${HOST_API}/EntityLogin`, data);
      if (!response?.data?.data?.token) {
        const error = response.data?.error && JSON.parse(response.data?.error)


        return onOtpSent(
          error && error.error
        )
      }
      const user = response?.data?.data;
      const { token, ...userWithoutToken } = user;
      setSession(token);
      let myUser = {
        ...userWithoutToken,
      };

      onSuccess?.();
      dispatch({
        type: 'LOGIN',
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      throw error;
    }
  }, []);

  // const cpdLogin = useCallback(async (data, onSuccess, onOtpSent) => {
  //   try {
  //     const response = await axiosInstance.post(cpdEndpoints.loginEntity, data);
  //     if (!response?.data?.data?.token) {
  //       const error = response.data?.error && JSON.parse(response.data?.error)


  //       return onOtpSent(
  //         error && error.error
  //       )
  //     }
  //     const user = response?.data?.data;
  //     // const user = FAKE_USER_CPD;

  //     const { token, ...userWithoutToken } = user;
  //     setSession(token);
  //     let myUser = {
  //       ...userWithoutToken,
  //     };

  //     onSuccess?.();
  //     dispatch({
  //       type: 'LOGIN',
  //       payload: {
  //         user: myUser,
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }, []);

  const loginWithSanad = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(`${HOST_API}/loginWithSanad`, {
        code: data.sanadCode,
        verifier: data.sanadState,
      });

      const user = response?.data?.data;
      const { token, ...userWithoutToken } = user;
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: '001',
      };

      setSession(token);

      onSuccess?.();
      dispatch({
        type: 'LOGIN',
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      console.log('error1', JSON.stringify(error));
      throw error;
    }
  }, []);

  // REGISTER
  const register = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(`${HOST_API}/JordanianUserRegister`, data);

      onSuccess?.();
      const user = response.data.data;
      const { token, ...userWithoutToken } = user;
      setSession(token);
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: '001',
      };

      onSuccess?.();

      dispatch({
        type: 'REGISTER',
        payload: {
          user: {
            data: myUser,
          },
        },
      });

      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } catch (error) {
      throw error;
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);

    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      accessToken: localStorage.getItem(STORAGE_KEY),
      //
      initialize,
      login,
      rmsLogin,
      loginWithSanad,
      entityLogin,
      register,
      logout,
    }),
    [login, rmsLogin, entityLogin, loginWithSanad, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
