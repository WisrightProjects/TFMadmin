import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Dropdown, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BreadCrumb from "components/common/breadcrumb";
import { usersService } from "core/services";
import { connect } from "react-redux";
import Chatbox from "components/profiles/chatbox";
import ProfileView from "components/profiles/profile-view";
import TodayMatches from "components/profiles/today-matchs";
import NearByMatches from "components/profiles/nearby-matches";
import MyMatches from "components/profiles/my-matches";
import NewMatches from "components/profiles/new-matches";
import RecentViewedByMe from "components/profiles/recent-viewed-by-me";
import RecentViewedByThem from "components/profiles/recent-viewed-by-them";
import PremiumMembers from "components/profiles/premium-members";

const ViewProfile = (props) => {
  const { commonData } = props;
  const { profileID } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [eventKeyState, setEventKeyState] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const getCommonDataVal = (key, value) => {
    if (commonData && value) {
      const data =
        commonData[key] &&
        commonData[key].find((ele) => ele.code.toString() === value.toString());
      return data ? data.label : " --- ";
    }
    return false;
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const viewUserProfile = async (profileID) => {
      setIsLoading(true);
      const resp = await usersService.getUser(profileID);
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        setUserProfile(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    if (isComponentMounted) {
      viewUserProfile(profileID);
    }
  }, [isComponentMounted, profileID]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  useEffect(() => {
    if (!eventKeyState) {
      setEventKeyState("profile");
    }
  }, [eventKeyState]);

  return (
    <Fragment>
      <BreadCrumb pageFor="View User" listUrl="View User" />
      <Card>
        <Card.Body>
          <Tab.Container
            defaultActiveKey={"profile"}
            className="tab-pills-horizontal"
          >
            <div className="tab-custom-pills-horizontal">
              <Row>
                <Col md={12}>
                  <Nav variant="pills">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="profile"
                        onClick={() => setEventKeyState("profile")}
                      >
                        Profile
                      </Nav.Link>
                    </Nav.Item>
                    {userProfile?.user?.status === 10 && (
                      <Fragment>
                        <Dropdown>
                          <Dropdown.Toggle>{"Matches"}</Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              eventKey="Matches"
                              onClick={() => setEventKeyState("Matches")}
                            >
                              Today Matches
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="My Matches"
                              onClick={() => setEventKeyState("My Matches")}
                            >
                              My Matches
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="New Matches"
                              onClick={() => setEventKeyState("New Matches")}
                            >
                              New Matches
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Near me"
                              onClick={() => setEventKeyState("Near me")}
                            >
                              Near Me
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Recently Viewed"
                              onClick={() =>
                                setEventKeyState("Recently Viewed")
                              }
                            >
                              Recently Viewed
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Recently Visitors"
                              onClick={() =>
                                setEventKeyState("Recently Visitors")
                              }
                            >
                              Recently Visitors
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Premium members"
                              onClick={() =>
                                setEventKeyState("Premium members")
                              }
                            >
                              Premium members
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Fragment>
                    )}
                  </Nav>
                </Col>
                <Col md={12}>
                  <Tab.Content>
                    {isLoading && (
                      <div className="d-flex justify-content-center">
                        <h3>Loading</h3>
                      </div>
                    )}
                    {!isLoading && (
                      <Tab.Pane eventKey="profile">
                        {userProfile && eventKeyState === "profile" && (
                          <ProfileView
                            profile={userProfile}
                            getCommonDataVal={getCommonDataVal}
                            isLoading={isLoading}
                          />
                        )}
                      </Tab.Pane>
                    )}
                    {userProfile?.user?.status === 10 && (
                      <Fragment>
                        <Tab.Pane eventKey="inbox">
                          {userProfile && eventKeyState === "inbox" && (
                            <Chatbox
                              profile={userProfile}
                              profileId={profileID}
                            />
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="My Matches">
                          <h3>My Matches</h3>
                          {userProfile && eventKeyState === "My Matches" && (
                            <MyMatches
                              profile={userProfile}
                              profileId={profileID}
                              getCommonDataVal={getCommonDataVal}
                            />
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="Matches">
                          <h3>Today Matches</h3>
                          {userProfile && eventKeyState === "Matches" && (
                            <TodayMatches
                              profile={userProfile}
                              profileId={profileID}
                              getCommonDataVal={getCommonDataVal}
                            />
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="Near me">
                          <h3>Near By Matches</h3>
                          {userProfile && eventKeyState === "Near me" && (
                            <NearByMatches
                              profile={userProfile}
                              profileId={profileID}
                              getCommonDataVal={getCommonDataVal}
                            />
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="New Matches">
                          <h3>New Matches</h3>
                          {userProfile && eventKeyState === "New Matches" && (
                            <NewMatches
                              profile={userProfile}
                              profileId={profileID}
                              getCommonDataVal={getCommonDataVal}
                            />
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="Recently Viewed">
                          <h3>Recently Viewed</h3>
                          {userProfile &&
                            eventKeyState === "Recently Viewed" && (
                              <RecentViewedByMe
                                profile={userProfile}
                                profileId={profileID}
                                getCommonDataVal={getCommonDataVal}
                              />
                            )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="Recently Visitors">
                          <h3>Recently Visitors</h3>
                          {userProfile &&
                            eventKeyState === "Recently Visitors" && (
                              <RecentViewedByThem
                                profile={userProfile}
                                profileId={profileID}
                                getCommonDataVal={getCommonDataVal}
                              />
                            )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="Premium members">
                          <h3>Premium members</h3>
                          {userProfile &&
                            eventKeyState === "Premium members" && (
                              <PremiumMembers
                                profile={userProfile}
                                profileId={profileID}
                                getCommonDataVal={getCommonDataVal}
                              />
                            )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="More Matches">
                          {userProfile &&
                            eventKeyState === "More Matches" &&
                            "More Matches is coming here"}
                        </Tab.Pane>
                      </Fragment>
                    )}
                  </Tab.Content>
                </Col>
              </Row>
            </div>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    commonData: state?.common?.commonData,
    user: state?.account?.authUser,
  };
};

export default connect(mapStateToProps, null)(ViewProfile);
