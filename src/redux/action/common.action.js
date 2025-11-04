import {
  TOGGLE_CLASS_ACTION,
  SET_COMMON_DATA,
  SET_SITE_SETTINGS,
} from "../constant";

export const toggleAction = () => (dispatch) => {
  dispatch({
    type: TOGGLE_CLASS_ACTION,
  });
};

export const setCommonDataAction = (payload) => (dispatch) => {
  dispatch({
    type: SET_COMMON_DATA,
    info: "set common data",
    payload,
  });
};

export const setSiteSettingsAction = (payload) => (dispatch) => {
  dispatch({
    type: SET_SITE_SETTINGS,
    info: "set site settings",
    payload,
  });
};
