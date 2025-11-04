import BreadCrumb from "components/common/breadcrumb";
import { masterService } from "core/services";
import { OLD_SITE_USER_GET_BY_ID } from "core/services/apiURL.service";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ViewOldSiteUser = () => {
  const [pageFor] = useState("View Old Site User");
  const [data, setData] = useState(null);

  const { _id } = useParams();

  const loadDataById = async (id) => {
    const resp = await masterService.getById(OLD_SITE_USER_GET_BY_ID + id);
    if (resp && resp.meta.code === 200) {
      setData(resp.data);
    }
    return false;
  };

  const formatDate = (date) => {
    // console.log("date::", date);
    const [lastDate, month, year] = date?.split("/");
    // console.log("lastDate::", lastDate);
    // console.log("time::", month);
    // console.log("year::", year.split(" "));
    // const [yearSplit] = year?.split(" ");
    // console.log("yearSplit::", yearSplit);
    const getFormatDate = [lastDate, month, year]?.join("/");
    // console.log("getFormatDate::", getFormatDate);
    return getFormatDate;
  };

  useEffect(() => {
    loadDataById(_id);
  }, [_id]);

  return (
    <Fragment>
      <BreadCrumb pageFor={pageFor} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              {!data && <h3>Loading</h3>}
              {data && (
                <Row>
                  <Col md={6}>
                    <Row className="form-group">
                      <Col md={12}>
                        <h6>
                          <u>Personal Details</u>
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Name</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data?.name}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Gender</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data?.gender}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Date Of Birth</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data?.dob}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Matri ID</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data?.matriid}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Login ID</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data?.loginid}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Marital Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data?.maritalstatus}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Email</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data?.email1}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Alternate Email-1</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data?.email2 ? data.email2 : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Mobile</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data?.mobile1 ? data.mobile1 : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Alternate Mobile - 1</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data?.mobile2 ? data.mobile2 : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Alternate Mobile - 2</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data?.mobile3 ? data.mobile3 : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Caste</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data.Caste}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Religion</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data.religion}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Mother Tounge</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.mothertongue}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Native</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">{data.native}</h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Denomination</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.denomination}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Complexion</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.complexion}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Height</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.height ? data.height : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Weight</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.weight ? data.weight : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Physical Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.physicaldetails ? data.physicaldetails : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Education</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.education ? data.education : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Occupation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.occupation ? data.occupation : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Income</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.income ? data.income : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Organization</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.organization ? data.organization : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Organi Place</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.organiplace ? data.organiplace : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Organi Phone</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.organiphone ? data.organiphone : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Eat Habit</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.eathabit ? data.eathabit : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Smoke Habit</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.smokehabit ? data.smokehabit : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Drink Habite</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.drinkhabit ? data.drinkhabit : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Interest</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.interest ? data.interest : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Hobbies</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.hobbies ? data.hobbies : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>About</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.about ? data.about : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Wear Jewels</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.wearjewels ? data.wearjewels : " - "}
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row className="form-group">
                      <Col md={12}>
                        <h6>
                          <u>Family Details</u>
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h6 className="font-weight-normal">Father Name</h6>
                      </Col>
                      <Col md={6}>
                        <h5>{data.fathername ? data.fathername : " - "}</h5>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Father Occupation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.fatheroccupation
                            ? data.fatheroccupation
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Father Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.fatherstatus ? data.fatherstatus : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Mother Name</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.mothername ? data.mothername : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Mother Occupation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.motheroccupation
                            ? data.motheroccupation
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Mother Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.motherstatus ? data.motherstatus : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Brother Married</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.brothermarried ? data.brothermarried : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Brother Un-married</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.brotherunmarried
                            ? data.brotherunmarried
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Sister Married</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.sistermarried ? data.sistermarried : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Sister Un-married</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.sisterunmarried ? data.sisterunmarried : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Family Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.familystatus ? data.familystatus : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Family Type</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.familytype ? data.familytype : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Intercaste Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.intercastestatus
                            ? data.intercastestatus
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Intercaste Expectation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.intercasteexpectation
                            ? data.intercasteexpectation
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Intercaste Exclude</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.intercasteexclude
                            ? data.intercasteexclude
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Inter Religion</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.interreligion ? data.interreligion : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Inter Denomination</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.interdenomination
                            ? data.interdenomination
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Inter Expecatation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.interdenomexpectation
                            ? data.interdenomexpectation
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Inter Exclude</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.interdenomexclude
                            ? data.interdenomexclude
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row className="form-group">
                      <Col md={12}>
                        <h6>
                          <u>Partner Details</u>
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Age From</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.agefrom ? data.agefrom : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Age To</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.ageto ? data?.ageto : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Height From</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.heightfrom ? data?.heightfrom : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Height To</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.heightto ? data?.heightto : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Parter Qualification</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.parterqualification
                            ? data?.parterqualification
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Parter Occupation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.partneroccupation
                            ? data?.partneroccupation
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Parter Religion</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.partnerregion ? data?.partnerregion : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Parter Wear Jewels</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.partnerwearjewel
                            ? data?.partnerwearjewel
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Parter Complexion</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.partnercomplexion
                            ? data?.partnercomplexion
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Parter Language</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.partnerlanguage ? data?.partnerlanguage : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Special Expectation</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.specialexpectation
                            ? data?.specialexpectation
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Willtomarry</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.willtomarry ? data?.willtomarry : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Show Photo</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.showphoto ? data?.showphoto : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Profile Picture</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.profilepic ? data?.profilepic : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Birth Certificate</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.birthcertificate
                            ? data?.birthcertificate
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Address Proof</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.addressproof ? data?.addressproof : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Death Certificate</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.deathcertificate
                            ? data?.deathcertificate
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Divorce Certificate</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.divorcecertificate
                            ? data?.divorcecertificate
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Education Certificate</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.educertificate ? data?.educertificate : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Video File</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.videofile ? data?.videofile : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Audio File</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.audiofile ? data?.audiofile : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h6>
                          <u>Address Details</u>
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Address</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.address ? data.address : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>City</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.city ? data.city : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>State</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.state ? data.state : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Country</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.country ? data.country : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Pincode</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.pincode ? data.pincode : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Mobile Code</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.mobcode ? data.mobcode : " - "}
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row className="form-group">
                      <Col md={12}>
                        <h6>
                          <u>Other Details</u>
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Branch Name</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.branchname ? data.branchname : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Branch ID</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.branchid ? data.branchid : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Paymode</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.paymode ? data.paymode : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Created By</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.createdby ? data.createdby : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Modified By</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.modifyby ? data.modifyby : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>MV Code</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.mvcode ? data.mvcode : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>EV Code</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.evcode ? data.evcode : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>M verify</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.mverify ? data.mverify : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>E verify</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.everify ? data.everify : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Api Login</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.apilogin ? data.apilogin : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Pass Reset Code</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.passresetcode ? data.passresetcode : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Last Login</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.lastlogin ? formatDate(data.lastlogin) : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Profile Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.profilestatus ? data.profilestatus : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Last Tip</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.lastip ? data.lastip : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>IP</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.ip ? data.ip : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Client</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.client ? data.client : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Last Client</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.lastclient ? data.lastclient : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Edit On Client</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.lastclient ? formatDate(data.editon) : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Edit IP</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.editip ? data.editip : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Edit Client</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.editclient ? data.editclient : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Active Plan</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.activeplan ? data.activeplan : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Total Contacts</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.totalcontacts ? data.totalcontacts : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Viewed Contacts</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.viewedcontacts ? data.viewedcontacts : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Expire On</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.expireon ? formatDate(data.expireon) : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Register Form</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.registerfrom ? data.registerfrom : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Status</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.status === 0 ? "Active" : "In-Active"}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Created At</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.createdAt
                            ? moment(data.createdAt).format()
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="form-group">
                      <Col md={6}>
                        <h5>Updated At</h5>
                      </Col>
                      <Col md={6}>
                        <h6 className="font-weight-normal">
                          {data.updatedAt
                            ? moment(data.updatedAt).format()
                            : " - "}
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ViewOldSiteUser;
