// import constant
import {
  SET_LOGGED_IN_USER,
  UPDATE_LOGGED_IN_USER,
  REMOVE_LOGGED_IN_USER,
  SET_FORGOT_USER,
} from "../constant";
import { setAuthUser, removeAuthUser } from "core/helper/localstorage";

const initialState = {
  isLoggedIn: false,
  token: "",
  authUser: "",
  forgotUser: {
    username: "",
    code: "",
  },
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGGED_IN_USER:
      setAuthUser(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_LOGGED_IN_USER:
      return {
        ...state,
        ...action.payload,
      };
    case REMOVE_LOGGED_IN_USER:
      removeAuthUser();
      return {
        ...state,
        ...action.payload,
      };
    case SET_FORGOT_USER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default account;
