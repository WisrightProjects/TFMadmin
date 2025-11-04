import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { CONST, utils } from "core/helper";
import { masterService, userService, usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  COMMUNITY_URL,
  LANGUAGE_URL,
  RELIGION_URL,
} from "core/services/apiURL.service";
import Required from "components/common/required";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";

const isLivingWithFamily = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

let isValidEmail = "";
let emailValid = true;

let validPhone = "";
let isPhoneValid = false;

const BasicInfo = (props) => {
  const { profileID, profile } = props;
  const commonData = useSelector((state) => state.common?.commonData);
  const [userMobileVal, setUserMobileVal] = useState("");
  const [communityForRegligionFilter] = useState({
    ...CONST.DEFAULT_ADV_FILTER,
  });
  const [langFilter] = useState({ ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER });
  const [subCommunityFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [religion, setReligion] = useState([]);
  const [religionFilter] = useState({ ...CONST.DEFAULT_RELIGION_FILTER });
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedSubCommunity, setSelectedSubCommunity] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const getCommonDataVal = (key, value) => {
    const data = commonData[key]?.find((ele) => ele.code === value);
    return data ? data?.label : "";
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .label("Email")
      .required()
      .test("Check email", "Email exists", async (value) => {
        if (isValidEmail !== value) {
          const payload = {
            email: value,
            profileId: profileID,
          };
          const resp = await userService.isValid(payload);
          isValidEmail = value;
          emailValid = resp?.data ? false : true;
        }
        return emailValid;
      }),
    phone: Yup.string()
      .min(10, "Minmum number is required")
      // .matches(CONST.PHONE_IND_REGEX, "Phone number is not valid")
      .label("Phone")
      .required()
      .test("Check Phone", "Phone number exists", async (value) => {
        if (value && validPhone !== value) {
          const resp = await userService.isValid({
            phone: value?.toString(),
            profileId: profileID,
          });
          validPhone = value;
          isPhoneValid = resp?.data ? false : true;
        }
        return isPhoneValid;
      }),
    name: Yup.string()
      .matches(CONST.NAME_REGEX, CONST.MSG.INVALID_NAME)
      .min(3, CONST.MSG.MIN_CHAR)
      .max(30, CONST.MSG.MAX_CHAR_FOR_PROFILE_NAME)
      .required("Profile name is required"),
    basic: Yup.object().shape({
      profileFor: Yup.string(),
      gender: Yup.string().nullable(),
      isLivingWithFamily: Yup.string().nullable(),
      diet: Yup.string().nullable(),
      dateOfBirth: Yup.string(),
      maritalStatus: Yup.string(),
      religion: Yup.string(),
      community: Yup.string(),
      sub_community: Yup.string(),
      language: Yup.string(),
      aboutYourSelf: Yup.string(),
      height: Yup.string(),
      bloodGroup: Yup.string(),
    }),
  });

  const loadReligion = async (religionFilter) => {
    religionFilter.filter = {};
    const resp = await masterService.getAllPost(
      RELIGION_URL + "/filter",
      religionFilter
    );
    setReligion(resp?.data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });
  console.log("erros::", errors);

  const religionValue = getValues("basic.religion");
  const communityValue = getValues("basic.community");
  console.log("religionValue::", religionValue);
  const religionWatch = watch("basic.religion");

  const handleMobileNoChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setUserMobileVal(e.target.value);
      setValue("phone", e.target.value);
    }
  };

  const loadCommunityOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      if (
        religionValue === undefined ||
        religionValue === "" ||
        religionValue === null
      ) {
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
    console.log("option::", option);
    if (option) {
      if (!option.__isNew__) {
        const { value, label } = option;
        setValue("basic.community", option.value, { shouldValidate: true });
        setSelectedCommunity({
          label: label,
          value: value,
        });
      } else {
        const payload = {
          religion: religionValue,
          community: option.value,
        };
        const resp = await masterService.getAllPost(COMMUNITY_URL, payload);
        if (resp && resp.meta.code === 200) {
          setValue("basic.community", resp.data._id, { shouldValidate: true });
          utils.showSuccessMsg("community created");
          // loadAllCommunity();
          setSelectedCommunity({
            label: resp.data?.community,
            value: resp.data?._id,
          });
        } else {
          utils.showErrMsg("error in creating community");
        }
      }
      setSelectedSubCommunity(null);
      setValue("basic.sub_community", "");
    } else {
      setValue("basic.community", "");
      setSelectedCommunity(null);
      setSelectedSubCommunity(null);
      setValue("basic.sub_community", "");
    }
  };

  const loadSubCommunityOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      // perform a request
      if (
        !religionValue ||
        religionValue === "" ||
        religionValue === null ||
        !communityValue ||
        communityValue === "" ||
        communityValue === null
      ) {
        resolve([]);
        return false;
      } else {
        subCommunityFilter.filter = {
          religion: [religionValue],
          parentCommunity: [communityValue],
        };
      }

      subCommunityFilter.search = inputValue;
      let communityArr = [];
      const resp = await masterService.getAllPost(
        COMMUNITY_URL + "/filter",
        subCommunityFilter
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

  const handleSubCommunityChange = async (option) => {
    if (!option.__isNew__) {
      const { value, label } = option;
      setValue("basic.sub_community", option.value, { shouldValidate: true });
      setSelectedSubCommunity({
        label: label,
        value: value,
      });
    }
    if (option.__isNew__) {
      const payload = {
        religion: religionValue,
        parentCommunity: communityValue,
        community: option.value,
      };
      const resp = await masterService.getAllPost(COMMUNITY_URL, payload);
      if (resp && resp.meta.code === 200) {
        setValue("basic.sub_community", resp.data._id, {
          shouldValidate: true,
        });
        setSelectedSubCommunity({
          label: resp.data?.community,
          value: resp.data?._id,
        });
        utils.showSuccessMsg("sub community created");
      } else {
        setValue("sub_community", "");
      }
    }
  };

  const loadLanguageOptions = (inputValue) =>
    new Promise(async (resolve) => {
      if (inputValue) {
        langFilter.search = inputValue;
      }
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

  const handleLanguageChange = async (option) => {
    if (option === undefined) {
      return;
    }
    if (option) {
      setValue("basic.language", option.value, { shouldValidate: true });
      setSelectedLanguage({
        label: option.label,
        value: option.value,
      });
    } else {
      setValue("basic.language", "");
      setSelectedLanguage(null);
    }
  };

  const payloadValCheck = (key) => {
    Object.keys(key).map((val) => {
      if (key[val] === undefined || key[val] === null || key[val] === "") {
        delete key[val];
      }
    });
  };

  const setFormvalues = (values) => {
    console.log("values::", values);
    if (values) {
      const { name, email, phone } = values?.user;
      const {
        profileFor,
        gender,
        height,
        bloodGroup,
        dateOfBirth,
        isLivingWithFamily,
        maritalStatus,
        religion,
        diet,
        community,
        language,
        aboutYourSelf,
        sub_community,
      } = values.basic;
      setValue("basic", {
        profileFor,
        dateOfBirth,
        maritalStatus,
        gender: gender?.toString(),
        isLivingWithFamily: isLivingWithFamily,
        religion: religion?._id,
        community: community?._id,
        sub_community: sub_community?._id,
        language: language?._id,
        aboutYourSelf,
        diet: diet?.toString(),
        height,
        bloodGroup,
      });
      setValue("name", values?.name ? values?.name : name);
      setValue("email", email, { shouldValidate: true });
      setValue("phone", phone, { shouldValidate: true });
      setUserMobileVal(phone, { shouldValidate: true });
      setSelectedCommunity({
        label: community?.community,
        value: community?._id,
      });
      setSelectedSubCommunity({
        label: sub_community?.community,
        value: sub_community?._id,
      });
      setSelectedLanguage({
        label: language?.name,
        value: language?._id,
      });
    }
  };

  useEffect(() => {
    setFormvalues(profile);
  }, [profile]);

  const onSubmit = async (values) => {
    const { email, phone, name } = values;
    payloadValCheck(values.basic);
    const resp = await usersService.updateUser(
      {
        basic: values.basic,
        email,
        phone,
        name,
      },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  useEffect(() => {
    loadReligion(religionFilter);
  }, [religionFilter]);

  return (
    <Tab.Pane eventKey={"basic"}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Profile created by</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Select
                  {...register("basic.profileFor")}
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
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>
                  Profile name <Required />
                </Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  {...register("name")}
                  className="form-control"
                  type="text"
                  maxLength={30}
                />
                <p className="text-danger">{errors?.name?.message}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Gender</Form.Label>
              </Col>
              <Col xl={8} lg={6}>
                <strong>
                  <p className="text-medium">
                    {getCommonDataVal("gender", profile?.basic?.gender)}
                  </p>
                </strong>
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label className="label">Date of Birth </Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  {...register("basic.dateOfBirth")}
                  type="date"
                  max={utils.maxYear}
                  min={utils.minYear}
                  // disabled={true}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
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
                  type="text"
                  placeholder="Email"
                />
                <p className="text-danger">{errors.email?.message}</p>
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>
                  Phone <Required />
                </Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  {...register("phone")}
                  className="form-control"
                  type="text"
                  placeholder="Phone"
                  value={userMobileVal}
                  onChange={handleMobileNoChange}
                  maxLength={10}
                />
                <p className="text-danger">{errors.phone?.message}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Religion</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Select
                  {...register("basic.religion")}
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
              </Col>
            </Row>
          </Col>
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Community</Form.Label>
              </Col>
              <Col xl={8}>
                <AsyncCreatableSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCommunityOptions}
                  onChange={handleCommunityChange}
                  value={selectedCommunity}
                  isClearable
                  key={religionWatch}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Sub Community</Form.Label>
              </Col>
              <Col xl={8}>
                <AsyncCreatableSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadSubCommunityOptions}
                  onChange={handleSubCommunityChange}
                  key={communityValue}
                  value={selectedSubCommunity}
                  isClearable
                />
              </Col>
            </Row>
          </Col>
          <Col xl={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Language</Form.Label>
              </Col>
              <Col xl={8}>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadLanguageOptions}
                  isClearable
                  onChange={handleLanguageChange}
                  value={selectedLanguage}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>About Yourself</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Control
                  as={"textarea"}
                  rows="5"
                  {...register("basic.aboutYourSelf")}
                  className="form-control"
                  placeholder="About Yourself"
                />
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={5} className="label">
                <Form.Label>Living With Family</Form.Label>
              </Col>
              <Col xl={7} lg={7}>
                <div className="d-flex justify-content-start">
                  {isLivingWithFamily.map((ele, ind) => (
                    <Form.Check className="mx-1" key={ind}>
                      <Form.Check.Label>
                        <Form.Check.Input
                          type="radio"
                          name="isLivingWithFamily"
                          {...register("basic.isLivingWithFamily")}
                          value={ele.value}
                        />
                        <i className="input-helper"></i> {ele.label}
                      </Form.Check.Label>
                    </Form.Check>
                  ))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Marital status</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Select
                  {...register("basic.maritalStatus")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.maritalStatus &&
                    commonData.maritalStatus.map((ele, ind) => (
                      <option key={ind} value={ele.code}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Height</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Select
                  {...register("basic.height")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData?.heightTypes &&
                    commonData?.heightTypes.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>BloodGroup</Form.Label>
              </Col>
              <Col xl={8}>
                <Form.Select
                  {...register("basic.bloodGroup")}
                  className="form-control"
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData?.bloodGroup &&
                    commonData?.bloodGroup.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xl={12} md={12} lg={12}>
            <Row>
              <Col xl={2}>
                <Form.Label>Diet</Form.Label>
              </Col>
              <Col xl={10}>
                <div className="d-flex justify-content-start">
                  {commonData &&
                    commonData.dietTypes &&
                    commonData.dietTypes.map((ele, ind) => (
                      <Form.Check className="mx-1" key={ind}>
                        <Form.Check.Label>
                          <Form.Check.Input
                            type="radio"
                            name="diet"
                            {...register("basic.diet")}
                            value={ele.code}
                          />
                          <i className="input-helper"></i> {ele.label}
                        </Form.Check.Label>
                      </Form.Check>
                    ))}
                </div>
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
      </Form>
    </Tab.Pane>
  );
};

export default BasicInfo;
