import { Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState, Fragment, useRef } from "react";
import { utils, CONST } from "core/helper";
import { masterService, userService, usersService } from "core/services";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  COMMUNITY_URL,
  LANGUAGE_URL,
  RELIGION_URL,
  COUNTRY_PATH,
  COMMUNITY_FILTER,
} from "core/services/apiURL.service";
import { EDIT_PROFILE, PROFILES_PATH } from "pages/routes/routes";
import { connect, useSelector } from "react-redux";
import { reloadProfileAction } from "redux/action/account.action";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";
import BasicInfo from "components/profiles/user-profile/basic-info";
import Location from "components/profiles/user-profile/location";
import Education from "components/profiles/user-profile/education";
import Contact from "components/profiles/user-profile/contact";
import Family from "components/profiles/user-profile/family";
import Privacy from "components/profiles/user-profile/privacy";
import Photos from "components/profiles/user-profile/photos";
import DeleteProfile from "components/profiles/user-profile/delete-profile";
import Required from "components/common/required";
import UserIdentity from "components/profiles/user-profile/goverment-identity";

let validName = "";
let isNameValid = true;

let validEmail = "";
let isEmailValid = false;

let validPhone = "";
let isPhoneValid = false;

const validationSchema = Yup.object().shape(
  {
    name: Yup.string()
      .required("Name is required")
      .min(3, "Minimum 3 characters required")
      .max(25, "Maximum 25 character allowed")
      .test("Check Name", "User name exists", async (value) => {
        if (value !== "" && validName !== value) {
          const resp = await userService.isValid({ name: value });
          validName = value;
          isNameValid = resp?.data ? false : true;
        }
        return isNameValid;
      }),
    email: Yup.string()
      .required("Email is required")
      .email()
      .test("Check email", "Email exists", async (value) => {
        if (validEmail !== value) {
          const resp = await userService.isValid({ email: value });
          validEmail = value;
          isEmailValid = resp?.data ? false : true;
        }
        return isEmailValid;
      }),
    phone: Yup.string()
      .min(10, "Minmum number is required")
      .matches(CONST.PHONE_IND_REGEX, "Phone number is not valid")
      .required("Phone no is required")
      .test("Check Phone", "Phone number exists", async (value) => {
        if (validPhone !== value) {
          const resp = await userService.isValid({ phone: value?.toString() });
          validPhone = value;
          isPhoneValid = resp?.data ? false : true;
        }
        return isPhoneValid;
      }),
    phoneCode: Yup.string().required("Required"),
    profileFor: Yup.string().required("Profile for is required"),
    gender: Yup.string().nullable().required("Gender is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    maritalStatus: Yup.string().required("Marital status is required"),
    religion: Yup.string().required("Religion is required"),
    community: Yup.string().required("Community is required"),
    language: Yup.string().required("Language is required"),

    pwd: Yup.string()
      .required("Password is required")
      .min(8, "Minimum Characters is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPwd: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("pwd")], "Passwords does not match"),
  },
  ["religion"]
);

const AddProfile = (props) => {
  const { reloadProfileAction } = props;
  const reload = useSelector((state) => state?.common?.reload);
  const commonData = useSelector((state) => state?.common?.commonData);
  const navigate = useNavigate();

  const [mobileVal, setMobileVal] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [confirmPasswordToggle, setConfirmPasswordToggle] = useState(false);
  const [images, setImages] = useState([]);
  const [waitingApprovalimgs, setWaitingApprovalimgs] = useState([]);

  const handlePasswordToggle = () => setPasswordToggle(!passwordToggle);
  const handleConfirmPasswordToggle = () =>
    setConfirmPasswordToggle(!confirmPasswordToggle);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const religionWatch = watch("religion");
  const religionValue = getValues("religion");

  const { profileID } = useParams();
  const [searchParams] = useSearchParams();
  const isAddMode = !profileID;
  const mobileNoRef = useRef();

  const [religion, setReligion] = useState([]);
  const [countryPhoneCode, setCountryPhoneCode] = useState([]);
  const [profile, setProfile] = useState(null);

  const [religionFilter] = useState({ ...CONST.DEFAULT_RELIGION_FILTER });
  const [communityForRegligionFilter] = useState({
    ...CONST.DEFAULT_ADV_FILTER,
  });
  const [countryCodeFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [langFilter] = useState({ ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER });

  const handleChangeMobileNo = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setMobileVal(e.target.value);
      setValue("phone", e.target.value);
    }
  };

  const loadAllCommunity = async () => {
    const resp = await masterService.getAllPost(COMMUNITY_FILTER, {
      ...CONST.DEFAULT_ADV_FILTER,
    });
    if (resp && resp.data.code === 200) {
      return resp?.data;
    }
    return;
  };

  const loadReligion = async (religionFilter) => {
    religionFilter.filter = {};
    const resp = await masterService.getAllPost(
      RELIGION_URL + "/filter",
      religionFilter
    );
    setReligion(resp?.data);
  };

  const loadCommunityOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      if (religionValue === undefined || religionValue === "") {
        resolve([]);
        return false;
      }
      communityForRegligionFilter.filter = {
        religion: [religionValue],
      };
      communityForRegligionFilter.search = inputValue;
      let communityArr = [];
      const resp = await masterService.getAllPost(
        COMMUNITY_URL + "/filter",
        communityForRegligionFilter
      );
      if (resp && resp.meta.code === 200) {
        const { data: communityResp } = resp;
        communityArr = communityResp.map((ele) => ({
          value: ele._id,
          label: ele.community + "-" + ele.religion.name,
        }));
      }
      resolve(communityArr);
    });

  const handleCommunityChange = async (option) => {
    const religionValue = getValues("religion");
    if (option) {
      if (!option.__isNew__) {
        setValue("community", option.value, { shouldValidate: true });
      }
      if (option.__isNew__) {
        const payload = {
          religion: religionValue,
          community: option.value,
        };
        const resp = await masterService.getAllPost(COMMUNITY_URL, payload);
        if (resp && resp.meta.code === 200) {
          setValue("community", resp.data._id, { shouldValidate: true });
          utils.showSuccessMsg("community created");
          loadAllCommunity();
        } else {
          utils.showErrMsg("error in creating community");
        }
      }
    } else {
      setValue("community", "");
    }
  };

  const loadLanguageptions = async (inputValue) =>
    new Promise(async (resolve) => {
      langFilter.filter = {};
      langFilter.search = inputValue;
      let languageArr = [];
      const resp = await masterService.getAllPost(
        LANGUAGE_URL + "/filter",
        langFilter
      );
      if (resp && resp.meta.code === 200) {
        const { data: languageResp } = resp;
        languageArr = languageResp.map((ele) => ({
          value: ele._id,
          label: ele.name,
        }));
      }
      resolve(languageArr);
    });

  const handleLanguageChange = (option) => {
    if (option) {
      setValue("language", option.value);
    } else {
      setValue("language", "");
    }
  };

  const loadCountryWithPhoneCode = async (countryCodeFilter) => {
    countryCodeFilter.filter = {};
    const resp = await masterService.getAllPost(
      COUNTRY_PATH + "/filter",
      countryCodeFilter
    );
    if (resp && resp.meta.code === 200) {
      setCountryPhoneCode(resp?.data);
    }
  };

  const onSubmit = async (values) => {
    delete values.confirmPwd;
    const {
      email,
      phoneCode,
      phone,
      dateOfBirth,
      maritalStatus,
      pwd,
      profileFor,
      name,
      religion,
      community,
      language,
      gender,
    } = values;
    const payload = {
      email,
      phoneCode,
      phone: phone.toString(),
      dateOfBirth,
      maritalStatus,
      pwd,
      profileFor,
      name,
      religion,
      community,
      language,
      gender,
    };
    // return false
    const resp = await usersService.addUser(payload);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      utils.navigateTo(
        navigate(EDIT_PROFILE + "/" + resp.data.profile.profileID)
      );
    }
  };

  useEffect(() => {
    if (commonData) {
      loadCountryWithPhoneCode(countryCodeFilter);
      loadReligion(religionFilter);
    }
  }, [commonData]);

  async function getUserById(profileID) {
    const resp = await usersService.getUser(profileID);
    const imagesArr = [];
    const unApprovedImagesArr = [];
    if (resp && resp.meta.code === 200) {
      //   setFormvalues(resp?.data);
      reloadProfileAction(!reload);
      setProfile(resp?.data);

      if (resp.data?.photos && resp.data.photos?.length > 0) {
        resp.data?.photos.map((ele) => {
          const { approvalStatus } = ele;
          if (approvalStatus === 10) {
            unApprovedImagesArr.push(ele);
          } else if (
            !approvalStatus ||
            approvalStatus === 20 ||
            approvalStatus === 30
          ) {
            imagesArr.push(ele);
          }
        });
      }
      setImages(imagesArr);
      setWaitingApprovalimgs(unApprovedImagesArr);
    }
  }

  useEffect(() => {
    if (profileID && profileID !== undefined) {
      getUserById(profileID);
    }
  }, [profileID]);

  useEffect(() => {
    if (profileID) {
      async function getUserById(profileID) {
        const resp = await usersService.getUser(profileID);
        const imagesArr = [];
        const unApprovedImagesArr = [];
        if (resp && resp.meta.code === 200) {
          setProfile(resp?.data);
          if (resp.data?.photos && resp.data.photos?.length > 0) {
            resp.data?.photos.map((ele) => {
              const { approvalStatus } = ele;
              if (approvalStatus === 10) {
                unApprovedImagesArr.push(ele);
              } else if (
                !approvalStatus ||
                approvalStatus === 20 ||
                approvalStatus === 30
              ) {
                imagesArr.push(ele);
              }
            });
          }
          setImages(imagesArr);
          setWaitingApprovalimgs(unApprovedImagesArr);
        }
      }
      getUserById(profileID);
    }
  }, [reload]);

  return (
    <Fragment>
      <BreadCrumb
        pageFor={(isAddMode ? "Add" : "Edit") + " Profile"}
        listUrl={(isAddMode ? "Add" : "Edit") + " Profile"}
      />
      <Card>
        <Card.Body>
          <Tab.Container
            defaultActiveKey={searchParams.size !== 0 ? "photos" : "basic"}
            className="tab-custom-pills-horizontal"
          >
            <div className="tab-custom-pills-horizontal">
              <Row>
                <Col md={12}>
                  <Nav variant="pills" className="edit_profile_nav-items">
                    {isAddMode ? (
                      <Nav.Item>
                        <Nav.Link eventKey={"basic"}>Basic Info</Nav.Link>
                      </Nav.Item>
                    ) : (
                      <Fragment>
                        <Nav.Item>
                          <Nav.Link eventKey={"basic"}>Basic Info</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={"location"}>Location</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={"education"}>Education</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={"contact"}>
                            Contact Details
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={"family"}>Family</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={"privacy"}>Privacy</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={"photos"}>Photos</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                          <Nav.Link eventKey={"goverment-identity"}>
                            Goverment Identity
                          </Nav.Link>
                        </Nav.Item> */}
                        <Nav.Item>
                          <Nav.Link eventKey={"delete-profile"}>
                            Delete Profile
                          </Nav.Link>
                        </Nav.Item>
                      </Fragment>
                    )}
                  </Nav>
                </Col>
                <Col md={12}>
                  <Tab.Content>
                    {isAddMode ? (
                      <Tab.Pane eventKey={"basic"}>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                          <Row className="form-group">
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Name <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Form.Control
                                    {...register("name")}
                                    className="form-control"
                                    type="text"
                                    placeholder="Name"
                                    maxLength={25}
                                  />
                                  <p className="text-danger">
                                    {errors.name?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Email <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Form.Control
                                    {...register("email")}
                                    className="form-control"
                                    type="email"
                                    placeholder="Email"
                                  />
                                  <p className="text-danger">
                                    {errors.email?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Profile For <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Form.Select
                                    {...register("profileFor")}
                                    className="form-control"
                                  >
                                    <option value="">Select</option>
                                    {commonData &&
                                      commonData?.profileFor &&
                                      commonData?.profileFor.map((ele, ind) => (
                                        <option value={ele.code} key={ind}>
                                          {ele.label}
                                        </option>
                                      ))}
                                  </Form.Select>
                                  <p className="text-danger">
                                    {errors.profileFor?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Gender <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8} lg={6}>
                                  <div className="d-flex justify-content-start">
                                    {commonData &&
                                      commonData.gender &&
                                      commonData.gender.map((ele, ind) => (
                                        <Form.Check key={ind} className="mx-1">
                                          <Form.Check.Label>
                                            <Form.Check.Input
                                              type="radio"
                                              name="gender"
                                              {...register("gender")}
                                              value={ele.code}
                                            />
                                            <i className="input-helper"></i>{" "}
                                            {ele.label}
                                          </Form.Check.Label>
                                        </Form.Check>
                                      ))}
                                  </div>
                                  <p className="text-danger">
                                    {errors.gender?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label className="label">
                                    Date of Birth <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Form.Control
                                    {...register("dateOfBirth")}
                                    type="date"
                                    max={utils.maxYear}
                                    min={utils.minYear}
                                  />
                                  <p className="text-danger">
                                    {errors.dateOfBirth?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Marital status <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Form.Select
                                    {...register("maritalStatus")}
                                    className="form-control"
                                  >
                                    <option value="">Select</option>
                                    {commonData &&
                                      commonData.maritalStatus &&
                                      commonData.maritalStatus.map(
                                        (ele, ind) => (
                                          <option key={ind} value={ele.code}>
                                            {ele.label}
                                          </option>
                                        )
                                      )}
                                  </Form.Select>
                                  <p className="text-danger">
                                    {errors.maritalStatus?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Phone <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Row>
                                    <Col xl={5}>
                                      <Form.Select
                                        {...register("phoneCode")}
                                        className="form-control"
                                      >
                                        <option value="">Select</option>
                                        {countryPhoneCode &&
                                          countryPhoneCode.map((ele, idx) => (
                                            <option
                                              key={idx}
                                              value={ele.phoneCode}
                                            >
                                              {ele.name +
                                                "(" +
                                                ele.phoneCode +
                                                ")"}
                                            </option>
                                          ))}
                                        {/* <option value="+91">+ 91</option> */}
                                      </Form.Select>
                                      <p className="text-danger">
                                        {errors.phoneCode?.message}
                                      </p>
                                    </Col>
                                    <Col xl={7}>
                                      <Form.Control
                                        {...register("phone")}
                                        type="text"
                                        placeholder="Phone"
                                        className="form-control custome_num_input"
                                        pattern="[0-9]*"
                                        value={mobileVal}
                                        onChange={handleChangeMobileNo}
                                        maxLength={10}
                                        ref={mobileNoRef}
                                      />
                                      <p className="text-danger">
                                        {errors.phone?.message}
                                      </p>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Religion <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <Form.Select
                                    {...register("religion")}
                                    className="form-control"
                                  >
                                    <option value=""> Select</option>
                                    {religion &&
                                      religion.map((ele, ind) => (
                                        <option value={ele._id} key={ind}>
                                          {ele.name}
                                        </option>
                                      ))}
                                  </Form.Select>
                                  <p className="text-danger">
                                    {errors.religion?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Community <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <AsyncCreatableSelect
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadCommunityOptions}
                                    onChange={handleCommunityChange}
                                    isClearable
                                    // value={selectedCommunity}
                                    key={religionWatch}
                                    isDisabled={
                                      !religionValue ||
                                      religionValue === "" ||
                                      religionValue === null
                                    }
                                  />
                                  <p className="text-danger">
                                    {errors.community?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Language <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8}>
                                  <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadLanguageptions}
                                    isClearable
                                    onChange={handleLanguageChange}
                                  />
                                  <p className="text-danger">
                                    {errors.language?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label>
                                    Password <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8} className="staff_password_input">
                                  <Form.Control
                                    {...register("pwd")}
                                    className="form-control"
                                    placeholder="Password"
                                    type={passwordToggle ? "text" : "password"}
                                    maxLength={20}
                                  />
                                  {passwordToggle ? (
                                    <i
                                      onClick={handlePasswordToggle}
                                      className="mdi mdi-eye"
                                    ></i>
                                  ) : (
                                    <i
                                      onClick={handlePasswordToggle}
                                      className="mdi mdi-eye-off"
                                    ></i>
                                  )}
                                  <p className="text-danger">
                                    {errors.pwd?.message}
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={6} md={6} lg={6}>
                              <Row>
                                <Col xl={4}>
                                  <Form.Label className="text-nowrap">
                                    Confirm Password <Required />
                                  </Form.Label>
                                </Col>
                                <Col xl={8} className="staff_password_input">
                                  <Form.Control
                                    {...register("confirmPwd")}
                                    // type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    type={
                                      confirmPasswordToggle
                                        ? "text"
                                        : "password"
                                    }
                                    maxLength={20}
                                  />
                                  {confirmPasswordToggle ? (
                                    <i
                                      onClick={handleConfirmPasswordToggle}
                                      className="mdi mdi-eye"
                                    ></i>
                                  ) : (
                                    <i
                                      onClick={handleConfirmPasswordToggle}
                                      className="mdi mdi-eye-off"
                                    ></i>
                                  )}
                                  <p className="text-danger">
                                    {errors.confirmPwd?.message}
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
                          <Link
                            to={PROFILES_PATH}
                            className="btn btn-rounded btn-danger"
                          >
                            Cancel
                          </Link>
                        </Form>
                      </Tab.Pane>
                    ) : (
                      <Fragment>
                        <BasicInfo profile={profile} profileID={profileID} />
                        <Location profile={profile} profileID={profileID} />
                        <Education profile={profile} profileID={profileID} />
                        <Contact profile={profile} profileID={profileID} />
                        <Family profile={profile} profileID={profileID} />
                        <Privacy profile={profile} profileID={profileID} />
                        <Photos
                          profile={profile}
                          profileID={profileID}
                          images={images}
                          waitingApprovalimgs={waitingApprovalimgs}
                        />
                        {/* <UserIdentity profile={profile} profileID={profileID} /> */}
                        <DeleteProfile
                          profile={profile}
                          profileID={profileID}
                        />
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

const mapDispatchToProps = {
  reloadProfileAction,
};

export default connect(null, mapDispatchToProps)(AddProfile);
