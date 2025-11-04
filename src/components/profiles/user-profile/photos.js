import { useForm } from "react-hook-form";
import { connect, useSelector } from "react-redux";
import { CONST, localStorage, utils } from "core/helper";
import { commonService, masterService } from "core/services";
import { Col, Form, Row, Spinner, Tab } from "react-bootstrap";
import ProfileImageUpload from "components/common/profile-image-upload";
import ImageFallback from "components/common/imageFallback";
import { reloadProfileAction } from "redux/action/account.action";
import { IMAGE_APPROVAL } from "core/services/apiURL.service";
import { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { CanvasPreview } from "components/image-resize/canvas-preivew";
import { UseDebounceEffect } from "components/image-resize/usedebonce";
import ModalCommon from "components/modal";

const Photos = (props) => {
  const {
    profile,
    reloadProfileAction,
    images,
    waitingApprovalimgs,
    profileID,
  } = props;
  const reload = useSelector((state) => state?.common?.reload);
  const fileInputRef = useRef();

  //re-size
  const [crop, setCrop] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [completedCrop, setCompletedCrop] = useState();
  const [scale] = useState(1);
  const [rotate] = useState(0);
  const [aspect] = useState(6 / 6);
  const [isUploadImg, setIsUploadImg] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [modelTitle] = useState("Upload Profile Image");
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleUploadImgShow = () => setIsUploadImg(true);
  const handleUploadImgHide = () => {
    setIsUploadImg(false);
    fileInputRef.current.value = null;
  };

  const handleUploadImgChange = async (e) => {
    if (profile?.photos?.length >= 20) {
      utils.showErrMsg("Maximum photos was uploaded");
      return false;
    }
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      handleUploadImgShow();
    }
  };

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist");
    }

    const blobImg = await previewCanvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        throw new Error("Failed to create blob");
      }
      await handleConfirmImgUpload(blob);
      return blob;
    }, "image/jpeg");
  }

  UseDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        CanvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function changeFilename(blob, newFilename) {
    // Create a new File object with the blob and new filename
    const file = new File([blob], newFilename, { type: blob.type });
    return file;
  }

  const handleConfirmImgUpload = async (blobImg) => {
    setIsUploaded(true);
    localStorage.setProfileID(profileID);
    const newBlob = changeFilename(
      blobImg,
      `tfmprofile${new Date().getTime()}.jpg`
    );
    const formData = new FormData();
    formData.append("category", 10);
    formData.append("images", newBlob);
    // const options = {
    //   onUploadProgress: (progressEvent) => {
    //     const { loaded, total } = progressEvent;
    //     let percent = Math.floor((loaded * 100) / total);
    //     if (percent < 100) {
    //       setUploadPercentage(percent);
    //     }
    //   },
    // };

    // if (!newBlob) {
    //   setUploadPercentage((uploadPercentage = 0));
    // }

    const resp = await commonService.profileImageUpload(formData);
    // setUploadPercentage((uploadPercentage = 100), () => {
    //   setTimeout(() => {
    //     setUploadPercentage((uploadPercentage = 0));
    //   }, 1000);
    // });
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      // imageObjList(resp.data[0]);
      reloadProfileAction(!reload);
      localStorage.removeProfileID();
      setIsUploaded(false);
      handleUploadImgHide();
      // setUploadPercentage((uploadPercentage = 0));
    } else {
      setIsUploaded(false);
    }
  };

  // const handleUploadImg = async () => {
  //   const formData = new FormData();
  //   formData.append("category", 10);
  //   formData.append("images", img);
  //   localStorage.setProfileID(profileID);
  //   const resp = await commonService.profileImageUpload(formData, profileID);
  //   if (resp && resp.meta.code === 200) {
  //     setValue("images", img, { shouldValidate: true });
  //     const { data } = resp;
  //     setImageId(data[0]._id);
  //     localStorage.removeProfileID();
  //     utils.showSuccessMsg(resp?.meta.message);
  //     handleCancelBlogImg();
  //     //   getUserProfile();
  //     reloadProfileAction(!reload);
  //     setImageId(null);
  //   }
  // };

  // const imageDomain = process.env.REACT_APP_IMAGE_PATH;

  //apporval-status response object

  // const getCommonDataValOfImageStatus = (key) => {
  //   switch (key) {
  //     case 20:
  //       return <p className="mt-2">Photo approved.</p>;
  //     case 30:
  //       return <p className="mt-2">Photo approval rejected</p>;
  //     default:
  //       return <p className="mt-2">Photo approved.</p>;
  //   }
  // };

  // const [loading, setLoading] = useState(false);

  // const handleApprove = async (id) => {
  //   setLoading(true);
  //   const resp = await masterService.get(IMAGE_APPROVAL + id + "?type=20");
  //   if (resp && resp.meta.code === 200) {
  //     reloadProfileAction(!reload);
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };

  // const handleReject = async (id) => {
  //   setLoading(true);
  //   const resp = await masterService.get(IMAGE_APPROVAL + id + "?type=30");
  //   if (resp && resp.meta.code === 200) {
  //     reloadProfileAction(!reload);
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };

  return (
    <Tab.Pane eventKey={"photos"}>
      <Row className="form-group">
        <Col xl={12}>
          <Row className="d-flex justify-content-center">
            <Col md={4}>
              <div className=" image_upload_wrapper">
                <ProfileImageUpload
                  photos={profile?.photos}
                  gender={profile?.basic?.gender}
                  profile={profile}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xl={3}>
              <Form.Label>Profile Image Upload</Form.Label>
            </Col>
            <Col xl={7}>
              <Row>
                <Col xl={8}>
                  <Form.Control
                    onChange={(e) => handleUploadImgChange(e)}
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                  />
                </Col>
              </Row>
              <ModalCommon
                handleClose={handleUploadImgHide}
                show={isUploadImg}
                size={"lg"}
                modalTitle={modelTitle}
                closeButton={true}
              >
                <div className="row">
                  <div className="col-md-6">
                    {!!imgSrc && (
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        minHeight={300}
                        minWidth={300}
                      >
                        <img
                          ref={imgRef}
                          alt="Crop me"
                          src={imgSrc}
                          style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                          }}
                          onLoad={onImageLoad}
                          className="w-100"
                        />
                      </ReactCrop>
                    )}
                    <button
                      onClick={onDownloadCropClick}
                      className="btn btn-success d-flex align-items-center btn-sm mt-2"
                      disabled={isUploaded}
                    >
                      {isUploaded && (
                        <Spinner
                          size="sm"
                          animation="border"
                          className="mx-1"
                        />
                      )}
                      Confirm
                    </button>
                  </div>
                  <div className="col-md-6">
                    <div className="crop_img_wrapper">
                      <canvas
                        ref={previewCanvasRef}
                        style={{
                          border: "1px solid black",
                          objectFit: "contain",
                          width: completedCrop?.width,
                          height: completedCrop?.height,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ModalCommon>
              {/* {previewImg && (
                <div className="d-block mt-3">
                  <div>
                    <img
                      src={previewImg}
                      width={250}
                      height={250}
                      alt="profile-img"
                    />
                  </div>
                  {!imageId && (
                    <Fragment>
                      <button
                        onClick={handleUploadImg}
                        className="btn btn-rounded btn-success btn-sm mt-2"
                        type="button"
                      >
                        Upload
                      </button>
                      <button
                        onClick={handleCancelBlogImg}
                        className="btn btn-rounded btn-danger btn-sm mt-2 mx-2"
                        type="button"
                      >
                        Cancel
                      </button>
                    </Fragment>
                  )}
                </div>
              )} */}
            </Col>
          </Row>
        </Col>
        {/* <Col xl={12}>
          <h4>
            <u>Images</u>
          </h4>
          {loading && (
            <div className="d-flex justify-content-center">
              <h3>Loading</h3>
            </div>
          )}
          {!loading && (
            <Row className="form-group">
              {images &&
                images.length > 0 &&
                images?.map((ele) => {
                  const { originalImage, imagePath, approvalStatus } = ele;
                  return (
                    <Col md={3}>
                      <div className="profile-upload-image-wrapper">
                        <ImageFallback
                          gender={profile?.basic?.gender}
                          src={imageDomain + imagePath + originalImage}
                          alt={"profile-image"}
                          className="w-100"
                        />
                        {getCommonDataValOfImageStatus(approvalStatus)}
                      </div>
                    </Col>
                  );
                })}
              {images.length === 0 && (
                <div className="m-auto text-secondary">
                  <h6 className="mt-2">No images uploaded</h6>
                </div>
              )}
            </Row>
          )}
          <h4>
            <u>Waiting for approval</u>
          </h4>
          {!loading && (
            <Row className="form-group">
              {waitingApprovalimgs &&
                waitingApprovalimgs.length > 0 &&
                waitingApprovalimgs.map((ele) => {
                  const { originalImage, imagePath, _id } = ele;
                  return (
                    <Col md={3} className="form-group">
                      <ImageFallback
                        gender={profile?.basic?.gender}
                        src={imageDomain + imagePath + originalImage}
                        alt={"profile-image"}
                        className="w-100"
                      />
                      <div className="d-flex justify-content-between mt-2">
                        <button
                          onClick={() => handleApprove(_id)}
                          className="text-white btn btn-sm bg-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(_id)}
                          className="text-white btn btn-sm bg-danger"
                        >
                          Reject
                        </button>
                      </div>
                    </Col>
                  );
                })}
              {waitingApprovalimgs.length === 0 && (
                <div className="m-auto text-secondary">
                  <h6 className="mt-2">No pending approvals</h6>
                </div>
              )}
            </Row>
          )}
        </Col> */}
      </Row>
    </Tab.Pane>
  );
};

const mapDispatchToProps = {
  reloadProfileAction,
};

export default connect(null, mapDispatchToProps)(Photos);
