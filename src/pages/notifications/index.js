import { Card, Col, Form, Row } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { useEffect, Fragment, useState } from "react";
import { commonService, masterService } from "core/services";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CONST, utils } from "core/helper";
import {
  BRANCH_URL,
  NOTIFICATION_FILTER,
  UPDATE_NOTIFICATION,
} from "core/services/apiURL.service";
import { BRANCHS_PATH } from "pages/routes/routes";
import { connect, useSelector } from "react-redux";
import Pagination from "components/common/pagination";
import { Trans } from "react-i18next";
import * as RouteConst from "../routes/routes";
import { reloadProfileAction } from "redux/action/account.action";

const Notifications = (props) => {
  const { reloadProfileAction } = props;
  const reload = useSelector((state) => state?.common?.reload);
  const navigate = useNavigate();
  const [pageFor] = useState("Notifications");
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_FILTER });
  const [notifications, setNotification] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState(0);
  const [apiLoad, setApiLoad] = useState(false);
  const [respMsg, setRespMsg] = useState("");

  const getNotifications = async (filter) => {
    if (apiLoad === true) return;
    setApiLoad(true);
    setNotification([]);
    const resp = await masterService.getAll(NOTIFICATION_FILTER, filter);
    if (resp && resp?.meta?.code === 200) {
      const { pagination } = resp;
      setTotalPage(
        Math.ceil(
          pagination.totalCount > 0 ? pagination.totalCount / filter.limit : 0
        )
      );
      setNotification(resp?.data);
      setApiLoad(false);
    } else if (resp && resp.meta.code === 1027) {
      const { data } = resp;
      setRespMsg("No new notifications");
      setNotification(data);
      setApiLoad(false);
    }
  };

  const changePage = ({ selected }) => {
    if (selected >= 0) {
      setSelectedPage(selected);
    }
  };

  const notificationType = (ele) => {
    switch (ele?.notificationType) {
      case 100:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-success notify_list_type">
                <i className="mdi mdi-account-box"></i>
              </div>
            </div>
            <div className="preview-item-content align-items-start flex-column  mx-3">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Contacts Query</Trans>
              </h6>
              <p className="text-gray ellipsis mb-0 d-flex">
                <Trans>
                  <h4 className="text-dark text-capitalize">
                    {ele?.senderEmail
                      ? ele?.senderEmail
                      : ele?.fromUserObj?.name}
                  </h4>{" "}
                  &nbsp; user raised a contact us request
                </Trans>
              </p>
            </div>
          </Fragment>
        );
      case 110:
        return (
          <Fragment>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-primary notify_list_type">
                <i className="mdi mdi-account-check text-white"></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center mx-3">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Profile Completed</Trans>
              </h6>
              <p className="text-gray ellipsis mb-0 d-flex">
                <Trans>
                  <h4 className="text-dark text-capitalize">
                    {ele?.fromUserObj?.name}
                  </h4>{" "}
                  &nbsp; user successfully completed the profile{" "}
                </Trans>
              </p>
            </div>
          </Fragment>
        );
      case 120:
        return (
          <Fragment>
            <div className={"preview-thumbnail"}>
              <div className="preview-icon bg-danger notify_list_type">
                <i className="mdi mdi-delete text-white "></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center mx-3">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Profile Delete Request</Trans>
              </h6>
              <p className="text-gray ellipsis mb-0 d-flex">
                <Trans>
                  <h4 className="text-dark text-capitalize">
                    {ele?.senderEmail
                      ? ele?.senderEmail
                      : ele?.fromUserObj?.name}
                  </h4>{" "}
                  &nbsp;raised a request to delete profile
                </Trans>
              </p>
            </div>
          </Fragment>
        );
      case 130:
        return (
          <Fragment>
            <div className={"preview-thumbnail"}>
              <div className="preview-icon bg-info notify_list_type">
                <i className="mdi mdi-image-area text-white "></i>
              </div>
            </div>
            <div className="preview-item-content d-flex align-items-start flex-column justify-content-center mx-3">
              <h6 className="preview-subject font-weight-normal mb-1">
                <Trans>Photo waiting for approval</Trans>
              </h6>
              <p className="text-gray ellipsis mb-0 d-flex">
                <Trans>
                  <h4 className="text-dark text-capitalize">
                    {ele?.fromUserObj?.name}
                  </h4>{" "}
                  &nbsp;Photo uploaded
                </Trans>
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

  const isReadNofication = async () => {
    const resp = await masterService.getAll(NOTIFICATION_FILTER, {
      ...CONST.DEFAULT_FILTER,
      isRead: false,
    });
    if (resp && resp?.meta?.code === 200) {
      return resp?.data;
    }
    return;
  };

  const getSpiltNotification = (ele) => notificationType(ele);

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    if (isComponentMounted) {
      getNotifications(filter);
    }
  }, [isComponentMounted, filter]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  useEffect(() => {
    const skip = selectedPage >= 1 ? selectedPage * 10 : 0;
    setFilter({
      ...filter,
      skip,
    });
  }, [selectedPage]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  const updateNoification = async (id) => {
    const resp = await masterService.getAllPatch(UPDATE_NOTIFICATION + id);
    if (resp && resp?.meta?.code === 200) {
      isReadNofication();
      reloadProfileAction(!reload);
      return true;
    }
    return;
  };

  const handleUpdateNotification = (ele) => {
    const { notificationType } = ele;
    switch (notificationType) {
      case 100:
        {
          updateNoification(ele._id);
        }
        navigate(RouteConst.CONTACT_US_PATH);
        break;
      case 110:
        {
          updateNoification(ele._id);
        }
        navigate(RouteConst.EDIT_PROFILE + "/" + ele.fromProfile?.profileID);
        break;
      case 120:
        {
          updateNoification(ele._id);
        }
        navigate(RouteConst.DEL_REQ_PATH);
      case 130:
        {
          updateNoification(ele._id);
        }
        navigate(RouteConst.EDIT_PROFILE + "/" + ele.fromProfile?.profileID);
        break;
    }
  };

  return (
    <Fragment>
      <BreadCrumb pageFor={pageFor} />
      <Card>
        <Card.Body>
          <Form>
            <Row className="form-group">
              <Col xl={12} md={6} lg={6}>
                {apiLoad && <h3>Loading</h3>}
                {!apiLoad && notifications === null && (
                  <h3 className="text-center">{respMsg} </h3>
                )}
                {!apiLoad &&
                  notifications !== null &&
                  notifications?.map((ele, ind) => {
                    return (
                      <div
                        onClick={() => handleUpdateNotification(ele)}
                        key={ind}
                        className={
                          "d-flex notification_wrapper mb-3 " +
                          (ele.isRead ? "" : "is_read_notification")
                        }
                      >
                        {getSpiltNotification(ele)}
                      </div>
                    );
                  })}
              </Col>
            </Row>
            {apiLoad ||
              (notifications !== null && totalPage > 1 && (
                <Pagination
                  initialPage={selectedPage}
                  disableInitialCallback={true}
                  pageCount={totalPage}
                  onPageChange={changePage}
                  OnClick={scrollToTop}
                />
              ))}
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

const mapDispatchToProps = {
  reloadProfileAction,
};

export default connect(null, mapDispatchToProps)(Notifications);
