import ModalCommon from "components/modal";
import { utils } from "core/helper";
import { usersService } from "core/services";
import React, { Fragment, useState } from "react";
import { Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProfileImagesSlider from "./profile-images-slider";
import { getFirstCaps } from "core/helper/utils";

const TodayMatchesProfileCard = (props) => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const { profile } = props;
  const { photos = null, basic, user,name } = profile;

  const {
    community,
    language,
    maritalStatus,
    height,
    bio,
    age,
    religion,
    state,
    city,
    gender
  } = basic;

  const [showBlockProfile, setShowBlockProfile] = useState(false);
  const [blockProfileId, setBlockProfileId] = useState("");

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <i
      ref={ref}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className="mdi mdi-chevron-down"
    >
      {children}
    </i>
  ));

  const handleShow = () => setShowBlockProfile(true);
  const handleClose = () => setShowBlockProfile(false);

  const handleBlockProfileSubmit = async () => {
    const userProfileId = localStorage.setProfileID(profile.profileId);
    const resp = await usersService.blockProfile(blockProfileId, userProfileId);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const handleDontShowProfileSuubmit = async () => {
    const userProfileId = localStorage.setProfileID(profile.profileId);
    const resp = await usersService.dontShow(blockProfileId, userProfileId);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const getCommonDataVal = (key, value) => {
    const data = commonData[key]?.find((ele) => ele.code === value);
    return data ? data.label : "";
  };

  return (
    <Row>
      <Col xl={4} md={4} xs={12}>
        <ProfileImagesSlider
          gender={gender}
          photos={photos}
          profileID={profile.profileID}
          profile={profile}
          arrows={true}
        />
      </Col>
      <Col xl={8} md={8} xs={12} className="p-0">
        <Row className="profile_card_body_details">
          <Col xl={12}>
            <Card.Title className="d-flex justify-content-between border-bottom py-2">
              {name ? getFirstCaps(name) : getFirstCaps(user?.name)}
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      handleShow();
                      setBlockProfileId(profile.profileID);
                    }}
                  >
                    Block-Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      handleDontShowProfileSuubmit();
                      setBlockProfileId(profile.profileID);
                    }}
                  >
                    Don&apos;t Show
                  </Dropdown.Item>
                  <Dropdown.Item>Like This Profile</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Title>
            <Fragment>
              <Row>
                <Col xl={7}>
                  <div>
                    <h6>{age ? age + "yrs" : null}&nbsp;</h6>
                    <h6>{getCommonDataVal("heightTypes", Number(height))}</h6>
                    <h6>
                      {religion && religion?.name}{" , "}
                      {community && community?.community} {language && language?.name}
                    </h6>
                  </div>
                </Col>
                <Col xl={5}>
                  <div>
                    <p>{getCommonDataVal("maritalStatus", maritalStatus)}</p>
                    <p>
                      {city && city + ","} {state && state}
                    </p>
                  </div>
                </Col>
                <Col xl={12}>
                  <span>
                    {bio && bio?.slice(0, 100)}
                    {bio && "..."}
                  </span>
                </Col>
              </Row>
            </Fragment>
          </Col>
        </Row>
      </Col>
      {showBlockProfile && (
        <ModalCommon
          show={showBlockProfile}
          handleClose={handleClose}
          size="md"
          modalTitle="Block Profile"
          centered={true}
        >
          {blockProfileId && (
            <Form onSubmit={handleBlockProfileSubmit}>
              <div>
                <p>Are you sure want to block this profile ?</p>
                <div className="mt-2 d-flex justify-content-end">
                  <button type="submit" className="btn btn-success btn-sm">
                    Submit
                  </button>
                  <button
                    onClick={handleClose}
                    className="btn btn-danger btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          )}
        </ModalCommon>
      )}
    </Row>
  );
};

export default TodayMatchesProfileCard;
