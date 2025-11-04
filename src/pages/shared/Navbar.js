import React, { Fragment, useEffect, useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Trans } from "react-i18next";
import Logo from "../../pages/assets/images/logo-img.png";
import ProfileImg from "../../pages/assets/images/Profile-img.svg";
import LogoMini from "../assets/images/mini-logo.png";
import { connect, useSelector } from "react-redux";
import {
  loginAction,
  logoutAction,
  toggleAction,
  updateLoginAction,
} from "redux/action";
import { CONST, utils } from "core/helper";
import { LOGIN_PATH } from "pages/routes/routes";
import * as RouteConst from "../routes/routes";
import { masterService } from "core/services";
import {
  NOTIFICATION_FILTER,
  UPDATE_NOTIFICATION,
} from "core/services/apiURL.service";
import { reloadProfileAction } from "redux/action/account.action";

const Navbar = (props) => {
  const { logoutAction, toggleAction, user, reloadProfileAction } = props;
  const superAdminRole = 10;
  const commonData = useSelector((state) => state?.common?.commonData);
  const reload = useSelector((state) => state.common?.reload);
  const navigate = useNavigate();
  const [filter] = useState({ ...CONST.DEFAULT_FILTER, isRead: false });
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    logoutAction();
    utils.showSuccessMsg("logout successfully");
    utils.navigateTo(navigate,LOGIN_PATH);
  };

  const getNotifications = async (filter) => {
    const resp = await masterService.getAll(NOTIFICATION_FILTER, filter);
    if (resp && resp?.meta?.code === 200) {
      setNotifications(resp?.data);
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    if (isComponentMounted) {
      getNotifications(filter);
    }
  }, [isComponentMounted, filter, reload]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const updateNoification = async (id) => {
    const resp = await masterService.getAllPatch(UPDATE_NOTIFICATION + id);
    if (resp && resp?.meta?.code === 200) {
      reloadProfileAction(!reload);
      return true;
    }
    return;
  };

  const getCommonDataVal = (key, val) => {
    const data = commonData[key]?.find((ele) => ele.code === val);
    return data ? data?.label : "";
  };

  const handleUpdateNotification = (ele) => {
    console.log("ele:;", ele);
    const { notificationType } = ele;
    switch (notificationType) {
      case 100:
        updateNoification(ele._id);
        navigate(RouteConst.CONTACT_US_PATH);
        break;
      case 110:
        updateNoification(ele._id);
        navigate(RouteConst.PROFILES_PATH);
        break;
      case 120:
        updateNoification(ele._id);
        navigate(RouteConst.DEL_REQ_PATH);
      case 130:
        updateNoification(ele._id);
        navigate(
          RouteConst.EDIT_PROFILE +
            "/" +
            ele.fromProfile?.profileID +
            "?key=photos"
        );
        break;
      default:
        navigate(RouteConst.DASH_PATH);
    }
  };

  const notificationType = (ele) => {
    switch (ele?.notificationType) {
      case 100:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-success">
                <i className="mdi mdi-account-box"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Contacts Query</Trans>
              </h6>
              <p className="text-gray  text-wrap ellipsis mb-0">
                <span className="text-dark text-capitalize">
                  {ele?.senderEmail ? ele?.senderEmail : ele?.fromUserObj?.name}
                </span>{" "}
                &nbsp; Request contact raised
              </p>
            </div>
          </Fragment>
        );
      case 110:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-primary">
                <i className="mdi mdi-account-check"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Profile Completed</Trans>
              </h6>
              <p className="text-gray  text-wrap ellipsis mb-0">
                <span className="text-dark text-capitalize">
                  {" "}
                  {ele?.fromUserObj?.name}
                </span>
                &nbsp; profile was completed
              </p>
            </div>
          </Fragment>
        );
      case 120:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-danger">
                <i className="mdi mdi-delete"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Profile Delete Request</Trans>
              </h6>
              <p className="text-gray text-wrap ellipsis mb-0 d-flex">
                <span className="text-dark text-capitalize">
                  {ele?.fromUserObj?.name}
                </span>{" "}
                &nbsp;Profile delete request raised...
              </p>
            </div>
          </Fragment>
        );
      case 130:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-success">
                <i className="mdi mdi-image-area"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Photo waiting for approval</Trans>
              </h6>
              <p className="text-gray text-wrap ellipsis mb-0 d-flex">
                <span className="text-dark text-capitalize">
                  {ele?.fromUserObj?.name}
                </span>{" "}
                &nbsp;Photo uploaded
              </p>
            </div>
          </Fragment>
        );
      default:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-success notify_list_type">
                <i className="mdi mdi-account-box"></i>
              </div>
            </div>
            <div className="preview-item-content align-items-start flex-column  mx-3">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Message Title</Trans>
              </h6>
              <p className="text-gray ellipsis mb-0 d-flex">
                <Trans>{ele?.fromUserObj?.name}</Trans>
              </p>
            </div>
          </Fragment>
        );
    }
  };

  const getSpiltNotification = (ele) => notificationType(ele);

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo " to="/profiles">
          {" "}
          <img className="h-auto" src={Logo} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/profiles">
          <a href="#" className="logo-mini-wrapper">
            <img src={LogoMini} alt="logo" />
          </a>
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={() => document.body.classList.toggle("sidebar-icon-only")}
        >
          <span className="mdi mdi-menu"></span>
        </button>
        
        <ul className="navbar-nav navbar-nav-right">
        {user.role === superAdminRole && (
          <li className="nav-item nav-cron">
            <Trans>
            <Link to={RouteConst.CRON_PATH}
              onClick={(e) => {
                e.preventDefault();
                window.open(RouteConst.CRON_PATH, "_blank");
              }}>Run Cron</Link>
            </Trans>
          </li>
          )}
          <li className="nav-item nav-profile">
            <Dropdown>
              <Dropdown.Toggle className="nav-link">
                <div className="nav-profile-img">
                  <img src={ProfileImg} alt="user" />
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">
                    <Trans>{user ? user.name : "User"}</Trans>
                  </p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown">
                <Dropdown.Item href="!#">
                  <i className="mdi mdi-account mr-2 text-success"></i>
                  <Trans>
                    <Link to={RouteConst.PROFILE_PATH}>Profile</Link>
                  </Trans>
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="mdi mdi-settings mr-2 text-primary"></i>
                  <Trans>
                    <Link to={RouteConst.SETTINGS_PATH}>Settings</Link>
                  </Trans>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <Dropdown as={"li"} className="nav-item">
            <Dropdown.Toggle as={"a"} className="nav-link count-indicator">
              <i className="mdi mdi-bell-outline"></i>
              {notifications && notifications.length > 0 && (
                <span className="count-symbol bg-danger"></span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-right navbar-dropdown preview-list">
              <h6 className="p-3 mb-0">
                <Trans>Notifications</Trans>
              </h6>
              {notifications?.slice(0, 4)?.map((ele, ind) => {
                return (
                  <Fragment key={ind}>
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item
                      className="dropdown-item preview-item px-2 py-0"
                      onClick={() => handleUpdateNotification(ele)}
                    >
                      {getSpiltNotification(ele)}
                    </Dropdown.Item>
                  </Fragment>
                );
              })}
              <Dropdown.Item>
                {notifications && notifications.length > 0 && (
                  <Fragment>
                    <div className="dropdown-divider"></div>
                    <h6 className="p-3 mb-0 d-flex m-auto text-center justify-content-center cursor-pointer">
                      <Link to={RouteConst.NOTIFICATION_PATH}>
                        <Trans>See all notifications</Trans>
                      </Link>
                    </h6>
                  </Fragment>
                )}
              </Dropdown.Item>
              {notifications && notifications.length === 0 && (
                <Fragment>
                  <div className="dropdown-divider"></div>
                  <h6 className="p-3 mb-0 text-center m-auto cursor-pointer text-nowrap empty_notification">
                    <Trans>No new notifications</Trans>
                  </h6>
                </Fragment>
              )}
            </Dropdown.Menu>
          </Dropdown>
          {/* </li> */}
          <li className="nav-item nav-logout d-none d-lg-block">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Logout</Tooltip>}
            >
              <span className="nav-link" onClick={() => handleLogout()}>
                <i className="mdi mdi-power"></i>
              </span>
            </OverlayTrigger>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleAction}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state?.account?.authUser,
  };
};

const mapDispatchToProps = {
  logoutAction,
  toggleAction,
  loginAction,
  updateLoginAction,
  reloadProfileAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
