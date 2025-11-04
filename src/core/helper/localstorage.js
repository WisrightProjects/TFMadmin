export const getAuthRefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken ? refreshToken : ''
};

export const setAuthRefreshToken = (refreshToken) => {
    return localStorage.setItem('refreshToken', refreshToken);
};

export const removeAuthRefreshToken = () => {
    return localStorage.removeItem('refreshToken')
};

export const setAuthToken = (token) => {
    return localStorage.setItem('token', token)
};

export const getAuthToken = () => {
    const token = localStorage.getItem('token')
    return token ? token : ''
};

export const setAuthUser = (user) => {
    setAuthToken(user.token);
    setAuthRefreshToken(user.refreshToken);
    return localStorage.setItem('user', JSON.stringify(user))
};

export const getAuthUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const removeAuthToken = () => {
    return localStorage.removeItem('token');
};

export const removeAuthUser = () => {
    removeAuthToken();
    removeAuthRefreshToken();
    return localStorage.removeItem('user');
};

export const setCommonData = (commonData) => {
    return localStorage.setItem("commonData", JSON.stringify(commonData));
};

export const getCommonData = () => {
    return JSON.parse(localStorage.getItem("commonData"));
};

export const getCommonDataByKey = (key) => {
    const data = JSON.parse(localStorage.getItem("commonData"));
    return data && data[key] ? data[key] : false;
};

export const setProfileID = (profileID) => {
    return localStorage.setItem("profileID", JSON.stringify(profileID));
};

export const getProfileID = () => {
    return JSON.parse(localStorage.getItem("profileID"));
};

export const removeProfileID = () => {
    return localStorage.removeItem("profileID")
};