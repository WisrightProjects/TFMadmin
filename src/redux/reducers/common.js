import {
  RELOAD_PROFILE_DATA,
  SET_COMMON_DATA,
  SET_SITE_SETTINGS,
  TOGGLE_CLASS_ACTION,
} from "../constant";

const initialToggleAction = {
  isSidebarOpen: false,
  commonData: {},
  siteSettings: {},
  reload: false
};

const common = (state = initialToggleAction, action) => {
  switch (action.type) {
    case TOGGLE_CLASS_ACTION:
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case SET_COMMON_DATA:
      return {
        ...state,
        commonData: action.payload,
      };
    case SET_SITE_SETTINGS:
      return {
        ...state,
        siteSettings: action.payload,
      };
    case RELOAD_PROFILE_DATA: {
      return {
        ...state,
        reload: action.payload
      }
    }
    default:
      return state;
  }
};

export default common;
