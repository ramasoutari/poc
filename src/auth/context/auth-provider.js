// ----------------------------------------------------------------------
import PropTypes from "prop-types";
import { useCallback, useMemo, useReducer } from "react";
import { useAuthContext } from "../hooks";
import axiosInstance from "../../utils/axios";
import { HOST_API } from "../../config-global";
import { AuthContext } from "./auth-context";
import { setSession } from "./utils";

const initialState = {
  user: null,
  loading: true,
};
const reducer = (state, action) => {
  if (action.type === "INITIAL") {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGIN") {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === "REGISTER") {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = "accessToken";

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuthContext();

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        setSession(accessToken);
       

        const response = await axiosInstance.get(`${HOST_API}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-session-id": localStorage.getItem("sessionId"),
          },
        });

        let user = response.data;
        setSession(user.token);
        delete user.token;

        dispatch({
          type: "INITIAL",
          payload: {
            user,
          },
        });
      } else {
        console.log("hiiii");
        logout();
        console.log("state.usewwwr", state.user);
        dispatch({
          type: "INITIAL",
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.log("hiiii");

      logout();
      console.error(error);
      dispatch({
        type: "INITIAL",
        payload: {
          user: null,
        },
      });
    }
  }, []);

  // LOGIN
  const login = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(
        `${HOST_API}/JordanianUserLogin`,
        data
      );

      const user = response?.data?.data;
      const { token, ...userWithoutToken } = user;
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: "001",
      };

      setSession(token);

      onSuccess?.();
      dispatch({
        type: "LOGIN",
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      console.log("error1", JSON.stringify(error));
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
        nationalityType_code: "001",
      };

      onSuccess?.();
      dispatch({
        type: "LOGIN",
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const entityLogin = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(
        `${HOST_API}/Entity/Login`,
        data
      );
      if (!response?.data.token) {
        throw new Error("Login failed: No token received.");
      }
      const user = response.data;
      console.log("userrrrrr", user);
      localStorage.setItem("sessionId", user.sessionId);
      localStorage.setItem("accessToken", user.token);

      setSession(user.token);
      let myUser = { ...user };

      onSuccess?.();
      dispatch({
        type: "LOGIN",
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const loginWithSanad = useCallback(async (data, onSuccess) => {
    console.log('sadasd')
    try {
      const response = await axiosInstance.post(`${HOST_API}/loginWithSanad`, {
        code: data.sanadCode,
        verifier: data.sanadState,
      });

      const user = response?.data?.user;
      const { token, ...userWithoutToken } = user;
      let myUser = {
        ...userWithoutToken,
      };

      setSession(token);

      onSuccess?.();
      dispatch({
        type: "LOGIN",
        payload: {
          user: myUser,
        },
      });
    } catch (error) {
      console.log("error1", JSON.stringify(error));
      throw error;
    }
  }, []);

  // REGISTER
  const register = useCallback(async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(
        `${HOST_API}/JordanianUserRegister`,
        data
      );

      onSuccess?.();
      const user = response.data.data;
      const { token, ...userWithoutToken } = user;
      setSession(token);
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: "001",
      };

      onSuccess?.();

      dispatch({
        type: "REGISTER",
        payload: {
          user: {
            data: myUser,
          },
        },
      });

      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
    } catch (error) {
      throw error;
    }
  }, []);
  const mockLogin = useCallback(async (data, onSuccess) => {
    try {
      const user = {
        id: "12345",
        age: 46,
        name: "راما سعيد لسوطري",
        email: "test@example.com",
        role: { id: 1, role: "admin" },
        nationalityType_code: "001",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOEJCMDBBQi1BRUVFLUVGMTEtQjlDQi05ODU5N0FCNUUyMTEiLCJ0eXBlIjoiZW50aXR5IiwiaWF0IjoxNzQwMzIxMDMyLCJleHAiOjE3NDAzMjE5MzJ9.TOLHj8_jDqyrOaL_jfHHQbZVzhxdyDedTiVR7hz_b9Q",
      };
      const { token, ...userWithoutToken } = user;

      setSession(token);
      let myUser = {
        ...userWithoutToken,
        nationalityType_code: "001",
      };
      console.log("Session token stored:", localStorage.getItem(STORAGE_KEY)); // Debugging

      onSuccess?.();
      dispatch({
        type: "LOGIN",
        payload: {
          user: myUser,
        },
      });
      console.log("User state after login:", user); // Add this for debugging
    } catch (error) {
      console.error("Mock login error:", error);
      throw error;
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);

    dispatch({
      type: "LOGOUT",
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";
  console.log(" state.user", state);

  const status = state.loading ? "loading" : checkAuthenticated;
  console.log(" status", status);
  console.log(" access token", localStorage.getItem(STORAGE_KEY));

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      accessToken: localStorage.getItem(STORAGE_KEY),
      //
      initialize,
      login,
      rmsLogin,
      loginWithSanad,
      entityLogin,
      register,
      logout,
      mockLogin,
    }),
    [
      login,
      rmsLogin,
      entityLogin,
      loginWithSanad,
      logout,
      register,
      state.user,
      status,
      mockLogin,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
