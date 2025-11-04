export const BASE_PATH = "";

export const PRE_LOGIN_PATH = `${BASE_PATH}/`;
export const POST_LOGIN_PATH = `${BASE_PATH}/`;

export const LOGIN_PATH = `${BASE_PATH}/login`;
export const FORGOT_PATH = `${BASE_PATH}/forgot-password`;

export const CHANGE_FORGOT_PATH = `${BASE_PATH}/reset-password`;

export const DASH_PATH = `${BASE_PATH}/dashboard`;
export const PROFILE_PATH = `${BASE_PATH}/profile`;
export const SETTINGS_PATH = `${BASE_PATH}/settings`;
export const REPORTS_PATH = `${BASE_PATH}/reports`;

// export const IMAGE_APPROVALS_PATH = `${BASE_PATH}/image-approval`;
export const VIEW_IMAGE_APPROVAL = `${BASE_PATH}/image-approval/:profileID`;

export const BRANCHS_PATH = `${BASE_PATH}/branchs`;
export const ADD_BRANCH = `${BRANCHS_PATH}/add-branch`;
export const EDIT_BRANCH = `${BRANCHS_PATH}/edit-branch`;
export const EDIT_BRANCH_BY_ID = `${EDIT_BRANCH}/:branchId`;
export const VIEW_BRANCH = `${BRANCHS_PATH}/view-branch`;
export const VIEW_BRANCH_BY_ID_PATH = `${BRANCHS_PATH}/view-branch/:branchId`;

export const NOTIFICATION_PATH = `${BASE_PATH}/notifications`;

export const PROFILES_PATH = `${BASE_PATH}/profiles`;
export const ADD_PROFILE = `${PROFILES_PATH}/add-profile`;
export const EDIT_PROFILE = `${PROFILES_PATH}/edit-profile`;
export const EDIT_PROFILE_BY_ID = `${EDIT_PROFILE}/:profileID`;
export const VIEW_PROFILE = `${PROFILES_PATH}/view-profile`;
export const VIEW_PROFILE_BY_ID = `${VIEW_PROFILE}/:profileID`;
export const USER_IMAGE_APPROVAL_PATH = `${PROFILES_PATH}/image-approval`;
export const DEL_REQ_PATH = `${PROFILES_PATH}/delete-request`;
export const INACTIVE_USERS = `${PROFILES_PATH}/inactive-users`;
export const PROFILE_IMAGE_APPROVAL_PATH = `${EDIT_PROFILE_BY_ID}/:photos`;

export const STAFF_PATH = `${BASE_PATH}/staffs`;
export const ADD_STAFF = `${STAFF_PATH}/add-staff`;
export const EDIT_STAFF = `${STAFF_PATH}/edit-staff`;
export const EDIT_STAFF_BY_ID = `${EDIT_STAFF}/:staffId`;
export const VIEW_STAFF = `${STAFF_PATH}/view-staff`;
export const VIEW_STAFF_BY_ID = `${VIEW_STAFF}/:staffId`;

export const PLAN_PATH = `${BASE_PATH}/plans`;
export const ADD_PLAN = `${PLAN_PATH}/add-plan`;
export const EDIT_PLAN = `${PLAN_PATH}/edit-plan`;
export const EDIT_PLAN_BY_ID = `${EDIT_PLAN}/:_id`;
export const VIEW_PLAN = `${PLAN_PATH}/view-plan`;
export const VIEW_PLAN_BY_ID = `${VIEW_PLAN}/:_id`;
export const PLAN_REQ_PATH = `${PLAN_PATH}/plan-request`;

export const LANGUAGE_PATH = `${BASE_PATH}/language`;
export const COMMUNITY_PATH = `${BASE_PATH}/community`;
export const COMPANY_PATH = `${BASE_PATH}/company`;
export const RELIGION_PATH = `${BASE_PATH}/religion`;
export const PROFESSION_PATH = `${BASE_PATH}/profession`;
export const DEGREE_PATH = `${BASE_PATH}/degree`;
export const COLLEGE_PATH = `${BASE_PATH}/college`;

export const COUNTRIES_PATH = `${BASE_PATH}/countries`;
export const STATES_PATH = `${BASE_PATH}/states`;
export const CITIES_PATH = `${BASE_PATH}/cities`;

export const BLOG_PATH = `${BASE_PATH}/blog`;
export const CONTACT_US_PATH = `${BASE_PATH}/contact-us`;
export const FAQ_PATH = `${BASE_PATH}/faq`;
export const SUCCESS_STORIES_PATH = `${BASE_PATH}/success-stories`;

export const COUPON_PATH = `${BASE_PATH}/coupon`;
export const PAYMENTS_PATH = `${BASE_PATH}/payments`;
export const OLD_PAYMENTS_PATH = `${BASE_PATH}/old-payments`;

export const OLD_SITE_USERS_PATH = `${PROFILES_PATH}/old-users`;
export const OLD_SITE_USERS_PATH_BY_ID = `${OLD_SITE_USERS_PATH}/view-old-user`;
export const OLD_SITE_USERS_PATH_BY_ID_PATH = `${OLD_SITE_USERS_PATH_BY_ID}/:_id`;
export const CRON_PATH = `${process.env.REACT_APP_API_URL}master/runCronJobs`;

export const UNKNOWN_PATH = `*`;
