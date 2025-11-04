import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { Trans } from "react-i18next";
import Face1 from "../../pages/assets/images/Profile-img.svg";
import * as RouteConst from "../routes/routes";
import { connect } from "react-redux";

const Sidebar = (props) => {
  const { toggle, user } = props;

  const [openMenu, setOpenMenu] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const handleMenuOpen = (val) => setOpenMenu(openMenu === val ? "" : val);

  useEffect(() => {
    setIsStaff(user.role === 20 ? true : false);
  }, [user]);

  const [profileHover, setProfileHover] = useState(false);
  const [staffHover, setStaffHover] = useState(false);
  const [planHover, setPlanHover] = useState(false);
  const [paymentHover, setPaymentHover] = useState(false);
  const [masterHover, setMasterHover] = useState(false);
  const [commonHover, setCommonHover] = useState(false);

  const handleProfileHover = () => setProfileHover(!profileHover);
  const handleStaffHover = () => setStaffHover(!staffHover);
  const handlePlanHover = () => setPlanHover(!planHover);
  const handlePaymentHover = () => setPaymentHover(!paymentHover);
  const handleMasterHover = () => setMasterHover(!masterHover);
  const handleCommonHover = () => setCommonHover(!commonHover);

  return (
    <nav
      className={
        toggle
          ? "sidebar sidebar-offcanvas active"
          : "sidebar sidebar-offcanvas sample"
      }
      id="sidebar"
    >
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a
            href="!#"
            className="nav-link"
            onClick={(evt) => evt.preventDefault()}
          >
            <div className="nav-profile-image">
              <img src={Face1} alt="profile" />
              <span className="login-status online"></span>{" "}
              {/* change to offline or busy as needed */}
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">
                <Trans>{user ? user.name : "User"}</Trans>
              </span>
              <span className="text-secondary text-small">
                <Trans>{user?.email}</Trans>
              </span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        {user.role === 10 && (
        <li className="nav-item">
          <Link className="nav-link" to={RouteConst.DASH_PATH}>
            <span className="menu-title">
              <Trans>Dashboard</Trans>
            </span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        )}
        <li
          onMouseEnter={handleProfileHover}
          onMouseLeave={() => setProfileHover(false)}
          className={`nav-item ${profileHover && "hover-open"}`}
        >
          <div
            className={
              openMenu === "profile" ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => handleMenuOpen("profile")}
            data-toggle="collapse"
          >
            <span className="menu-title">
              <Trans>Profiles</Trans>
            </span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-account menu-icon"></i>
          </div>
          <Collapse in={openMenu === "profile"}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to={RouteConst.PROFILES_PATH}>
                  <Trans>List</Trans>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className={"nav-link"} to={RouteConst.ADD_PROFILE}>
                  <Trans>Add Profile</Trans>
                </Link>
              </li> */}
              <li className="nav-item">
                <Link className={"nav-link"} to={RouteConst.DEL_REQ_PATH}>
                  <Trans>Delete Request</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={RouteConst.OLD_SITE_USERS_PATH}>
                  <Trans>Old Users</Trans>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to={RouteConst.IMAGE_APPROVALS_PATH}>
                  <Trans>Image Approval</Trans>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className={'nav-link'} to={RouteConst.USER_IMAGE_APPROVAL_PATH}><Trans>Image Approval</Trans></Link>
              </li> */}
            </ul>
          </Collapse>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link" to={"#"}>
            <span className="menu-title">
              <Trans>Image Approval</Trans>
            </span>
            <svg
              width={20}
              height={20}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#bba8bff5"
              className="ml-auto"
            >
              <path d="M12.18 17C12.54 15.5 13.43 14.16 14.68 13.25L13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H12.18M5 5V19H12.03C12.09 19.7 12.24 20.38 12.5 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 3.9 3.9 3 5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V12.5C20.38 12.24 19.7 12.09 19 12.03V5H5M17.75 22L15 19L16.16 17.84L17.75 19.43L21.34 15.84L22.5 17.25L17.75 22Z" />
            </svg>
          </Link>
        </li> */}
        {!isStaff && (
          <li
            onMouseEnter={handleStaffHover}
            onMouseLeave={() => setStaffHover(false)}
            className={`nav-item ${staffHover && "hover-open"}`}
          >
            <div
              className={
                openMenu === "staff" ? "nav-link menu-expanded" : "nav-link"
              }
              onClick={() => handleMenuOpen("staff")}
              data-toggle="collapse"
            >
              <span className="menu-title">
                <Trans>Staffs</Trans>
              </span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-account-star menu-icon"></i>
            </div>
            <Collapse in={openMenu === "staff"}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to={RouteConst.STAFF_PATH}>
                    <Trans>List</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={"nav-link"} to={RouteConst.ADD_STAFF}>
                    <Trans>Add Staff</Trans>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        <li
          onMouseEnter={handlePlanHover}
          onMouseLeave={() => setPlanHover(false)}
          className={`nav-item ${planHover && "hover-open"}`}
        >
          <div
            className={
              openMenu === "plans" ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => handleMenuOpen("plans")}
            data-toggle="collapse"
          >
            <span className="menu-title">
              <Trans>Plans</Trans>
            </span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-timeline-text-outline menu-icon"></i>
          </div>
          <Collapse in={openMenu === "plans"}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to={RouteConst.PLAN_PATH}>
                  <Trans>List</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={"nav-link"} to={RouteConst.ADD_PLAN}>
                  <Trans>Add Plan</Trans>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className={"nav-link"} to={RouteConst.PLAN_REQ_PATH}>
                  <Trans>Plan Request</Trans>
                </Link>
              </li> */}
            </ul>
          </Collapse>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={RouteConst.BRANCHS_PATH}>
            <span className="menu-title">
              <Trans>Branches</Trans>
            </span>
            <i className="mdi mdi-source-branch menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={RouteConst.COUPON_PATH}>
            <span className="menu-title">
              <Trans>Coupon</Trans>
            </span>
            <i className="mdi mdi-ticket-percent menu-icon"></i>
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link" to={RouteConst.OLD_SITE_USERS_PATH}>
            <span className="menu-title">
              <Trans>Old Site Users</Trans>
            </span>
            <i className="mdi mdi-account-group menu-icon"></i>
          </Link>
        </li> */}
        <li
          onMouseEnter={handlePaymentHover}
          onMouseLeave={() => setPaymentHover(false)}
          className={`nav-item ${paymentHover && "hover-open"}`}
        >
          <div
            className={
              openMenu === "payments" ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => handleMenuOpen("payments")}
            data-toggle="collapse"
          >
            <span className="menu-title">
              <Trans>Payments</Trans>
            </span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-credit-card-outline menu-icon"></i>
          </div>
          {/* <Link className="nav-link" to={RouteConst.PAYMENTS_PATH}>
            <span className="menu-title">
              <Trans>Payments</Trans>
            </span>
            <i className="mdi mdi-credit-card-outline menu-icon"></i>
          </Link> */}
          <Collapse in={openMenu === "payments"}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.PAYMENTS_PATH}>
                  <Trans>Payments</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.OLD_PAYMENTS_PATH}>
                  <Trans>Previous Payments</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li
          onMouseEnter={handleMasterHover}
          onMouseLeave={() => setMasterHover(false)}
          className={`nav-item ${masterHover && "hover-open"}`}
        >
          <div
            className={
              openMenu === "master" ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => handleMenuOpen("master")}
            data-toggle="collapse"
          >
            <span className="menu-title">
              <Trans>Master</Trans>
            </span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-home-account menu-icon"></i>
          </div>
          {/* <div
            className={openMenu === 'locations' ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => handleMenuOpen('locations')} data-toggle="collapse">
            <span className="menu-title"><Trans>Locations</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-library menu-icon"></i>
          </div> */}
          <Collapse in={openMenu === "master"}>
            <ul className="nav flex-column sub-menu">
              {/* <li onClick={() => handleMenuOpen('locations')} data-toggle="collapse" className={openMenu === 'locations' ? 'nav-link menu-expanded' : 'nav-link nav-item'}> 
                <Link className='nav-link' to={"#"}><Trans>Locations</Trans></Link>
              </li> */}
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.LANGUAGE_PATH}>
                  <Trans>Language</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.COMPANY_PATH}>
                  <Trans>Company</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.COMMUNITY_PATH}>
                  <Trans>Community</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.RELIGION_PATH}>
                  <Trans>Religion</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.PROFESSION_PATH}>
                  <Trans>Profession</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.DEGREE_PATH}>
                  <Trans>Degree</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.COLLEGE_PATH}>
                  <Trans>College</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.COUNTRIES_PATH}>
                  <Trans>Country</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.STATES_PATH}>
                  <Trans>State</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className={"nav-link"} to={RouteConst.CITIES_PATH}>
                  <Trans>City</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li
          onMouseEnter={handleCommonHover}
          onMouseLeave={() => setCommonHover(false)}
          className={`nav-item ${commonHover && "hover-open"}`}
        >
          <div
            className={
              openMenu === "common" ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => handleMenuOpen("common")}
            data-toggle="collapse"
          >
            <span className="menu-title">
              <Trans>Common</Trans>
            </span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-crosshairs-gps menu-icon"></i>
          </div>
          <Collapse in={openMenu === "common"}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.BLOG_PATH}>
                  <Trans>Blog</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.FAQ_PATH}>
                  <Trans>FAQ</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.SUCCESS_STORIES_PATH}>
                  <Trans>Success Stories</Trans>
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link className="nav-link" to={RouteConst.CONTACT_US_PATH}>
                  <Trans>Contact Us</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        {!isStaff && (
          <li className="nav-item">
            <Link className="nav-link" to={RouteConst.REPORTS_PATH}>
              <span className="menu-title">
                <Trans>Reports</Trans>
              </span>
              <i className="mdi mdi-file-certificate-outline menu-icon"></i>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    toggle: state?.common?.isSidebarOpen,
    user: state?.account?.authUser,
  };
};

export default connect(mapStateToProps, null)(Sidebar);
