import { commonService } from "core/services";
import { Fragment, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BreadCrumb from "components/common/breadcrumb";
import { PLAN_GET_BY_ID } from "core/services/apiURL.service";
import { useSelector } from "react-redux";

const ViewPlan = () => {
  const { _id } = useParams();
  const [viewPlan, setViewPlan] = useState({});
  const [pageFor] = useState("View Plan");
  const commonData = useSelector((state) => state?.common?.commonData);

  const loadUser = async () => {
    const resp = await commonService.getById(PLAN_GET_BY_ID + _id);
    if (resp && resp.meta.code === 200) {
      setViewPlan(resp.data);
    }
  };

  useEffect(() => {
    loadUser();
  }, [_id]);

  const ValTrueState = () => {
    return <button className="btn btn-gradient-success btn-sm">Yes</button>;
  };

  const ValFalseState = () => {
    return <button className="btn btn-gradient-danger btn-sm">No</button>;
  };

  const getCommonDataVal = (key, value) => {
    const resp = commonData[key]?.find((ele) => ele.code === value);
    return resp ? resp?.label : "";
  };

  return (
    <Fragment>
      <BreadCrumb pageFor={pageFor} />
      <Card>
        <Card.Body>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Name</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.name}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Price</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.price}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Validity</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {getCommonDataVal("planValidityTypes", viewPlan?.validity)}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>No Of Contacts View</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.noOfContactsToView}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Profiles To View All</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.isProfileVisibleToAll ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Shortlisted Contacts Seek</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.shorlistedContactsSeek ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Profiles At TFM Premises</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.browseProfilesAtTFMPremises ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Guide To Browse Profiles</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.personalGuideToBrowseProfilesAtTFMPremises ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Personalized Message</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.sendPersonalizedMessage ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Hand Picked Profiles By TFM</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.handPickedProfilesByTFM ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Provide Space For Meeting</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.provideSpaceForMeeting ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Exclusive Profile Ranking</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.exclusiveProfileRanking ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>UpMarket Tagging</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.upMarketTagging ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Promient Display</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.PromientDisplay ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Prayer Assurance</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.prayerAssurance ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Message Form Contact Views</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.getInstantMsgFormContactViews ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="form-group">
            <Col xl={6}>
              <Row>
                <Col xl={6} md={3} lg={4}>
                  <Form.Label>Personal Matrimony Service</Form.Label>
                </Col>
                <Col xl={6} md={6} lg={4}>
                  {viewPlan?.personalisedMatrimonyService ? (
                    <ValTrueState />
                  ) : (
                    <ValFalseState />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default ViewPlan;
