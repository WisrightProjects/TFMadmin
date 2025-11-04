import BreadCrumb from "components/common/breadcrumb";
import { Fragment, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const Profile = () => {
  const [pageFor] = useState("Profile");
  const authProfile = useSelector((state) => state.account?.authUser);
  const commonData = useSelector((state) => state?.common?.commonData);

  const getCommonDataValue = (key, value) => {
    const resp = commonData[key]?.find((ele) => ele.code === value);
    return resp ? resp?.label : "";
  };

  return (
    <Fragment>
      <BreadCrumb pageFor={pageFor} />
      <Card>
        <Card.Body>
          <Row className="form-group d-flex align-items-end">
            <Col xl={3}>
              <h4>Name</h4>
            </Col>
            <Col xl={3}>
              <h5>{authProfile?.name}</h5>
            </Col>
          </Row>
          <Row className="form-group d-flex align-items-end">
            <Col xl={3}>
              <h4>Email</h4>
            </Col>
            <Col xl={3}>
              <h5>{authProfile?.email}</h5>
            </Col>
          </Row>
          <Row className="form-group d-flex align-items-end">
            <Col xl={3}>
              <h4>Phone</h4>
            </Col>
            <Col xl={3}>
              <h5>{authProfile?.phone}</h5>
            </Col>
          </Row>
          <Row className="form-group d-flex align-items-end">
            <Col xl={3}>
              <h4>Status</h4>
            </Col>
            <Col xl={3}>
              <h5>{getCommonDataValue("commonStatus", authProfile?.status)}</h5>
            </Col>
          </Row>
          <Row className="form-group d-flex align-items-end">
            <Col xl={3}>
              <h4>Role</h4>
            </Col>
            <Col xl={3}>
              <h5>
                {getCommonDataValue("staffRegisterRoles", authProfile?.role)}
              </h5>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default Profile;
