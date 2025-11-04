import { Card, Col, Form, Row } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import React, { useEffect, useState, Fragment } from "react";
import { commonService, masterService } from "core/services";
import { Link, useNavigate, useParams } from "react-router-dom";
import { utils, CONST } from "core/helper";
import { PROFILE_URL, USER_URL } from "core/services/apiURL.service";
import { STAFF_PATH } from "pages/routes/routes";
import { useForm } from "react-hook-form";
import ImageFallback from "components/common/imageFallback";

const ViewImageApproval = () => {
  const navigate = useNavigate();
  const imageDomain = process.env.REACT_APP_IMAGE_PATH;
  const [pageFor] = useState("View Image Approval");
  const [filter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const { profileID } = useParams();

  const [profile, setProfile] = useState(null);
  const [unApproveImages, setUnApproveImages] = useState([]);
  const [approvedImages, setApprovedImages] = useState([]);
  console.log("unApproveImages::", unApproveImages);
  console.log("approvedImages::", approvedImages);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    values.branch = values.branch ? values.branch : undefined;
    const resp = await commonService.create(
      USER_URL + "/staff-register",
      values
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      utils.navigateTo(navigate,STAFF_PATH);
    }
  };

  useEffect(() => {
    const loadData = async (profileID) => {
      const resp = await masterService.getById(PROFILE_URL + "/" + profileID);
      const approvedImagesArr = [];
      const unApprovedImagesArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        console.log("data::", data);
        setProfile(data);
        if (data.photos && data.photos.length > 0) {
          data.photos.map((ele) => {
            const { approvalStatus } = ele;
            if (approvalStatus === 10) {
              unApprovedImagesArr.push(ele);
            } else if (!approvalStatus) {
              approvedImagesArr.push(ele);
            }
          });
        }
        setApprovedImages(approvedImagesArr);
        setUnApproveImages(unApprovedImagesArr);
      }
    };
    loadData(profileID);
  }, [filter]);

  return (
    <Fragment>
      <BreadCrumb pageFor={pageFor} />
      <Card>
        <Card.Body>
          <Form autoComplete="new-password" onSubmit={handleSubmit(onSubmit)}>
            <Row className="form-group">
              <Col md={12}>
                <div>
                  <h5>
                    <u>Approved Images</u>
                  </h5>
                </div>
                {approvedImages.length === 0 && (
                  <h5 className="text-light">No images uploaded</h5>
                )}
                <Row>
                  {approvedImages &&
                    approvedImages.length > 0 &&
                    approvedImages.map((ele) => {
                      const { originalImage, imagePath } = ele;
                      return (
                        <ImageFallback
                          gender={profile?.basic?.gender}
                          src={imageDomain + imagePath + originalImage}
                        />
                      );
                    })}
                  <Col md={3}></Col>
                </Row>
              </Col>
            </Row>
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-rounded btn-success"
            >
              Submit
            </button>
            <Link to={STAFF_PATH} className="btn btn-rounded btn-danger">
              Cancel
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default ViewImageApproval;
