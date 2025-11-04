import { utils } from "core/helper";
import axios from "../config/axios";
import {
  BLOG_CREATE,
  BLOG_DELETE,
  BLOG_FILTER,
  BLOG_GET_BY_ID,
  BLOG_UPDATE,
  COMMON_DATA,
  CONTACT_US_DELETE,
  CONTACT_US_FILTER,
  CONTACT_US_GET_BY_ID,
  CONTACT_US_UPDATE,
  FAQ_CREATE,
  FAQ_DELETE,
  FAQ_FILTER,
  FAQ_GET_BY_ID,
  FAQ_UPDATE,
  PROFILE_IMAGE_UPLOAD,
  SETTINGS_PATH,
  SUCCESS_STORY_GET,
  UPLOAD_IMAGES,
} from "./apiURL.service";

const Common = {
  getAll: function (urlPath, filter = null) {
    if (filter) {
      Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
      const filterString = new URLSearchParams(filter).toString();
      urlPath = urlPath + "?" + filterString;
    }
    return axios
      .get(urlPath)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  create: function (urlPath, payload) {
    return axios
      .post(urlPath, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  //previously it is get api now changed to post. places used plan and branch
  filter: function (urlPath, filter = null) {
    // if (filter) {
    //   Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
    //   const filterString = new URLSearchParams(filter).toString();
    //   urlPath = urlPath + "?" + filterString;
    // }
    return axios
      .post(urlPath, filter)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  couponFilter: function (urlPath, payload) {
    return axios
      .post(urlPath, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  profileFilter: function (urlPath, payload) {
    // Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
    // const filterString = new URLSearchParams(filter).toString();
    return axios
      .post(urlPath, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  inActiveUsers: function (urlPath) {
    return axios
      .get(urlPath)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  loadStaff: function (urlPath, payload) {
    return axios
      .post(urlPath, payload)
      .then((resp) => resp.data)
      .catch((error) => utils.showErrMsg(utils.handleErr(error)));
  },

  loadBranch: function (urlPath, filter) {
    return axios
      .post(urlPath, filter)
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

  getAllCommonData: function () {
    return axios
      .get(COMMON_DATA)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  getAllBlog: function (filter) {
    Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(BLOG_FILTER + "?" + filterString)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  createBlog: function (payload) {
    return axios
      .post(BLOG_CREATE, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  updateBlog: function (blogId, payload) {
    return axios
      .put(BLOG_UPDATE + blogId, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  getBlog: function (blogId) {
    return axios
      .get(BLOG_GET_BY_ID + blogId)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  deleteBlog: function (blogId) {
    return axios
      .delete(BLOG_DELETE + blogId)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  getAllFaq: function (filter) {
    Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(FAQ_FILTER + "?" + filterString)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  createFaq: function (payload) {
    return axios
      .post(FAQ_CREATE, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  updateFaq: function (faqId, payload) {
    return axios
      .put(FAQ_UPDATE + faqId, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  getFaq: function (faqId) {
    return axios
      .get(FAQ_GET_BY_ID + faqId)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  deleteFaq: function (faqId) {
    return axios
      .delete(FAQ_DELETE + faqId)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  getAllContactUs: function (filter) {
    Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
    const filterString = new URLSearchParams(filter).toString();
    return axios
      .get(CONTACT_US_FILTER + "?" + filterString)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  getContactUs: function (contactId) {
    return axios
      .get(CONTACT_US_GET_BY_ID + contactId)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  updateContactus: function (contactId, payload) {
    return axios
      .put(CONTACT_US_UPDATE + contactId, payload)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  deleteContactUs: function (contactId) {
    return axios
      .delete(CONTACT_US_DELETE + contactId)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },

  getSetting: function () {
    return axios
      .get(SETTINGS_PATH)
      .then((resp) => {
        return resp.data;
      })
      .catch((error) => {
        let msg = utils.handleErr(error);
        utils.showErrMsg(msg);
      });
  },
  imageUpload: function (formData) {
    const headers = { "Content-Type": "multipart/form-data", "accept": "*/*" };
    return axios.post(UPLOAD_IMAGES, formData, headers)
      .then((resp) => resp.data)
      .catch(err => utils.showErrMsg(utils.handleErr(err)));
  },
  
  profileImageUpload: function (formData) {
    const headers = { "Content-Type": "multipart/form-data", "accept": "*/*" };
    return axios.post(PROFILE_IMAGE_UPLOAD, formData, headers)
      .then((resp) => resp.data)
      .catch(err => utils.showErrMsg(utils.handleErr(err)));
  },

  getSuccessStory: function(successStroyId){
    return axios
    .get(SUCCESS_STORY_GET + "/" + successStroyId)
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      let msg = utils.handleErr(error);
      utils.showErrMsg(msg);
    });
  }
};

export default Common;
