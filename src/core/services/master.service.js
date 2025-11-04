import axios from "../config/axios";
import { utils } from "core/helper";

const Master = {
  getAll: function (urlPath, filter) {
    Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(urlPath + "?" + filterString)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  get: function (urlPath) {
    return axios
      .get(urlPath)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  getAllPost: function (urlPath, filter) {
    return axios
      .post(urlPath, filter)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  create: function (urlPath, payload) {
    return axios
      .post(urlPath, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  update: function (urlPath, payload) {
    return axios
      .put(urlPath, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  getById: function (urlPath) {
    return axios
      .get(urlPath)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  delete: function (urlPath) {
    return axios
      .delete(urlPath)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  getAllPatch: function (urlPath, filter) {
    return axios
      .patch(urlPath, filter)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  export: function (urlPath, filter) {
    const headers = {
        responseType: 'arraybuffer',
      }
    return axios
      .post(urlPath, filter, headers)
      .then((resp) => resp)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },
};

export default Master;
