import { toast } from "react-toastify";
import moment from "moment";

export const handleErr = (err) => {
  const resMessage =
    err?.response?.data?.meta?.message || err?.message || err.toString();
  return resMessage;
};

export const handleSuccess = (data) => {
  return data?.data?.data;
};

export const showSuccessMsg = (msg) => {
  toast.success(msg, { autoClose: 2000 });
};

export const showErrMsg = (msg) => {
  toast.error(msg, { autoClose: 2000 });
};

export const navigateTo = (navigate, path) => {
  setTimeout(() => {
    navigate(path);
  }, 400);
};

export const formatDate = (value) => {
  return moment(value).format("YYYY-MM-DD");
};

export const minYear = moment("1904-01-01").format("YYYY-MM-DD");
export const maxYear = moment().subtract(18, "year").format("YYYY-MM-DD");
export const getFirstCaps = (str) =>
  str?.charAt(0).toUpperCase() + str?.slice(1);
