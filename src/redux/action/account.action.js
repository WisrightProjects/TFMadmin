import {
  SET_LOGGED_IN_USER,
  UPDATE_LOGGED_IN_USER,
  REMOVE_LOGGED_IN_USER,
  SET_FORGOT_USER,
  RELOAD_PROFILE_DATA,
} from "../constant";

export const loginAction = (user) => (dispatch) => {
  dispatch({
    type: SET_LOGGED_IN_USER,
    info: "user login and store user details in store",
    payload: user,
  });
};

export const updateLoginAction = (user) => (dispatch) => {
  dispatch({
    type: UPDATE_LOGGED_IN_USER,
    info: "update user login information in store",
    payload: user,
  });
};

export const logoutAction = () => {
  return {
    type: REMOVE_LOGGED_IN_USER,
    info: "user logout",
    payload: {
      isLoggedIn: false,
      token: "",
      authUser: "",
    },
  };
};

export const forgotAction = (user) => (dispatch) => {
  dispatch({
    type: SET_FORGOT_USER,
    information: "user forgot data",
    payload: user,
  });
};

export const reloadProfileAction = (payload) => (dispatch) => {
  dispatch({
    type: RELOAD_PROFILE_DATA,
    payload,
  });
};
