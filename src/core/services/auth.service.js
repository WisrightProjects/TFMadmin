import { localStorage, utils } from 'core/helper';
import axios from '../config/axios';
import { FORGOT_URL, IS_VALID, LOGIN_URL, RESET_URL, USERS_URL, VIEW_USER } from '../services/apiURL.service';

const Users = {
    login: function ({ email, pwd }) {
        return axios.post(LOGIN_URL, { email, pwd })
            .then((data) => {
                data = utils.handleSuccess(data);
                localStorage.setAuthToken(data.token);
                return data;
            })
            .catch(error => utils.showErrMsg(utils.handleErr(error)));
    },
    forgotPassword: function (payload) {
        return axios.post(FORGOT_URL, payload).then((data) => {
            return data;
        }).catch(error => {
            let msg = utils.handleErr(error);
            utils.showErrMsg(msg);
        })
    },
    resetPassword: function (payload) {
        return axios.post(RESET_URL, payload).then((data) => {
            return data;
        }).catch(error => {
            let msg = utils.handleErr(error);
            utils.showErrMsg(msg);
        })
    },
    users: function (filter) {
        Object.keys(filter).forEach((f) => filter[f] === "" && delete filter[f]);
        const filterString = new URLSearchParams(filter).toString()
        return axios.get(USERS_URL + '?' + filterString).then((data) => {
            return data;
        }).catch(error => {
            let msg = utils.handleErr(error);
            utils.showErrMsg(msg);
        })
    },
    getuser: function (userId) {
        return axios.get(VIEW_USER + userId).then((resp) => {
            return resp.data
        }).catch(error => {
            let msg = utils.handleErr(error);
            utils.showErrMsg(msg);
        })
    },

    isValid: function (payload) {
        return axios.post(IS_VALID, payload)
            .then((resp) => resp.data)
            .catch(err => utils.showErrMsg(utils.handleErr(err)));
    },
};

export default Users;