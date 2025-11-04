import React, { Fragment } from "react";
import { Accordion, Card, Col, Form, Row } from "react-bootstrap";
import AccordionHeaderCustom from "components/common/accordian-header";
import ProfileImagesViewSlider from "components/common/profile-imgae-view";
import moment from "moment";
import { utils } from "core/helper";
import { useSelector } from "react-redux";

const ProfileView = (props) => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const { profile, getCommonDataVal } = props;
  const {
    user = null,
    contactDetails = null,
    basic = null,
    family = null,
    location = null,
    privacyOption = null,
    qualification = null,
    name,
  } = profile;
  const imageDomain = process.env.REACT_APP_IMAGE_PATH;

  const handleDownloadIdentity = async () => {
    const resp =
      imageDomain +
      profile?.proof?.images?.[0]?.imagePath +
      "/" +
      profile?.proof?.images?.[0]?.originalImage;
    if (resp !== "") {
      fetch(resp).then((response) => {
        response.blob().then((blob) => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          const [src, extension] =
            profile?.proof?.images?.[0]?.originalImage?.split(".");
          console.log("extension::", extension);
          let link = document.createElement("a");

          link.href = fileURL;
          link.download = `${profile?.profileID}-Goverment-identity.${extension}`;
          link.click();
        });
      });
      utils.showSuccessMsg(resp?.meta?.message);
    }
  };

  const getProofCommonDataVal = (key, value) => {
    const data = commonData?.[key]?.find((ele) => ele.code === value);
    return data ? data?.name : "";
  };

  return (
    <Fragment>
      <Row>
        <Col xl={5}>
          <Card className="border">
            <Card.Header>
              <div className="custom-slider">
                <div className="image_wrapper">
                  <ProfileImagesViewSlider
                    photos={profile?.photos}
                    profile={profile}
                    gender={profile?.basic?.gender}
                  />
                </div>
              </div>
            </Card.Header>
            <Card.Body className="px-2">
              <div className="table-responsive profile_view_scrollbar">
                <table className="table">
                  <tbody>
                    <Fragment>
                      <tr>
                        <th>Name</th>
                        <td>
                          {name
                            ? utils.getFirstCaps(name)
                            : utils.getFirstCaps(user?.name)}
                        </td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{user?.email}</td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{user?.phone}</td>
                      </tr>
                      <tr>
                        <th>Date Of Birth</th>
                        <td>{profile?.basic?.dateOfBirth}</td>
                      </tr>
                      <tr>
                        <th>Plan Name</th>
                        <td>{profile?.plan?.name}</td>
                      </tr>
                      <tr>
                        <th>Profile Create At</th>
                        <td>
                          {moment(profile?.createdAt).format("DD-MM-YYYY")}
                        </td>
                      </tr>
                    </Fragment>
                    {contactDetails && (
                      <Fragment>
                        <tr>
                          <th>Name Of Contact</th>
                          <td>{contactDetails?.nameOfContact}</td>
                        </tr>
                        <tr>
                          <th>Contact By</th>
                          <td>{contactDetails?.contact}</td>
                        </tr>
                        {contactDetails?.timeToCall && (
                          <tr>
                            <th>Time to call</th>
                            <td>
                              <b>from</b>{" "}
                              {getCommonDataVal(
                                "time",
                                contactDetails.timeToCall?.fromTime
                              ) +
                                " " +
                                getCommonDataVal(
                                  "value",
                                  contactDetails?.timeToCall?.fromValue
                                ) +
                                " "}
                              <b>to</b>{" "}
                              {getCommonDataVal(
                                "time",
                                contactDetails.timeToCall?.toTime
                              ) +
                                " " +
                                getCommonDataVal(
                                  "value",
                                  contactDetails?.timeToCall?.toValue
                                )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={7}>
          <Accordion
            className="accordion-solid-header"
            defaultActiveKey={"basic"}
          >
            <Accordion.Item className="card" eventKey="basic">
              <div className="card-header">
                <AccordionHeaderCustom eventKey="basic" headerTitle="Basic" />
              </div>
              <Accordion.Body className="card-body">
                {basic && (
                  <table className="table custome ">
                    <tbody>
                      <tr>
                        <th>About your self</th>
                        <td className="text-wrap">{basic?.aboutYourSelf}</td>
                      </tr>
                      <tr>
                        <th>Diet</th>
                        <td>{getCommonDataVal("dietTypes", basic?.diet)}</td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td>{getCommonDataVal("gender", basic?.gender)}</td>
                      </tr>
                      <tr>
                        <th>Height</th>
                        <td>
                          {basic?.diet
                            ? getCommonDataVal("heightTypes", basic?.height)
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Age</th>
                        <td>{basic?.age}</td>
                      </tr>
                      <tr>
                        <th>Community</th>
                        <td className="text-wrap">{basic?.community?.community}</td>
                      </tr>
                      <tr>
                        <th>Sub Community</th>
                        <td>
                          {basic?.sub_community?.community
                            ? basic?.sub_community?.community
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Religion</th>
                        <td>{basic?.religion?.name}</td>
                      </tr>
                      <tr>
                        <th>Marital Status</th>
                        <td>
                          {getCommonDataVal(
                            "maritalStatus",
                            basic?.maritalStatus
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Living with Family</th>
                        <td>
                          {!basic?.isLivingWithFamily && " --- "}
                          {basic?.isLivingWithFamily === "true" && "Yes"}
                          {basic?.isLivingWithFamily === "false" && "No"}
                        </td>
                      </tr>
                      <tr>
                        <th>Profile For</th>
                        <td>
                          {getCommonDataVal("profileFor", basic?.profileFor)}
                        </td>
                      </tr>
                      <tr>
                        <th>BloodGroup</th>
                        <td>
                          {basic?.bloodGroup
                            ? getCommonDataVal("bloodGroup", basic?.bloodGroup)
                            : " --- "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="card" eventKey="contact">
              <div className="card-header">
                <AccordionHeaderCustom
                  eventKey="contact"
                  headerTitle="Contact"
                />
              </div>
              <Accordion.Body className="card-body">
                {contactDetails && (
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Contact</th>
                        <td>{contactDetails?.contact}</td>
                      </tr>
                      <tr>
                        <th>Contact Display</th>
                        <td>
                          {getCommonDataVal(
                            "contactDisplayType",
                            contactDetails?.contactDisplay
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Name Of Contact</th>
                        <td>{contactDetails?.nameOfContact}</td>
                      </tr>
                      <tr>
                        <th>Time to call</th>

                        <td>
                          <b>from</b>
                          {contactDetails?.timeToCall?.fromTime
                            ? getCommonDataVal(
                                "time",
                                contactDetails?.timeToCall?.fromTime
                              )
                            : " --- "}
                          {contactDetails?.timeToCall?.fromValue
                            ? getCommonDataVal(
                                "value",
                                contactDetails?.timeToCall?.fromValue
                              )
                            : " --- "}
                          <b>to</b>
                          {contactDetails?.timeToCall?.toTime
                            ? getCommonDataVal(
                                "time",
                                contactDetails?.timeToCall?.toTime
                              )
                            : " --- "}
                          {contactDetails?.timeToCall?.toValue
                            ? getCommonDataVal(
                                "value",
                                contactDetails?.timeToCall?.toValue
                              )
                            : " --- "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!contactDetails && (
                  <table className="table">
                    <tbody>
                      <tr>Contact Details not added</tr>
                    </tbody>
                  </table>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="card" eventKey="family">
              <div className="card-header">
                <AccordionHeaderCustom eventKey="family" headerTitle="Family" />
              </div>
              <Accordion.Body className="card-body">
                {family && (
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Father Name</th>
                        <td>{family?.fatherName}</td>
                      </tr>
                      <tr>
                        <th>Mother Name</th>
                        <td>{family?.motherName}</td>
                      </tr>
                      <tr>
                        <th rowSpan="5">Siblings</th>
                      </tr>
                      <tr>
                        <td>
                          <small>No of male not married</small>
                          &nbsp;({family?.sibling?.noOfMale})
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <small>No of male married</small>
                          &nbsp;({family?.sibling?.noOfMaleMarried})
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <small>No of female not married</small>
                          &nbsp;({family?.sibling?.noOfFemale})
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <small>No of female married</small>
                          &nbsp;({family?.sibling?.noOfFemaleMarried})
                        </td>
                      </tr>
                      <tr>
                        <th>Family Affluence</th>
                        <td>
                          {getCommonDataVal(
                            "familyAffluence",
                            family?.familyAffluence
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Family Type</th>
                        <td>
                          {getCommonDataVal("familyType", family?.familyType)}
                        </td>
                      </tr>
                      <tr>
                        <th>Family Value</th>
                        <td>
                          {getCommonDataVal("familyValue", family?.familyValue)}
                        </td>
                      </tr>
                      <tr>
                        <th>Father Occupation</th>
                        <td>
                          {getCommonDataVal("business", family?.fatherBusiness)}
                        </td>
                      </tr>
                      <tr>
                        <th>Mother Occupation</th>
                        <td>
                          {getCommonDataVal("business", family?.motherBusiness)}
                        </td>
                      </tr>
                      <tr>
                        <th>Location</th>
                        <td>{family?.location}</td>
                      </tr>
                      <tr>
                        <th>Native Place</th>
                        <td>{family?.nativePlace}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!family && (
                  <table className="table">
                    <tbody>
                      <tr>Family Details not added</tr>
                    </tbody>
                  </table>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="card" eventKey="location">
              <div className="card-header">
                <AccordionHeaderCustom
                  eventKey="location"
                  headerTitle="Location"
                />
              </div>
              <Accordion.Body className="card-body">
                {location && (
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>City</th>
                        <td>
                          {location?.city?.name
                            ? location?.city?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>State</th>
                        <td>
                          {location?.state?.name
                            ? location?.state?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Country</th>
                        <td>
                          {location?.country?.name
                            ? location?.country?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Country Grown</th>
                        <td>
                          {location?.countryGrowUp
                            ? location?.countryGrowUp?.map((ele) => ele + " , ")
                            : " --- "}
                          {/* {location?.countryGrowUp?.map((ele) => ele ? (`${ele},` ): " --- ")} */}
                        </td>
                      </tr>
                      <tr>
                        <th>Residency Status</th>
                        <td>
                          {location?.residencyStatus
                            ? getCommonDataVal(
                                "residencyStatus",
                                location?.residencyStatus
                              )
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Zipcode</th>
                        <td>
                          {location?.zipCode ? location?.zipCode : " --- "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!location && (
                  <table className="table">
                    <tbody>
                      <tr>Location Details not added</tr>
                    </tbody>
                  </table>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="card" eventKey="qualification">
              <div className="card-header">
                <AccordionHeaderCustom
                  eventKey="qualification"
                  headerTitle="Qualification"
                />
              </div>
              <Accordion.Body className="card-body">
                {qualification && (
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Collage</th>
                        <td>
                          {qualification?.collage?.name
                            ? qualification?.collage?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Current Company Name</th>
                        <td>
                          {qualification?.currentCompanyName?.name
                            ? qualification?.currentCompanyName?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Degree</th>
                        <td>
                          {qualification?.degree?.name
                            ? qualification?.degree?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Profession</th>
                        <td>
                          {qualification?.profession?.name
                            ? qualification?.profession?.name
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Work With</th>
                        <td>
                          {qualification?.workWith
                            ? getCommonDataVal(
                                "workWithTypes",
                                qualification?.workWith
                              )
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Yearly Income</th>
                        <td>
                          {qualification?.annualIncome
                            ? getCommonDataVal(
                                "yearlyIncome",
                                qualification?.annualIncome
                              )
                            : " --- "}
                        </td>
                      </tr>
                      <tr>
                        <th>Work With</th>
                        <td>
                          {qualification?.workWith
                            ? getCommonDataVal(
                                "workWithTypes",
                                qualification?.workWith
                              )
                            : " --- "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!qualification && (
                  <table className="table">
                    <tbody>
                      <tr>Qualification Details not added</tr>
                    </tbody>
                  </table>
                )}
              </Accordion.Body>
            </Accordion.Item>
            {privacyOption && (
              <Accordion.Item className="card" eventKey="privacy">
                <div className="card-header">
                  <AccordionHeaderCustom
                    eventKey="privacy"
                    headerTitle="Privacy Option"
                  />
                </div>
                <Accordion.Body className="card-body">
                  {privacyOption && (
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Display Name</th>
                            <td>
                              {privacyOption?.displayName
                                ? privacyOption?.displayName
                                : " --- "}
                            </td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td className="">
                              {privacyOption?.email
                                ? getCommonDataVal(
                                    "privacyEmailSetting",
                                    privacyOption?.email
                                  )
                                : " --- "}
                            </td>
                          </tr>
                          <tr>
                            <th>Phone</th>
                            <td>
                              {privacyOption?.phone
                                ? getCommonDataVal(
                                    "contactDisplayType",
                                    privacyOption?.phone
                                  )
                                : " --- "}
                            </td>
                          </tr>
                          <tr>
                            <th>Photo</th>
                            <td>
                              {privacyOption?.photo
                                ? getCommonDataVal(
                                    "privacyPhotoSetting",
                                    privacyOption?.photo
                                  )
                                : " --- "}
                            </td>
                          </tr>
                          <tr>
                            <th>Annual Income</th>
                            <td>
                              {privacyOption?.annuelIncome
                                ? getCommonDataVal(
                                    "annuelIncome",
                                    privacyOption?.annuelIncome
                                  )
                                : " --- "}
                            </td>
                          </tr>
                          <tr>
                            <th>Date of Birth</th>
                            <td>
                              {privacyOption?.dateOfBirth
                                ? getCommonDataVal(
                                    "dateOfBirth",
                                    privacyOption?.dateOfBirth
                                  )
                                : " --- "}
                            </td>
                          </tr>
                          <tr>
                            <th>Profile Privacy</th>
                            <td>
                              {privacyOption?.profilePrivacy
                                ? getCommonDataVal(
                                    "profilePrivacy",
                                    privacyOption?.profilePrivacy
                                  )
                                : " --- "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            )}
            <Accordion.Item className="card" eventKey="goverment-identity">
              <div className="card-header">
                <AccordionHeaderCustom
                  eventKey="goverment-identity"
                  headerTitle="Goverment Identity"
                />
              </div>
              <Accordion.Body className="card-body">
                {profile?.proof && (
                  <div className="d-flex justify-content-end ">
                    <button
                      onClick={handleDownloadIdentity}
                      type="button"
                      className="btn btn-sm btn-rounded btn-success"
                    >
                      Download
                    </button>
                  </div>
                )}
                {profile?.proof && (
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Proof Type</th>
                        <td>
                          {getProofCommonDataVal(
                            "proofDocTypes",
                            profile?.proof?.code
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!profile?.proof && (
                  <div className="my-3">
                    <p className="fs-1 text-center">
                      Enhance your profile by securely submitting the required
                      documents. Please upload your goverment identity.
                    </p>
                  </div>
                )}{" "}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProfileView;
