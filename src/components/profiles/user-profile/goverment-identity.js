// import { Card, Col, Form, Row, Tab } from "react-bootstrap";
// import { Fragment, useState } from "react";
// import { useForm } from "react-hook-form";
// import BreadCrumb from "components/common/breadcrumb";
// import { commonService, masterService } from "core/services";
// import { utils, CONST } from "core/helper";
// import { COLLAGE_URL } from "core/services/apiURL.service";
// import { useSelector } from "react-redux";
// import ImageFallback from "components/common/imageFallback";

// const UserIdentity = (props) => {
//   const { profile, profileID } = props;
//   const [pageFor] = useState("User Identity");
//   const commonData = useSelector((state) => state?.common?.commonData);

//   const handleDownloadIdentity = async () => {
//     const resp =
//       imageDomain +
//       profile?.proof?.images?.[0]?.imagePath +
//       "/" +
//       profile?.proof?.images?.[0]?.originalImage;
//     if (resp !== "") {
//       fetch(resp).then((response) => {
//         response.blob().then((blob) => {
//           // Creating new object of PDF file
//           const fileURL = window.URL.createObjectURL(blob);
//           // Setting various property values
//           const [src, extension] =
//             profile?.proof?.images?.[0]?.originalImage?.split(".");
//           console.log("extension::", extension);
//           let link = document.createElement("a");

//           link.href = fileURL;
//           link.download = `${profileID}-Goverment-identity.${extension}`;
//           link.click();
//         });
//       });
//       utils.showSuccessMsg(resp?.meta?.message);
//     }
//   };

//   const getCommonDataVal = (key, value) => {
//     console.log("key::", key);
//     const data = commonData?.[key]?.find((ele) => ele.code === value);
//     console.log("data::", data);
//     return data ? data?.name : "";
//   };

//   return (
//     <Tab.Pane eventKey={"goverment-identity"}>
//       <div className="d-flex justify-content-between">
//         <h6>Goverment Identity</h6>
//         {profile?.proof && (
//           <button
//             onClick={handleDownloadIdentity}
//             type="button"
//             className="btn btn-rounded btn-success"
//           >
//             Download
//           </button>
//         )}
//       </div>
//       {!profile?.proof && (
//         <div className="my-3">
//           <p className="fs-1 text-center">
//             Enhance your profile by securely submitting the required documents.
//             Please upload your goverment identity.
//           </p>
//         </div>
//       )}
//       {profile?.proof && (
//         <Fragment>
//           <Row className="form-group mt-4">
//             <Col xl={2} md={3} lg={4}>
//               <Form.Label>Proof Type</Form.Label>
//             </Col>
//             <Col xl={6} md={6} lg={4}>
//               <Form.Label>
//                 {getCommonDataVal("proofDocTypes", profile?.proof?.code)}
//               </Form.Label>
//             </Col>
//           </Row>
//           {/* <Row className="form-group">
//             <Col xl={2} md={3} lg={4}>
//               <Form.Label>Identity</Form.Label>
//             </Col>
//             <Col xl={6} md={6} lg={4}>
//               <div className="goverment-identity-wrapper">
//                 <ImageFallback
//                   gender={profile?.basic?.gender}
//                   src={
//                     imageDomain +
//                     profile?.proof?.images?.[0]?.imagePath +
//                     "/" +
//                     profile?.proof?.images?.[0]?.originalImage
//                   }
//                   alt={"profile-image"}
//                   className="w-100"
//                 />
//               </div>
//             </Col>
//           </Row> */}
//         </Fragment>
//       )}
//     </Tab.Pane>
//   );
// };

// export default UserIdentity;
