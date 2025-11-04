import { Card, Col, Form, Row } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { commonService, masterService } from "core/services";
import {
  PLAN_CREATE,
  PLAN_GET_BY_ID,
  PLAN_UPDATE,
} from "core/services/apiURL.service";
import { utils } from "core/helper";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PLAN_PATH } from "pages/routes/routes";
import { isShowFrontPage } from "core/helper/constants";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .typeError("Price is required")
    .required("Price is required"),
  validity: Yup.string().required("Validity is required"),
  isShowFrontPage: Yup.string().label("Show in display").required(),
  noOfContactsToView: Yup.number()
    .typeError("Invalid Contacts view")
    .required("Contacts view count is required"),
  discountValue: Yup.number()
    .typeError("Invalid Discount Value")
    .required("Discount Value is required"),
  discountType: Yup.string().required("Discount type is required").nullable(),
  isPremiumPlan: Yup.string().nullable().required("isPremiumPlan is required"),

  getInstantMsgFormContactViews: Yup.string()
    .nullable()
    .required("Instant message is required"),
  featuredPremiumProfile: Yup.string()
    .nullable()
    .required("featured premium profiles is required"),
  sendPersonalizedMessage: Yup.string()
    .nullable()
    .required("Personal message is required"),
  cupidMatchMaking: Yup.string()
    .nullable()
    .required("Match making is required"),

  isProfileVisibleToAll: Yup.string()
    .nullable()
    .required("Profile visible is required"),
  shorlistedContactsSeek: Yup.string()
    .nullable()
    .required("Contact seek is required"),
  browseProfilesAtTFMPremises: Yup.string()
    .nullable()
    .required("Browse profiles premises is required"),
  personalGuideToBrowseProfilesAtTFMPremises: Yup.string()
    .nullable()
    .required("Personal guide is required"),
  handPickedProfilesByTFM: Yup.string()
    .nullable()
    .required("Picked profile is required"),
  provideSpaceForMeeting: Yup.string()
    .nullable()
    .required("Space for meeting is required"),
  upMarketTagging: Yup.string()
    .nullable()
    .required("Market tagging is required"),
  promientDisplay: Yup.string()
    .nullable()
    .required("Promient display is required"),
  prayerAssurance: Yup.string()
    .nullable()
    .required("Prayer assurance is required"),
  personalisedMatrimonyService: Yup.string()
    .nullable()
    .required("Personal matrimony service is required"),

  status: Yup.string().label("Status").required(),
});

const plan = {
  isPremiumPlan: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  getInstantMsgFormContactViews: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  featuredPremiumProfile: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  sendPersonalizedMessage: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  cupidMatchMaking: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  isProfileVisibleToAll: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  shorlistedContactsSeek: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  browseProfilesAtTFMPremises: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  personalGuideToBrowseProfilesAtTFMPremises: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  handPickedProfilesByTFM: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  provideSpaceForMeeting: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  upMarketTagging: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  promientDisplay: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  prayerAssurance: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  personalisedMatrimonyService: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
};

const AddPlan = () => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { _id } = useParams();
  const isAddMode = !_id;
  const navigate = useNavigate();

  const onSubmit = (values) => {
    isAddMode ? onPlanSubmit(values) : updatePlan(_id, values);
  };

  const onPlanSubmit = async (values) => {
    delete values.userStatus;
    const payload = { ...values };

    payload.isPremiumPlan = payload.isPremiumPlan === "true";

    payload.getInstantMsgFormContactViews =
      payload.getInstantMsgFormContactViews === "true";
    payload.featuredPremiumProfile = payload.featuredPremiumProfile === "true";
    payload.sendPersonalizedMessage =
      payload.sendPersonalizedMessage === "true";
    payload.cupidMatchMaking = payload.cupidMatchMaking === "true";

    payload.isProfileVisibleToAll = payload.isProfileVisibleToAll === "true";
    payload.shorlistedContactsSeek = payload.shorlistedContactsSeek === "true";
    payload.browseProfilesAtTFMPremises =
      payload.browseProfilesAtTFMPremises === "true";
    payload.personalGuideToBrowseProfilesAtTFMPremises =
      payload.personalGuideToBrowseProfilesAtTFMPremises === "true";
    payload.handPickedProfilesByTFM =
      payload.handPickedProfilesByTFM === "true";
    payload.provideSpaceForMeeting = payload.provideSpaceForMeeting === "true";
    payload.upMarketTagging = payload.upMarketTagging === "true";
    payload.promientDisplay = payload.promientDisplay === "true";
    payload.prayerAssurance = payload.prayerAssurance === "true";
    payload.personalisedMatrimonyService =
      payload.personalisedMatrimonyService === "true";

    // return false
    const resp = await commonService.create(PLAN_CREATE, payload);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      reset();
      navigate(PLAN_PATH);
    }
  };

  const updatePlan = async (id, values) => {
    const resp = await masterService.update(PLAN_UPDATE + "/" + id, values);
    if (resp && resp?.meta?.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      navigate(PLAN_PATH);
    }
  };

  const getPlanById = async () => {
    const resp = await commonService.getById(PLAN_GET_BY_ID + _id);
    if (resp && resp.meta?.code === 200) {
      setFormValues(resp?.data);
    }
  };

  const setFormValues = (data) => {
    const fields = [
      "name",
      "price",
      "validity",
      "discountType",
      "discountValue",
      "noOfContactsToView",
      "isShowFrontPage",
    ];
    setValue("isPremiumPlan", data?.isPremiumPlan?.toString());
    setValue(
      "sendPersonalizedMessage",
      data?.sendPersonalizedMessage?.toString()
    );
    setValue("cupidMatchMaking", data?.cupidMatchMaking?.toString());
    setValue(
      "getInstantMsgFormContactViews",
      data?.getInstantMsgFormContactViews?.toString()
    );
    setValue(
      "featuredPremiumProfile",
      data?.featuredPremiumProfile?.toString()
    );
    setValue("isProfileVisibleToAll", data?.isProfileVisibleToAll?.toString());
    setValue(
      "shorlistedContactsSeek",
      data?.shorlistedContactsSeek?.toString()
    );
    setValue(
      "personalGuideToBrowseProfilesAtTFMPremises",
      data?.personalGuideToBrowseProfilesAtTFMPremises?.toString()
    );
    setValue(
      "browseProfilesAtTFMPremises",
      data?.browseProfilesAtTFMPremises?.toString()
    );
    setValue(
      "handPickedProfilesByTFM",
      data?.handPickedProfilesByTFM?.toString()
    );
    setValue(
      "provideSpaceForMeeting",
      data?.provideSpaceForMeeting?.toString()
    );
    setValue("upMarketTagging", data?.upMarketTagging?.toString());
    setValue("promientDisplay", data?.promientDisplay?.toString());
    setValue("prayerAssurance", data?.prayerAssurance?.toString());
    setValue(
      "personalisedMatrimonyService",
      data?.personalisedMatrimonyService?.toString()
    );
    setValue("status", data?.status);
    fields.forEach((field) =>
      setValue(field, data[field], { shouldValidate: true })
    );
  };

  useEffect(() => {
    if (!isAddMode) {
      getPlanById();
    }
  }, [isAddMode]);

  return (
    <Fragment>
      <BreadCrumb
        pageFor={isAddMode ? "Add Plan" : "Edit Plan"}
        listUrl="Add Plan"
      />
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="form-group">
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Name <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <Form.Control
                      type="text"
                      {...register("name")}
                      placeholder="Plan Name"
                    />
                    <p className="text-danger">{errors?.name?.message}</p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Price <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <Form.Control
                      type="number"
                      className="custome_num_input"
                      {...register("price")}
                      placeholder="Price"
                    />
                    <p className="text-danger">{errors?.price?.message}</p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Validity <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    {/* <Form.Control
                      type="tel"
                      {...register("validity")}
                      placeholder="Validity"
                    /> */}
                    <Form.Select
                      {...register("validity")}
                      className="form-control"
                    >
                      <option value={""}>Select</option>
                      {commonData?.planValidityTypes?.map((ele, ind) => (
                        <option value={ele.code} key={ind}>
                          {ele.label}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger">{errors?.validity?.message}</p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      No Of Contacts View <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <Form.Control
                      type="tel"
                      {...register("noOfContactsToView")}
                      placeholder="No Of Contacts View"
                    />
                    <p className="text-danger">
                      {errors?.noOfContactsToView?.message}
                    </p>
                  </Col>
                </Row>
              </Col>

              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Discount Value <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <Form.Control
                      type="tel"
                      {...register("discountValue")}
                      placeholder="Discount Value"
                    />
                    <p className="text-danger">
                      {errors?.discountValue?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Discount Type <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="form-check-align">
                      <Form.Select
                        {...register("discountType")}
                        className="form-control"
                      >
                        <option value="">--Select</option>
                        {commonData?.discountType?.map((ele, ind) => (
                          <option key={ind} value={ele.code}>
                            {ele.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <p className="text-danger">
                      {errors?.discountType?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Is Premium Plan <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.isPremiumPlan?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="isPremiumPlan"
                              {...register("isPremiumPlan")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.isPremiumPlan?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Plan Status <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="form-check-align">
                      <Form.Select
                        {...register("status")}
                        className="form-control"
                      >
                        <option value="">--Select</option>
                        {commonData?.userStatus?.map((ele, ind) => (
                          <option key={ind} value={ele.code}>
                            {ele.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <p className="text-danger">{errors?.status?.message}</p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Personalized Message <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.sendPersonalizedMessage?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="sendPersonalizedMessage"
                              {...register("sendPersonalizedMessage")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.sendPersonalizedMessage?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Cupid Match Making <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.cupidMatchMaking?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="cupidMatchMaking"
                              {...register("cupidMatchMaking")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.cupidMatchMaking?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Message Form Contact Views <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.getInstantMsgFormContactViews?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="getInstantMsgFormContactViews"
                              {...register("getInstantMsgFormContactViews")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.getInstantMsgFormContactViews?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Featured Premium Profiles <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.featuredPremiumProfile?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="featuredPremiumProfile"
                              {...register("featuredPremiumProfile")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.featuredPremiumProfile?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Show in Display <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <Form.Select
                      {...register("isShowFrontPage")}
                      className="form-control"
                    >
                      <option value={""}>Select</option>
                      {isShowFrontPage.map((ele, ind) => (
                        <option key={ind} value={ele.value}>
                          {ele.label}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger">
                      {errors?.isShowFrontPage?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <h4>Informational</h4>
            <Row className="form-group">
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Profiles To View All <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.isProfileVisibleToAll?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="isProfileVisibleToAll"
                              {...register("isProfileVisibleToAll")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.isProfileVisibleToAll?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Shortlisted Contacts Seek <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.shorlistedContactsSeek?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="shorlistedContactsSeek"
                              {...register("shorlistedContactsSeek")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.shorlistedContactsSeek?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Profiles At TFM Premises <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.browseProfilesAtTFMPremises?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="browseProfilesAtTFMPremises"
                              {...register("browseProfilesAtTFMPremises")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.browseProfilesAtTFMPremises?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Guide To Browse Profiles <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.personalGuideToBrowseProfilesAtTFMPremises?.map(
                        (ele, ind) => (
                          <Form.Check key={ind} className="form-check-align">
                            <Form.Check.Label>
                              <Form.Check.Input
                                type="radio"
                                name="personalGuideToBrowseProfilesAtTFMPremises"
                                {...register(
                                  "personalGuideToBrowseProfilesAtTFMPremises"
                                )}
                                value={ele.value}
                              />
                              <i className="input-helper"></i> {ele.label}
                            </Form.Check.Label>
                          </Form.Check>
                        )
                      )}
                    </div>
                    <p className="text-danger">
                      {errors?.shorlistedContactsSeek?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Hand Picked Profiles By TFM <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.handPickedProfilesByTFM?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="handPickedProfilesByTFM"
                              {...register("handPickedProfilesByTFM")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.handPickedProfilesByTFM?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Provide Space For Meeting <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.provideSpaceForMeeting?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="provideSpaceForMeeting"
                              {...register("provideSpaceForMeeting")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.provideSpaceForMeeting?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      UpMarket Tagging <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.upMarketTagging?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="upMarketTagging"
                              {...register("upMarketTagging")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.upMarketTagging?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Promient Display <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.promientDisplay?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="promientDisplay"
                              {...register("promientDisplay")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.promientDisplay?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label>
                      Prayer Assurance <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.prayerAssurance?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="prayerAssurance"
                              {...register("prayerAssurance")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.prayerAssurance?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6}>
                <Row>
                  <Col xl={5} sm={4} lg={4}>
                    <Form.Label className="text-nowrap">
                      Personal Matrimony Service <Required />
                    </Form.Label>
                  </Col>
                  <Col xl={7} sm={8} lg={8}>
                    <div className="d-flex justify-content-start">
                      {plan?.personalisedMatrimonyService?.map((ele, ind) => (
                        <Form.Check key={ind} className="form-check-align">
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="personalisedMatrimonyService"
                              {...register("personalisedMatrimonyService")}
                              value={ele.value}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </div>
                    <p className="text-danger">
                      {errors?.personalisedMatrimonyService?.message}
                    </p>
                  </Col>
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
            <Link to={PLAN_PATH} className="btn btn-rounded btn-danger">
              Cancel
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddPlan;
