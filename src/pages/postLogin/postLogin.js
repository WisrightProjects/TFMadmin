import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../shared/Spinner";

import * as RouteConst from "../routes/routes";

import ProtectedRoute from "../routes/ProtectedRoute";

import Dashboard from "../dashboard";
import { connect } from "react-redux";
import { commonService } from "core/services";
import { localStorage } from "core/helper";
import { setCommonDataAction, setSiteSettingsAction } from "redux/action";

const Settings = lazy(() => import("../settings"));
const Profile = lazy(() => import("../profile"));
const Reports = lazy(() => import("../reports"));
const Notifications = lazy(() => import("../notifications"));

const Languages = lazy(() => import("../master/language"));
const Community = lazy(() => import("../master/community"));
const Company = lazy(() => import("../master/company"));
const Religion = lazy(() => import("../master/religion"));
const Profession = lazy(() => import("../master/profession"));
const Degree = lazy(() => import("../master/degree"));
const Collage = lazy(() => import("../master/collage"));
const Country = lazy(() => import("../master/locations/country"));
const States = lazy(() => import("../master/locations/state"));
const Cities = lazy(() => import("../master/locations/city"));

const Blog = lazy(() => import("../common/blog"));
const FAQ = lazy(() => import("../common/faq"));
const SuccessStories = lazy(() => import("../common/success-story"));
const ContactUs = lazy(() => import("../common/contact-us"));

const Profiles = lazy(() => import("../profiles"));
const ViewProfile = lazy(() => import("../profiles/view-profile"));
const AddProfile = lazy(() => import("../profiles/add-profile-2"));
const DeleteRequest = lazy(() => import("../profiles/delete-request"));
// const InActiveUsers = lazy(() => import("../profiles/inactive-users"));
const ImageApproval = lazy(() => import("../profiles/image-approval"));

const Staffs = lazy(() => import("../staffs"));
const AddStaff = lazy(() => import("../staffs/add-staff"));

const Plans = lazy(() => import("../plans"));
const ViewPlan = lazy(() => import("../plans/view-plan"));
const AddPlan = lazy(() => import("../plans/add-plan"));
// const PlanRequest = lazy(() => import("../plans/plan-request"));

const Branchs = lazy(() => import("../branchs"));
const AddBranch = lazy(() => import("../branchs/add-branch"));

const Coupon = lazy(() => import("../coupon"));
const Payments = lazy(() => import("../payments"));
const OldPayments = lazy(() => import("../payments/old-payments"));

const OldSiteUsers = lazy(() => import("../old-users"));
const ViewOldSiteUser = lazy(() => import("../old-users/view-user"));

// const ImageApprovals = lazy(() => import("../image-approval"));

const PostLogin = (props) => {
  const { token, setCommonDataAction, setSiteSettingsAction } = props;

  useEffect(() => {
    async function loadCommonData() {
      if (token) {
        const resp = await commonService.getAllCommonData();
        if (resp && resp.meta.code === 200) {
          localStorage.setCommonData(resp.data);
          setCommonDataAction(resp.data.masterData);
          setSiteSettingsAction(resp.data.settings);
        }
      }
    }

    loadCommonData();
  }, [token]);

  return (
    <ProtectedRoute>
      <Suspense fallback={<Spinner />}>
        <Routes>
        <Route path={RouteConst.BASE_PATH} element={<Profiles />} />
          <Route path={RouteConst.DASH_PATH} element={<Dashboard />} />
          {/* <Route path={RouteConst.IMAGE_APPROVALS_PATH} element={<ImageApprovals />} /> */}
          <Route path={RouteConst.PROFILE_PATH} element={<Profile />} />

          <Route path={RouteConst.SETTINGS_PATH} element={<Settings />} />
          <Route path={RouteConst.REPORTS_PATH} element={<Reports />} />

          <Route path={RouteConst.PROFILES_PATH} element={<Profiles />} />
          {/* <Route path={RouteConst.ADD_PROFILE} element={<AddProfile />} />
          <Route
            path={RouteConst.EDIT_PROFILE_BY_ID}
            element={<AddProfile />}
          />
          <Route
            path={RouteConst.PROFILE_IMAGE_APPROVAL_PATH}
            element={<AddProfile />}
          /> */}

          <Route path={RouteConst.ADD_PROFILE} element={<AddProfile />} />
          <Route
            path={RouteConst.EDIT_PROFILE_BY_ID}
            element={<AddProfile />}
          />
          <Route
            path={RouteConst.PROFILE_IMAGE_APPROVAL_PATH}
            element={<AddProfile />}
          />

          <Route
            path={RouteConst.VIEW_PROFILE_BY_ID}
            element={<ViewProfile />}
          />
          {/* <Route path={RouteConst.INACTIVE_USERS} element={<InActiveUsers />} /> */}
          <Route path={RouteConst.DEL_REQ_PATH} element={<DeleteRequest />} />
          <Route
            path={RouteConst.USER_IMAGE_APPROVAL_PATH}
            element={<ImageApproval />}
          />

          <Route path={RouteConst.STAFF_PATH} element={<Staffs />} />
          <Route path={RouteConst.ADD_STAFF} element={<AddStaff />} />
          <Route path={RouteConst.EDIT_STAFF_BY_ID} element={<AddStaff />} />

          <Route path={RouteConst.PLAN_PATH} element={<Plans />} />
          <Route path={RouteConst.ADD_PLAN} element={<AddPlan />} />
          <Route path={RouteConst.EDIT_PLAN_BY_ID} element={<AddPlan />} />
          <Route path={RouteConst.VIEW_PLAN_BY_ID} element={<ViewPlan />} />
          {/* <Route path={RouteConst.PLAN_REQ_PATH} element={<PlanRequest />} /> */}

          <Route path={RouteConst.BRANCHS_PATH} element={<Branchs />} />
          <Route path={RouteConst.ADD_BRANCH} element={<AddBranch />} />
          <Route path={RouteConst.EDIT_BRANCH_BY_ID} element={<AddBranch />} />

          <Route path={RouteConst.COUPON_PATH} element={<Coupon />} />
          <Route path={RouteConst.PAYMENTS_PATH} element={<Payments />} />
          <Route
            path={RouteConst.OLD_PAYMENTS_PATH}
            element={<OldPayments />}
          />
          <Route
            path={RouteConst.OLD_SITE_USERS_PATH}
            element={<OldSiteUsers />}
          />
          <Route
            path={RouteConst.OLD_SITE_USERS_PATH_BY_ID_PATH}
            element={<ViewOldSiteUser />}
          />
          <Route path={RouteConst.LANGUAGE_PATH} element={<Languages />} />
          <Route path={RouteConst.COMMUNITY_PATH} element={<Community />} />
          <Route path={RouteConst.COMPANY_PATH} element={<Company />} />
          <Route path={RouteConst.RELIGION_PATH} element={<Religion />} />
          <Route path={RouteConst.PROFESSION_PATH} element={<Profession />} />
          <Route path={RouteConst.DEGREE_PATH} element={<Degree />} />
          <Route path={RouteConst.COLLEGE_PATH} element={<Collage />} />
          <Route path={RouteConst.COUNTRIES_PATH} element={<Country />} />
          <Route path={RouteConst.STATES_PATH} element={<States />} />
          <Route path={RouteConst.CITIES_PATH} element={<Cities />} />

          <Route path={RouteConst.BLOG_PATH} element={<Blog />} />
          <Route path={RouteConst.FAQ_PATH} element={<FAQ />} />
          <Route
            path={RouteConst.SUCCESS_STORIES_PATH}
            element={<SuccessStories />}
          />
          <Route path={RouteConst.CONTACT_US_PATH} element={<ContactUs />} />
          <Route
            path={RouteConst.NOTIFICATION_PATH}
            element={<Notifications />}
          />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.account?.token,
  };
};

const mapDispatchToProps = {
  setCommonDataAction,
  setSiteSettingsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostLogin);
