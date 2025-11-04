// import * as config from '../../config/';

// import { getAuthToken } from "../../core/helper/localStorage";
import { toastAlert } from "../../lib/toastAlert";

export const isLogin = () => {
  // let token = getAuthToken()
  // if (!isEmpty(token)) {
  //     const jwtData = decodeJwt(token)
  //     if (jwtData.status) {
  //         return true
  //     }
  //     return false
  // }
  return false;
};

export const isLoginNew = () => {
  // let token = getAuthToken();
  // if (!isEmpty(token)) {
  //     const jwtData = decodeJwt(token);
  //     if (jwtData.status) {
  //         return jwtData.memberType;
  //     }
  //     return false;
  // }
  return false;
};

export const isLoginChk = async (isAlert = true, data = {}) => {
  try {
    if (isLogin()) {
      return true;
    } else if (isAlert) {
      if (data.alertShow) {
        toastAlert("warning", "Please login and continue", "userForm");
      }
      return false;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const isLoginCheck = async (data = {}) => {
  try {
    if (isLogin()) {
      return true;
    } else if (data.alertShow) {
      toastAlert(
        "warning",
        "Please login and continue",
        "isLoginCheck " + new Date()
      );
      return false;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
