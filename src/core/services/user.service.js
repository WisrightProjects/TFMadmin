import { utils } from "core/helper";
import axios from "../config/axios";
import {
  BLOCK_PROFILE,
  CUSTOMER_REGISTER,
  DONT_SHOW,
  MY_MATCHES,
  NEAR_BY_MATCHES,
  PROFILE_DELETE_REQUEST,
  REGISTERED_USERS,
  SUBSCRIPTION_ANALYSIS,
  SUBSCRIPTION_CHART,
  TODAY_MATCHES,
  UPLOAD_PHOTOS,
  USER_PROFILE,
  NEW_MATCHES,
  RECENT_VIEWED_BY_ME,
  RECENT_VIEWED_BY_THEM,
  PREMIUM_MEMBERS,
  SETTINGS_PATH,
  DELETE_PROFILE,
  APPROVE_AND_DELETE_REQUEST,
} from "../services/apiURL.service";

const Users = {
  addUser: function (payload) {
    return axios
      .post(CUSTOMER_REGISTER, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  getUser: function (profileId) {
    return axios
      .get(USER_PROFILE + "/" + profileId)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  updateUser: function (payload, profileID) {
    return axios
      .put(USER_PROFILE + "/" + profileID, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  uploadImages: function (formData) {
    const headers = { "Content-Type": "multipart/form-data", accept: "*/*" };
    return axios
      .post(UPLOAD_PHOTOS, formData, headers)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  todayMatches: function (filter) {
    return axios
      .post(TODAY_MATCHES, filter)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  myMatches: function (filter) {
    return axios
      .post(MY_MATCHES, filter)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  newMatches: function (filter) {
    return axios
      .post(NEW_MATCHES, filter)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  nearByMatches: function (filter) {
    return axios
      .post(NEAR_BY_MATCHES, filter)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  recentViewedByMe: function (filter) {
    Object.keys(filter).forEach((k) => filter[k] === "" && delete filter[k]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(RECENT_VIEWED_BY_ME + "?" + filterString)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  recentViewedByThem: function (filter) {
    Object.keys(filter).forEach((k) => filter[k] === "" && delete filter[k]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(RECENT_VIEWED_BY_THEM + "?" + filterString)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  premiumMembers: function (filter) {
    Object.keys(filter).forEach((k) => filter[k] === "" && delete filter[k]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(PREMIUM_MEMBERS + "?" + filterString)
      .then((resp) => resp.data)
      .catch((err) => utils.showErrMsg(utils.handleErr(err)));
  },
  blockProfile: function (blockProfileId, userProfileId) {
    return axios
      .get(BLOCK_PROFILE + blockProfileId, userProfileId)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  dontShow: function (dontShowProfileId, userProfileId) {
    return axios
      .get(DONT_SHOW + dontShowProfileId, userProfileId)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  profileDeleteRequest: function (filter) {
    return axios
      .post(PROFILE_DELETE_REQUEST, filter)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
  approveDeleteRequest: function (id, type, payload) {
    return axios
      .patch(APPROVE_AND_DELETE_REQUEST + id + "?type=" + type, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  registeredUsers: function (filter) {
    Object.keys(filter).forEach((k) => filter[k] === "" && delete filter[k]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(REGISTERED_USERS + "?" + filterString)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  subScriptionChart: function () {
    return axios
      .get(SUBSCRIPTION_CHART)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  subScriptionAnalyisChart: function (filter) {
    Object.keys(filter).forEach((k) => filter[k] === "" && delete filter[k]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(SUBSCRIPTION_ANALYSIS + "?" + filterString)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  updateSettings: function (payload) {
    return axios
      .post(SETTINGS_PATH, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  deleteProfile: function (profileId, payload) {
    return axios
      .post(DELETE_PROFILE + profileId, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
};

export default Users;
