import { combineReducers } from "redux";

import account from "./account";
// import { read, common } from './common';
// import modal from './modal';
import common from "./common";

export default combineReducers({
  account,
  common,
  // read,
  // common,
  // modal
});
