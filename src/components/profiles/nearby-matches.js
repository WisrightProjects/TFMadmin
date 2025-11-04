import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { usersService } from "core/services";
import Pagination from "components/common/pagination";
import { connect } from "react-redux";
import { localStorage } from "core/helper";
import ProfileCard from "components/common/profile-card";
import { CONST } from "core/helper";

const NearByMatches = (props) => {
  const { profileId } = props;

  const [newMatches, setNewMatches] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState(0);
  const [respMsg, setRespMsg] = useState("");
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [apiLoad, setApiLoad] = useState(false);

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    if (filter || profileId) {
      if (apiLoad === true) return;
      setApiLoad(true);
      setNewMatches([]);
      const nearByMatches = async (filter) => {
        localStorage.setProfileID(profileId);
        const resp = await usersService.nearByMatches(filter);
        if (resp && resp.meta.code === 200) {
          const { pagination, data } = resp;
          setTotalPage(
            Math.ceil(
              pagination.totalCount > 0
                ? pagination.totalCount / filter.limit
                : 0
            )
          );
          setNewMatches(data);
          setApiLoad(false);
        } else if (resp && resp.meta.code === 1008) {
          setNewMatches(resp?.data);
          setRespMsg(resp?.meta?.message);
          setApiLoad(false);
        }
      };
      nearByMatches(filter);
    }
  }, [isComponentMounted, profileId, filter]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const changePage = ({ selected }) => {
    if (selected >= 0) {
      setSelectedPage(selected);
    }
  };

  useEffect(() => {
    if (!profileId || profileId === null) {
      localStorage.removeProfileID();
    }
  }, [profileId]);

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
      behavior: "smooth",
    });
  };

  return (
    <Fragment>
      <Row className="d-flex justify-content-center">
        <Col xl={8}>
          {newMatches === null && (
            <h3 className="text-center pt-5">{respMsg}</h3>
          )}
          {apiLoad && <h3>Loading</h3>}
          {!apiLoad &&
            newMatches !== null &&
            newMatches?.map((ele, ind) => {
              return (
                <Card key={ind} className="today-matches matches_card mb-4">
                  <Card.Body className="p-0">
                    <ProfileCard profile={ele} />
                  </Card.Body>
                </Card>
              );
            })}
          {apiLoad ||
            (newMatches !== null && totalPage > 1 && (
              <Pagination
                initialPage={selectedPage}
                disableInitialCallback={true}
                pageCount={totalPage}
                onPageChange={changePage}
                OnClick={scrollToTop}
              />
            ))}
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    commonData: state?.common?.commonData,
  };
};

export default connect(mapStateToProps, null)(NearByMatches);
