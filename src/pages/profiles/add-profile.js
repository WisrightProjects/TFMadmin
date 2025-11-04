import { Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState, Fragment, useRef } from "react";
import { localStorage, utils, CONST } from "core/helper";
import {
  commonService,
  masterService,
  userService,
  usersService,
} from "core/services";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  COMMUNITY_URL,
  COMPANY_FILTER,
  DEGREE_FILTER,
  LANGUAGE_URL,
  PROFESSION_FILTER,
  RELIGION_URL,
  COUNTRY_PATH,
  COLLAGE_FILTER,
  STATE_PATH,
  CITY_PATH,
  COMPANY_CREATE,
  DEGREE_CREATE,
  COMMUNITY_FILTER,
  IMAGE_APPROVAL,
  DEGREE_GET_BY_ID,
  PROFESSION_GET_BY_ID,
} from "core/services/apiURL.service";
import { EDIT_PROFILE, PROFILES_PATH, PROFILE_PATH } from "pages/routes/routes";
import { Country } from "country-state-city";
import Select from "react-select";
import { connect, useSelector } from "react-redux";
import { reloadProfileAction } from "redux/action/account.action";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";
import { PROFESSION_URL } from "core/services/apiURL.service";
import { COLLAGE_CREATE } from "core/services/apiURL.service";
import ProfileImageUpload from "components/common/profile-image-upload";
import ImageFallback from "components/common/imageFallback";

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

const userContactSchema = Yup.object().shape({
  contactDetails: Yup.object().shape({
    nameOfContact: Yup.string()
      .matches(CONST.NAME_REGEX, CONST.MSG.INVALID_NAME)
      // .min(3, CONST.MSG.MIN_CHAR)
      .max(25, CONST.MSG.MAX_CHAR),
    relationMember: Yup.string(),
    timeToCall: Yup.object().shape({
      fromTime: Yup.string(),
      fromValue: Yup.string(),
      toTime: Yup.string(),
      toValue: Yup.string(),
    }),
    contactDisplay: Yup.string().nullable(),
    contact: Yup.string(),
  }),
});

const qualificationSchema = Yup.object().shape({
  qualification: Yup.object().shape({
    collage: Yup.string(),
    degree: Yup.string(),
    workWithVal: Yup.string(),
    workWith: Yup.string(),
    profession: Yup.string(),
    annualIncome: Yup.string(),
    currentCompanyName: Yup.string(),
  }),
});

const familySchema = Yup.object().shape({
  family: Yup.object().shape({
    fatherName: Yup.string(),
    motherName: Yup.string(),
    fatherBusiness: Yup.string(),
    motherBusiness: Yup.string(),
    location: Yup.string(),
    nativePlace: Yup.string(),
    sibling: Yup.object().shape({
      noOfMale: Yup.string().test(
        "Invalid",
        "Invalid charcters",
        (val) => val?.length <= 2
      ),
      noOfFemale: Yup.string().test(
        "Invalid",
        "Invalid charcters",
        (val) => val?.length <= 2
      ),
      noOfMaleMarried: Yup.string().test(
        "Invalid",
        "Invalid charcters",
        (val) => val?.length <= 2
      ),
      noOfFemaleMarried: Yup.string().test(
        "Invalid",
        "Invalid charcters",
        (val) => val?.length <= 2
      ),
    }),
    familyType: Yup.string().nullable(),
    familyValue: Yup.string().nullable(),
    familyAffluence: Yup.string(),
  }),
});

const locationSchema = Yup.object().shape({
  location: Yup.object().shape({
    country: Yup.string(),
    state: Yup.string().nullable(),
    city: Yup.string().nullable(),
    countryGrowUp: Yup.array().of(Yup.string()),
    ethnicOrigin: Yup.string(),
    zipCode: Yup.string(),
  }),
});

const privacySchema = Yup.object().shape({
  privacyOption: Yup.object().shape({
    displayName: Yup.string(),
    phone: Yup.string().nullable(),
    email: Yup.string().nullable(),
    photo: Yup.string().nullable(),
    dateOfBirth: Yup.string().nullable(),
    annuelIncome: Yup.string().nullable(),
    visitorSetting: Yup.string().nullable(),
    profilePrivacy: Yup.string().nullable(),
  }),
});

const deleteSchema = Yup.object().shape({
  reason: Yup.string().nullable().required("Delete reason is required"),
  message: Yup.string().when("reason", {
    is: (val) => val === "50",
    then: Yup.string().label("Message").required(),
  }),
});

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

const AddProfile = (props) => {
  const { commonData, reloadProfileAction } = props;
  const reload = useSelector((state) => state?.common?.reload);
  const navigate = useNavigate();

  const [countryGrownUpSelected, setCountryGrownUpSelected] = useState([]);

  const [countryVal, setCountryVal] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [stateval, setStateVal] = useState(null);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [mobileVal, setMobileVal] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [confirmPasswordToggle, setConfirmPasswordToggle] = useState(false);

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

  let isValidEmail = "";
  let emailValid = true;

  let validPhone = "";
  let isPhoneValid = false;

  const userUpdateBasicInfoSchema = Yup.object().shape({
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
      language: Yup.string(),
      aboutYourSelf: Yup.string().min(
        200,
        "Minimum 200 characters is required"
      ),
      height: Yup.string(),
      bloodGroup: Yup.string(),
    }),
  });

  const {
    register: userUpdateBasicInfo,
    handleSubmit: userBasicInfoSubmit,
    setValue: userBasicInfoValue,
    formState: {
      errors: userBasicInfoErrors,
      isSubmitting: userBasicInfoSubmitting,
    },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(userUpdateBasicInfoSchema),
  });

  const {
    register: userUpdateContact,
    handleSubmit: userContactSubmit,
    setValue: userContactValue,
    formState: {
      isSubmitting: userContactSubmitting,
      errors: contactUpdateErrors,
    },
  } = useForm({
    resolver: yupResolver(userContactSchema),
  });

  const {
    register: userQualificationUpdate,
    handleSubmit: userQualificationSubmit,
    setValue: userQualificationValue,
    formState: {
      errors: userQualificationErrors,
      isSubmitting: userQualificationSubmitting,
    },
    resetField,
  } = useForm({
    resolver: yupResolver(qualificationSchema),
  });

  const {
    register: userFamilyUpdate,
    handleSubmit: userFamilySubmit,
    setValue: userFamilyValue,
    formState: { errors: userFamilyErors, isSubmitting: userFamilySubmitting },
  } = useForm({
    resolver: yupResolver(familySchema),
  });

  const {
    handleSubmit: userLocationSubmit,
    register: userLocationRegister,
    setValue: userLocationValue,
    formState: { isSubmitting: userLocationSubmitting },
  } = useForm({
    resolver: yupResolver(locationSchema),
  });

  const {
    register: privacyUpdate,
    handleSubmit: userPrivacySubmit,
    setValue: userPrivacyValue,
    formState: { isSubmitting: userPrivacySubmitting },
  } = useForm({
    resolver: yupResolver(privacySchema),
  });

  const {
    register: deleteRegister,
    handleSubmit: deleteHandleSubmit,
    setValue: deleteSetValue,
    getValues: deleteProfileGetValue,
    formState: {
      isSubmitting: deleteIsSubmitting,
      errors: deleteProfileErrors,
    },
  } = useForm({
    resolver: yupResolver(deleteSchema),
  });

  const deleteReasonVal = deleteProfileGetValue("reason");

  const { setValue: userProfilePhotosValue } = useForm();

  const { profileID } = useParams();
  const [searchParams] = useSearchParams();
  // console.log("searchParams",searchParams);
  const isAddMode = !profileID;
  const fileInputRef = useRef();
  const mobileNoRef = useRef();

  const [eventKey, setEventKey] = useState("basic");
  // console.log("type eventKey::",typeof eventKey);
  // console.log("eventKey::", eventKey);

  useEffect(() => {
    if (searchParams.get("key")) {
      setEventKey(searchParams.get("key"));
    }
  }, [searchParams]);

  const [religion, setReligion] = useState([]);
  const [countryPhoneCode, setCountryPhoneCode] = useState([]);
  const [profile, setProfile] = useState(null);
  const [img, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [countryGrownUp, setCountryGrownUp] = useState([]);
  const [filter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [religionFilter] = useState({ ...CONST.DEFAULT_RELIGION_FILTER });
  const [communityForRegligionFilter] = useState({
    ...CONST.DEFAULT_ADV_FILTER,
  });
  const [degreeFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [countryFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [countryCodeFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [professionFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [companyFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [langFilter] = useState({ ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER });
  const [collageFilter] = useState({
    ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER,
  });
  const [workWithVal, setWorkwithVal] = useState("");

  const [selectedCollage, setSelectedCollage] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [phoneVal, setPhoneVal] = useState("");
  const [userMobileVal, setUserMobileVal] = useState("");

  const [fatherBusiness, setFatherBusiness] = useState("");
  const [motherBusiness, setMotherBusiness] = useState("");

  const [waitingApprovalimgs, setWaitingApprovalimgs] = useState([]);
  const [images, setImages] = useState([]);
  // console.log("images::", images);

  const handleChangeMobileNo = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setMobileVal(e.target.value);
      setValue("phone", e.target.value);
    }
  };

  const setFormvalues = (value) => {
    const payload = { ...value };
    const {
      contactDetails,
      qualification,
      family,
      location,
      privacyOption,
      basic,
      user,
    } = payload;

    if (basic) {
      const {
        profileFor,
        gender,
        height,
        phone,
        bloodGroup,
        dateOfBirth,
        isLivingWithFamily,
        maritalStatus,
        religion,
        diet,
        community,
        language,
        aboutYourSelf,
      } = basic;
      userBasicInfoValue("basic", {
        profileFor,
        dateOfBirth,
        maritalStatus,
        gender: gender?.toString(),
        isLivingWithFamily: isLivingWithFamily,
        religion: religion?._id,
        community: community?._id,
        language: language?._id,
        aboutYourSelf,
        diet: diet?.toString(),
        height,
        bloodGroup,
      });
    }
    if (user) {
      const { email, phone, name } = user;
      userBasicInfoValue("email", email, { shouldValidate: true });
      userBasicInfoValue("phone", phone, { shouldValidate: true });
      userBasicInfoValue("name", name, { shouldValidate: true });
      setUserMobileVal(phone);
    }

    if (contactDetails) {
      const {
        nameOfContact,
        contact,
        relationMember,
        timeToCall,
        contactDisplay,
      } = contactDetails;

      userContactValue("contactDetails", {
        nameOfContact,
        contact,
        relationMember,
        contactDisplay: contactDisplay?.toString(),
        timeToCall,
      });
      setPhoneVal(contact);
    }

    if (qualification) {
      const collageArr = [];
      const degreeArr = [];
      const companyArr = [];
      const professionArr = [];

      collageArr.push({
        label: qualification?.collage?.name,
        value: qualification?.collage?._id,
      });
      degreeArr.push({
        label: qualification?.degree?.name,
        value: qualification?.degree?._id,
      });
      companyArr.push({
        label: qualification?.currentCompanyName?.name,
        value: qualification?.currentCompanyName?._id,
      });
      professionArr.push({
        label: qualification?.profession?.name,
        value: qualification?.profession?._id,
      });
      userQualificationValue("qualification", {
        collage: qualification?.collage?._id,
        degree: qualification?.degree?._id,
        profession: qualification?.profession?._id,
        workWith: qualification?.workWith,
        annualIncome: qualification?.annualIncome,
        currentCompanyName: qualification?.currentCompanyName?._id,
      });
      setSelectedCollage(collageArr);
      setSelectedDegree(degreeArr);
      setSelectedProfession(professionArr);
      setSelectedCompany(companyArr);
      setWorkwithVal(qualification?.workWith?.toString());
      setDegreeCategory(qualification?.degreeCategory);
      setProfessionCategory(qualification?.professionCategory);
    }

    if (family) {
      userFamilyValue("family", {
        fatherName: family?.fatherName,
        motherName: family?.motherName,
        fatherBusiness: family?.fatherBusiness,
        motherBusiness: family?.motherBusiness,
        location: family?.location,
        nativePlace: family?.nativePlace,
        sibling: {
          noOfMale: family?.sibling?.noOfMale,
          noOfFemale: family?.sibling?.noOfFemale,
          noOfMaleMarried: family?.sibling?.noOfMaleMarried,
          noOfFemaleMarried: family?.sibling?.noOfFemaleMarried,
        },
        familyType: family?.familyType?.toString(),
        familyValue: family?.familyValue?.toString(),
        familyAffluence: family?.familyAffluence,
      });
      setFatherBusiness(family?.fatherBusiness);
      setMotherBusiness(family?.motherBusiness);
    }

    if (location) {
      const countryArr = [];
      const stateArr = [];
      const cityArr = [];
      const countryGrowUpArr = [];
      countryArr.push({
        label: location?.country?.name,
        value: location?.country?._id,
      });
      stateArr.push({
        label: location?.state?.name,
        value: location?.state?._id,
      });
      cityArr.push({
        label: location?.city?.name,
        value: location?.city?._id,
      });
      location?.countryGrowUp?.map((ele) =>
        countryGrowUpArr.push({
          label: ele,
          value: ele,
        })
      );
      setSelectedCountry(countryArr);
      setSelectedState(stateArr);
      setSelectedCity(cityArr);

      setCountryGrownUpSelected(countryGrowUpArr);
      userLocationValue("location", {
        country: location?.country?._id,
        state: location?.state?._id,
        city: location?.city?._id,
        countryGrowUp: location?.countryGrowUp,
        ethnicOrigin: location?.ethnicOrigin,
        zipCode: location?.zipCode,
      });
    }

    if (privacyOption) {
      userPrivacyValue("privacyOption", {
        annuelIncome: privacyOption?.annuelIncome?.toString(),
        displayName: privacyOption?.displayName,
        phone: privacyOption?.phone?.toString(),
        email: privacyOption?.email?.toString(),
        photo: privacyOption?.photo?.toString(),
        dateOfBirth: privacyOption?.dateOfBirth?.toString(),
        visitorSetting: privacyOption?.visitorSetting?.toString(),
        profilePrivacy: privacyOption?.profilePrivacy?.toString(),
      });
      // userPrivacyValue("privacyOption.phone", privacyOption?.phone.toString())
    }
    return true;
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

  const loadDegreeOptions = async (inputValue) =>
    // perform a request
    new Promise(async (resolve) => {
      if (degreeFilter) {
        degreeFilter.filter = {};
        degreeFilter.search = inputValue;
      }
      const resp = await masterService.getAllPost(
        DEGREE_FILTER + "filter",
        degreeFilter
      );
      let degreeArr = [];
      if (resp && resp.meta.code === 200) {
        const { data: degreeResp } = resp;
        degreeArr = degreeResp.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(degreeArr);
    });

  const [degreeCategory, setDegreeCategory] = useState();
  const [professionCategory, setProfessionCategory] = useState();

  const handleDegreeChange = async (option) => {
    if (option) {
      if (!option.__isNew__) {
        userQualificationValue("qualification.degree", option.value, {
          shouldValidate: true,
        });
        setSelectedDegree({
          label: option?.name,
          value: option?._id,
        });
        loadDegree(option?._id);
      }
      if (option.__isNew__) {
        const payload = {
          name: option.value,
          degreeCategory: 160,
        };
        const resp = await masterService.getAllPost(DEGREE_CREATE, payload);
        if (resp && resp.meta.code === 200) {
          const { data } = resp;
          userQualificationValue("qualification.degree", data._id, {
            shouldValidate: true,
          });
          setSelectedDegree({
            label: data?.name,
            value: data?._id,
          });
          utils.showSuccessMsg(resp.meta.message);
          loadDegree(data?._id);
        }
      }
    } else {
      setSelectedDegree(null);
      userQualificationValue("qualification.degree", "", {
        shouldValidate: false,
      });
    }
  };

  const loadProfessionOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      if (professionFilter) {
        professionFilter.search = inputValue;
      }
      const resp = await masterService.getAllPost(
        PROFESSION_FILTER + "filter",
        professionFilter
      );
      let companyArr = [];
      if (resp && resp.meta.code === 200) {
        const { data: companyResp } = resp;
        companyArr = companyResp.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(companyArr);
    });

  const handleProfessionChange = async (option) => {
    if (option) {
      if (!option.__isNew__) {
        userQualificationValue("qualification.profession", option.value, {
          shouldValidate: true,
        });
        setSelectedProfession({
          label: option?.name,
          value: option?._id,
        });
        loadProfession(option?._id);
      }
      if (option.__isNew__) {
        const payload = {
          name: option.value,
          professionCategory: 21,
        };
        const resp = await masterService.getAllPost(PROFESSION_URL, payload);
        if (resp && resp.meta.code === 200) {
          const { data } = resp;
          utils.showSuccessMsg(resp?.meta?.message);
          userQualificationValue("qualification.profession", data._id, {
            shouldValidate: true,
          });
          setSelectedProfession({
            label: data?.name,
            value: data?._id,
          });
          loadProfession();
        }
      }
    } else {
      setSelectedProfession(null);
      userQualificationValue("qualification.profession", "", {
        shouldValidate: false,
      });
    }
  };

  const loadCollageOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      // perform a request
      collageFilter.search = inputValue;
      const resp = await masterService.getAllPost(
        COLLAGE_FILTER + "filter",
        collageFilter
      );
      let collageArr = [];
      if (resp && resp.meta.code === 200) {
        const { data: collageResp } = resp;
        collageArr = collageResp.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(collageArr);
    });

  const handleCollageChange = async (option) => {
    if (option) {
      if (!option.__isNew__) {
        userQualificationValue("qualification.collage", option.value, {
          shouldValidate: true,
        });
        setSelectedCollage({
          label: option?.name,
          value: option?._id,
        });
      }
      if (option.__isNew__) {
        const payload = {
          name: option.value,
          // value: option.value
        };
        const resp = await masterService.getAllPost(COLLAGE_CREATE, payload);
        if (resp && resp.meta.code === 200) {
          const { data } = resp;
          userQualificationValue("qualification.collage", data._id, {
            shouldValidate: true,
          });
          setSelectedCollage({
            label: data?.name,
            value: data?._id,
          });
          utils.showSuccessMsg(resp.meta.message);
        }
      }
    } else {
      setSelectedCollage(null);
      userQualificationValue("qualification.collage", "", {
        shouldValidate: false,
      });
    }
  };

  const loadCompanyOptions = async (inputValue) =>
    // perform a request
    new Promise(async (resolve) => {
      if (companyFilter) {
        companyFilter.search = inputValue;
        companyFilter.filter = {};
      }
      const resp = await masterService.getAllPost(
        COMPANY_FILTER + "filter",
        companyFilter
      );
      let companyArr = [];
      if (resp && resp.meta.code === 200) {
        const { data: companyResp } = resp;
        companyArr = companyResp.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(companyArr);
    });

  const handleCompanyChange = async (option, meta) => {
    if (option) {
      if (!option.__isNew__) {
        userQualificationValue("qualification.currentCompanyName", option._id, {
          shouldValidate: true,
        });
        setSelectedCompany({
          label: option?.name,
          value: option?._id,
        });
      }
      if (option.__isNew__) {
        const payload = {
          name: option.value,
        };
        const resp = await masterService.getAllPost(COMPANY_CREATE, payload);
        if (resp && resp.meta.code === 200) {
          const { data } = resp;
          userQualificationValue("qualification.currentCompanyName", data._id, {
            shouldValidate: true,
          });
          setSelectedCompany({
            label: data?.name,
            value: data?._id,
          });
          loadCompanyName();
          utils.showSuccessMsg(resp.meta.message);
        }
      }
    } else {
      setSelectedCompany(null);
      userQualificationValue("qualification.currentCompanyName", "", {
        shouldValidate: false,
      });
    }
  };

  const loadCompanyName = async () => {
    // filter.filter = {};
    const resp = await masterService.getAllPost(COMPANY_FILTER + "filter", {
      ...CONST.DEFAULT_ADV_FILTER,
    });
    return resp?.data;
  };

  const loadReligion = async (religionFilter) => {
    religionFilter.filter = {};
    const resp = await masterService.getAllPost(
      RELIGION_URL + "/filter",
      religionFilter
    );
    setReligion(resp?.data);
  };

  useEffect(() => {
    loadReligion(religionFilter);
  }, []);

  const loadCommunityOptions = async (inputValue) =>
    new Promise(async (resolve) => {
      const religionValue = getValues("religion");
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

  const payloadValCheck = (key) => {
    Object.keys(key).map((val) => {
      if (key[val] === undefined || key[val] === null || key[val] === "") {
        delete key[val];
      }
    });
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

  const basicInfoSubmit = async (values) => {
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

  const handleWorkWithChange = (e) => {
    const { value } = e.target;
    setWorkwithVal(value);
    if (value !== "10" || value !== "20") {
      setSelectedCompany({
        label: "",
        value: "",
      });
    }
    if (value === "50") {
      // setValue("qualification.annualIncome", null)
      resetField("qualification.annualIncome");
      //   if(Object.keys(profile?.qualification.currentCompanyName).length !== 0){
      //   setSelectedCompany({
      //     label: profile?.qualification?.currentCompanyName?.name,
      //     value: profile?.qualification?.currentCompanyName?._id,
      //   })
      //   userQualificationValue("qualification.currentCompanyName",profile?. qualification?.currentCompanyName?._id)
      // }
    }
  };

  const handleChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setPhoneVal(e.target.value);
      setUserMobileVal("phone", e.target.value);
    }
  };

  const onContactSubmit = async (values) => {
    payloadValCheck(values.contact);
    const resp = await usersService.updateUser(
      { contactDetails: values.contact },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const loadDegree = async (degreeId) => {
    const resp = await masterService.getById(DEGREE_GET_BY_ID + degreeId);
    if (resp && resp.meta.code === 200) {
      const { data } = resp;
      setDegreeCategory(data?.degreeCategory);
    }
  };

  const loadProfession = async (professionId) => {
    const resp = await masterService.getById(
      PROFESSION_GET_BY_ID + professionId
    );
    if (resp && resp.meta.code === 200) {
      const { data } = resp;
      setProfessionCategory(data?.professionCategory);
    }
  };

  const onQualificationSubmit = async (values) => {
    const payload = { ...values };

    if (workWithVal === "30" || workWithVal === "40" || workWithVal === "50") {
      delete payload.qualification.currentCompanyName;
    }
    if (workWithVal === "50") {
      delete payload.qualification.currentCompanyName;
      delete payload.qualification.annualIncome;
    }
    payload.qualification.degreeCategory = degreeCategory;
    payload.qualification.professionCategory = professionCategory;

    payloadValCheck(payload.qualification);

    const resp = await usersService.updateUser(
      { qualification: payload.qualification },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const onFamilySubmit = async (values) => {
    const {
      fatherName,
      motherName,
      fatherBusiness,
      motherBusiness,
      location,
      nativePlace,
      familyType,
      familyAffluence,
      familyValue,
      sibling,
    } = values.family;
    const { noOfMale, noOfFemale, noOfMaleMarried, noOfFemaleMarried } =
      sibling;

    const payload = {
      fatherName: fatherName ? fatherName : undefined,
      motherName: motherName ? motherName : undefined,
      fatherBusiness: fatherBusiness ? fatherBusiness : undefined,
      motherBusiness: motherBusiness ? motherBusiness : undefined,
      location: location ? location : undefined,
      nativePlace: nativePlace ? nativePlace : undefined,
      familyType: familyType ? familyType : undefined,
      familyAffluence: familyAffluence ? familyAffluence : undefined,
      familyValue: familyValue ? familyValue : undefined,
      sibling: {
        noOfMale: noOfMale ? noOfMale : "",
        noOfFemale: noOfFemale ? noOfFemale : "",
        noOfMaleMarried: noOfMaleMarried ? noOfMaleMarried : "",
        noOfFemaleMarried: noOfFemaleMarried ? noOfFemaleMarried : "",
      },
    };
    const resp = await usersService.updateUser({ family: payload }, profileID);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const onLocationSubmit = async (values) => {
    payloadValCheck(values.location);
    const resp = await usersService.updateUser(
      { location: values.location },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const onPrivacySubmit = async (values) => {
    // return false
    payloadValCheck(values.privacyOption);
    const resp = await usersService.updateUser(
      { privacyOption: values.privacyOption },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  const handleReasonChange = (e) => {
    const { value } = e.target;
    deleteSetValue("reason", value, { shouldValidate: true });
  };

  const onDeleteProfileSubmit = async (values) => {
    const { reason, message } = values;
    const payload = {
      reason,
      message: reason === "50" ? message : undefined,
    };
    // return false;
    const resp = await usersService.deleteProfile(profileID, payload);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      navigate(PROFILES_PATH);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    file ? setImage(file) : setImage(null);
  };

  const getUserProfile = async () => await usersService.getUser(profileID);

  const handleUploadImg = async () => {
    const formData = new FormData();
    formData.append("category", 10);
    formData.append("images", img);
    localStorage.setProfileID(profileID);
    const resp = await commonService.profileImageUpload(formData, profileID);
    if (resp && resp.meta.code === 200) {
      userProfilePhotosValue("images", img, { shouldValidate: true });
      const { data } = resp;
      setImageId(data[0]._id);
      localStorage.removeProfileID();
      utils.showSuccessMsg(resp?.meta.message);
      handleCancelBlogImg();
      getUserProfile();
      reloadProfileAction(!reload);
      setImageId(null);
    }
  };

  const handleCancelBlogImg = () => {
    setPreviewImg(null);
    setImage(null);
    fileInputRef.current.value = null;
    // if (!isAddMode) {
    //   setValue("images", [prevImg.images[0]?._id], { shouldValidate: true });
    // }
  };

  useEffect(() => {
    if (commonData) {
      loadCountryWithPhoneCode(countryCodeFilter);
      loadCountryGrownUp();
    }
  }, [commonData]);

  async function getUserById(profileID) {
    const resp = await usersService.getUser(profileID);
    const imagesArr = [];
    const unApprovedImagesArr = [];
    if (resp && resp.meta.code === 200) {
      setFormvalues(resp?.data);
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
    if (img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(img);
    } else {
      setPreviewImg(null);
    }
  }, [img]);

  useEffect(() => {
    if (profileID) {
      getUserProfile(profileID);
    }
  }, []);

  useEffect(() => {
    if (reload) {
      getUserById(profileID);
    }
  }, [reload]);

  const loadCountry = async (value) =>
    new Promise(async (resolve) => {
      if (countryFilter) {
        countryFilter.filter = {};
        countryFilter.search = value;
      }
      const resp = await masterService.getAllPost(
        COUNTRY_PATH + "/filter",
        countryFilter
      );
      let countryArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        countryArr = data.map((ele) => ({
          label: ele.name,
          value: ele._id,
          ...ele,
        }));
      }
      resolve(countryArr);
    });

  const loadCountryGrownUp = () => {
    const countries = Country.getAllCountries();
    const updateCountries = countries.map((ele) => ({
      label: ele.name,
      value: ele.name,
      ...ele,
    }));
    setCountryGrownUp(updateCountries);
  };

  const handleCountryChange = (values) => {
    const { label, value } = values;
    const countryArr = [];
    countryArr.push({ value, label });
    setSelectedCountry(countryArr);
    userLocationValue("location.country", value);
    setCountryVal(value);
  };

  const loadStates = async (value) =>
    new Promise(async (resolve) => {
      if (
        countryVal === "" ||
        countryVal === null ||
        countryVal === undefined
      ) {
        resolve([]);
        return false;
      }
      filter.filter = {
        country: countryVal ? [countryVal] : [profile?.location?.country?._id],
      };
      filter.search = value;
      const resp = await masterService.getAllPost(
        STATE_PATH + "/filter",
        filter
      );
      let stateArr = [];
      if (resp && resp.meta.code === 200) {
        stateArr = resp.data.map((ele) => ({
          label: ele.name,
          value: ele._id,
          ...ele,
        }));
      }
      resolve(stateArr);
    });

  const handleStateChange = (values) => {
    const stateArr = [];
    const { value, label } = values;
    stateArr.push({ value, label });
    userLocationValue("location.state", value);
    setSelectedState(stateArr);
    setStateVal(value);
  };

  const loadCities = async (value) =>
    new Promise(async (resolve) => {
      if (
        countryVal === "" ||
        countryVal === null ||
        countryVal === undefined ||
        stateval === "" ||
        stateval === null ||
        stateval === undefined
      ) {
        resolve([]);
        return false;
      }
      filter.filter = {
        country: countryVal ? [countryVal] : [profile?.location?.country?._id],
        state: stateval ? [stateval] : [profile?.location?.state?._id],
      };
      filter.search = value;
      const resp = await masterService.getAllPost(
        CITY_PATH + "/filter",
        filter
      );
      let cityArr = [];
      if (resp && resp.meta.code === 200) {
        cityArr = resp.data.map((ele) => ({
          label: ele.name,
          value: ele._id,
          ...ele,
        }));
      }
      resolve(cityArr);
    });

  const handleCityChange = (values) => {
    const cityArr = [];
    const { label, value } = values;
    userLocationValue("location.city", value);
    cityArr.push({ value, label });
    setSelectedCity(cityArr);
  };

  const handleCountryGrowupChange = (value) => {
    const countryArr = [];
    value.map((ele) => countryArr.push(ele.value));
    userLocationValue("location.countryGrowUp", countryArr, {
      shouldValidate: true,
    });

    const growUpArr = [];
    value.map((ele) => {
      const { label, value } = ele;
      growUpArr.push({
        label,
        value,
      });
    });
    setCountryGrownUpSelected(growUpArr);
  };

  const getCommonDataVal = (key, value) => {
    const data = commonData[key]?.find((ele) => ele.code === value);
    return data ? data?.label : "";
  };

  const handleMobileNoChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setUserMobileVal(e.target.value);
      userUpdateBasicInfo("phone", e.target.value);
    }
  };

  const handleFatherOccupationChange = (e) => {
    const { value } = e.target;
    const regex = /^[A-Za-z\s]+$/;
    if (value === "" || regex.test(value)) {
      userFamilyValue("family.fatherBusiness", value);
      setFatherBusiness(value);
    }
  };

  const handleMotherOccupationChange = (e) => {
    const { value } = e.target;
    const regex = /^[A-Za-z\s]+$/;
    if (value === "" || regex.test(value)) {
      userFamilyValue("family.motherBusiness", value);
      setMotherBusiness(value);
    }
  };
  const imageDomain = process.env.REACT_APP_IMAGE_PATH;

  const getCommonDataValOfImageStatus = (key) => {
    switch (key) {
      // case 10:
      //   return <p className="mt-2">Request raised waiting for approval.</p>;
      case 20:
        return <p className="mt-2">Photo approved.</p>;
      case 30:
        return <p className="mt-2">Photo approval rejected</p>;
      default:
        return <p className="mt-2">Photo approved.</p>;
    }
  };

  const [loading, setLoading] = useState(false);

  const handleApprove = async (id) => {
    setLoading(true);
    const resp = await masterService.get(IMAGE_APPROVAL + id + "?type=20");
    if (resp && resp.meta.code === 200) {
      reloadProfileAction(!reload);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    const resp = await masterService.get(IMAGE_APPROVAL + id + "?type=30");
    if (resp && resp.meta.code === 200) {
      reloadProfileAction(!reload);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

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
                                  <Form.Label>Name</Form.Label>
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
                                  <Form.Label>Email</Form.Label>
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
                                  <Form.Label>Profile created by</Form.Label>
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
                                  <Form.Label>Gender</Form.Label>
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
                                    Date of Birth{" "}
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
                                  <Form.Label>Marital status</Form.Label>
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
                                  <Form.Label>Phone</Form.Label>
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
                                  <Form.Label>Religion</Form.Label>
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
                                  <Form.Label>Community</Form.Label>
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
                                  <Form.Label>Language</Form.Label>
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
                                  <Form.Label>Password</Form.Label>
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
                                  <Form.Label>Confirm Password</Form.Label>
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
                        <Tab.Pane eventKey={"basic"}>
                          <Form onSubmit={userBasicInfoSubmit(basicInfoSubmit)}>
                            <Row className="form-group">
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Profile created by</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      {...userUpdateBasicInfo(
                                        "basic.profileFor"
                                      )}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData?.profileFor &&
                                        commonData?.profileFor.map(
                                          (ele, ind) => (
                                            <option value={ele.code} key={ind}>
                                              {ele.label}
                                            </option>
                                          )
                                        )}
                                    </Form.Select>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Profile name</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      {...userUpdateBasicInfo("name")}
                                      className="form-control"
                                      type="text"
                                      maxLength={30}
                                    />
                                    <p className="text-danger">
                                      {userBasicInfoErrors.basic?.name?.message}
                                    </p>
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
                                    {/* <div className="d-flex justify-content-start">
                                      {commonData &&
                                        commonData.gender &&
                                        commonData.gender.map((ele, ind) => (
                                          <Form.Check>
                                            <Form.Check.Label>
                                              <Form.Check.Input
                                                type="radio"
                                                name="gender"
                                                {...userUpdateBasicInfo(
                                                  "basic.gender"
                                                )}
                                                value={ele.code}
                                              />
                                              <i className="input-helper"></i>{" "}
                                              {ele.label}
                                            </Form.Check.Label>
                                          </Form.Check>
                                        ))}
                                    </div> */}
                                    <strong>
                                      <p className="text-medium">
                                        {getCommonDataVal(
                                          "gender",
                                          profile?.basic?.gender
                                        )}
                                      </p>
                                    </strong>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label className="label">
                                      Date of Birth{" "}
                                    </Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      {...userUpdateBasicInfo(
                                        "basic.dateOfBirth"
                                      )}
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
                                    <Form.Label>Email</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      {...userUpdateBasicInfo("email")}
                                      className="form-control"
                                      type="text"
                                      placeholder="Email"
                                    />
                                    <p className="text-danger">
                                      {userBasicInfoErrors.email?.message}
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Phone</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      {...userUpdateBasicInfo("phone")}
                                      className="form-control"
                                      type="text"
                                      placeholder="Phone"
                                      value={userMobileVal}
                                      onChange={handleMobileNoChange}
                                      maxLength={10}
                                    />
                                    <p className="text-danger">
                                      {userBasicInfoErrors.phone?.message}
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
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
                                              {...userUpdateBasicInfo(
                                                "basic.isLivingWithFamily"
                                              )}
                                              value={ele.value}
                                            />
                                            <i className="input-helper"></i>{" "}
                                            {ele.label}
                                          </Form.Check.Label>
                                        </Form.Check>
                                      ))}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Marital status</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      {...userUpdateBasicInfo(
                                        "basic.maritalStatus"
                                      )}
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
                                      {...userUpdateBasicInfo("basic.religion")}
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
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>About Yourself</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      as={"textarea"}
                                      rows="5"
                                      {...userUpdateBasicInfo(
                                        "basic.aboutYourSelf"
                                      )}
                                      className="form-control"
                                      placeholder="About Yourself"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Height</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      {...userUpdateBasicInfo("basic.height")}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData?.heightTypes &&
                                        commonData?.heightTypes.map(
                                          (ele, ind) => (
                                            <option value={ele.code} key={ind}>
                                              {ele.label}
                                            </option>
                                          )
                                        )}
                                    </Form.Select>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>BloodGroup</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      {...userUpdateBasicInfo(
                                        "basic.bloodGroup"
                                      )}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData?.bloodGroup &&
                                        commonData?.bloodGroup.map(
                                          (ele, ind) => (
                                            <option value={ele.code} key={ind}>
                                              {ele.label}
                                            </option>
                                          )
                                        )}
                                    </Form.Select>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
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
                                          <Form.Check
                                            className="mx-1"
                                            key={ind}
                                          >
                                            <Form.Check.Label>
                                              <Form.Check.Input
                                                type="radio"
                                                name="diet"
                                                {...userUpdateBasicInfo(
                                                  "basic.diet"
                                                )}
                                                value={ele.code}
                                              />
                                              <i className="input-helper"></i>{" "}
                                              {ele.label}
                                            </Form.Check.Label>
                                          </Form.Check>
                                        ))}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <button
                              disabled={userBasicInfoSubmitting}
                              type="submit"
                              className="btn btn-rounded btn-success"
                            >
                              Submit
                            </button>
                          </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"location"}>
                          <Form onSubmit={userLocationSubmit(onLocationSubmit)}>
                            <Row className="form-group">
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Country</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncSelect
                                      defaultOptions
                                      cacheOptions
                                      loadOptions={loadCountry}
                                      value={selectedCountry}
                                      onChange={handleCountryChange}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>State</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncSelect
                                      defaultOptions
                                      cacheOptions
                                      loadOptions={loadStates}
                                      value={selectedState}
                                      onChange={handleStateChange}
                                      key={countryVal}
                                      isDisabled={
                                        countryVal === "" ||
                                        countryVal === null ||
                                        countryVal === undefined
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>City</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncSelect
                                      cacheOptions
                                      loadOptions={loadCities}
                                      value={selectedCity}
                                      onChange={handleCityChange}
                                      defaultOptions
                                      key={countryVal && stateval}
                                      isDisabled={
                                        countryVal === "" ||
                                        countryVal === null ||
                                        countryVal === undefined ||
                                        stateval === "" ||
                                        stateval === null ||
                                        stateval === undefined
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Country Grownup</Form.Label>
                                  </Col>
                                  <Col xl={8} lg={6}>
                                    <Select
                                      options={countryGrownUp}
                                      isMulti
                                      value={countryGrownUpSelected}
                                      onChange={handleCountryGrowupChange}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Ethnic Origin</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      type="text"
                                      {...userLocationRegister(
                                        "location.ethnicOrigin"
                                      )}
                                      placeholder="Ethinic Origin"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Zipcode</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      type="text"
                                      {...userLocationRegister(
                                        "location.zipCode"
                                      )}
                                      placeholder="Zipcode"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <button
                              disabled={userLocationSubmitting}
                              type="submit"
                              className="btn btn-rounded btn-success"
                            >
                              Submit
                            </button>
                          </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"education"}>
                          <Form
                            onSubmit={userQualificationSubmit(
                              onQualificationSubmit
                            )}
                          >
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Degree</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncCreatableSelect
                                      cacheOptions
                                      defaultOptions
                                      loadOptions={loadDegreeOptions}
                                      onChange={handleDegreeChange}
                                      value={selectedDegree}
                                      isClearable
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>College</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncCreatableSelect
                                      cacheOptions
                                      defaultOptions
                                      loadOptions={loadCollageOptions}
                                      onChange={handleCollageChange}
                                      value={selectedCollage}
                                      isClearable
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Working With</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      className="form-control"
                                      {...userQualificationUpdate(
                                        "qualification.workWith"
                                      )}
                                      onChange={handleWorkWithChange}
                                    >
                                      <option value="" label="Select">
                                        Select
                                      </option>
                                      {commonData &&
                                        commonData.workWithTypes &&
                                        commonData.workWithTypes.map(
                                          (ele, ind) => (
                                            <option value={ele.code} key={ind}>
                                              {ele.label}
                                            </option>
                                          )
                                        )}
                                    </Form.Select>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Profession</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncCreatableSelect
                                      cacheOptions
                                      defaultOptions
                                      loadOptions={loadProfessionOptions}
                                      onChange={handleProfessionChange}
                                      value={selectedProfession}
                                      isClearable
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Company Name</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <AsyncCreatableSelect
                                      cacheOptions
                                      defaultOptions
                                      loadOptions={loadCompanyOptions}
                                      onChange={handleCompanyChange}
                                      value={selectedCompany}
                                      isDisabled={
                                        workWithVal !== "10" &&
                                        workWithVal !== "20"
                                      }
                                      isClearable
                                    />
                                    <p className="text-danger">
                                      {
                                        userQualificationErrors.qualification
                                          ?.currentCompanyName?.message
                                      }
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Annual Income</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      className="form-control"
                                      {...userQualificationUpdate(
                                        "qualification.annualIncome"
                                      )}
                                      disabled={workWithVal === "50"}
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.yearlyIncome &&
                                        commonData.yearlyIncome.map(
                                          (ele, ind) => (
                                            <option value={ele.code} key={ind}>
                                              {ele.label}
                                            </option>
                                          )
                                        )}
                                    </Form.Select>
                                    <p className="text-danger">
                                      {
                                        userQualificationErrors.qualification
                                          ?.annualIncome?.message
                                      }
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <button
                              disabled={userQualificationSubmitting}
                              type="submit"
                              className="btn btn-rounded btn-success"
                            >
                              Submit
                            </button>
                          </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"contact"}>
                          <Form onSubmit={userContactSubmit(onContactSubmit)}>
                            <Row className="form-group">
                              <Col xl={3} md={3} lg={4}>
                                <Form.Label>Name</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                <Form.Control
                                  type="text"
                                  {...userUpdateContact(
                                    "contactDetails.nameOfContact"
                                  )}
                                  maxLength={25}
                                />
                                <span className="text-danger">
                                  {
                                    contactUpdateErrors?.contactDetails
                                      ?.nameOfContact?.message
                                  }
                                </span>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={3} md={3} lg={4}>
                                <Form.Label>
                                  Relationship with member
                                </Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                <Form.Select
                                  {...userUpdateContact(
                                    "contactDetails.relationMember"
                                  )}
                                  className="form-control"
                                >
                                  <option value="">Select</option>
                                  {commonData &&
                                    commonData?.relationMember &&
                                    commonData?.relationMember.map(
                                      (ele, ind) => (
                                        <option value={ele.code} key={ind}>
                                          {ele.label}
                                        </option>
                                      )
                                    )}
                                </Form.Select>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={3} md={3} lg={4}>
                                <Form.Label>Convenient time to call</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                <Row>
                                  <Col xl={3}>
                                    <Form.Select
                                      {...userUpdateContact(
                                        "contactDetails.timeToCall.fromTime"
                                      )}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.time &&
                                        commonData.time.map((ele, ind) => (
                                          <option value={ele.code} key={ind}>
                                            {ele.label}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </Col>
                                  <Col xl={3}>
                                    <Form.Select
                                      {...userUpdateContact(
                                        "contactDetails.timeToCall.fromValue"
                                      )}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.timeType &&
                                        commonData.timeType.map((ele, ind) => (
                                          <option value={ele.code} key={ind}>
                                            {ele.label}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </Col>
                                  <Col xl={3}>
                                    <Form.Select
                                      {...userUpdateContact(
                                        "contactDetails.timeToCall.toTime"
                                      )}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.time &&
                                        commonData.time.map((ele, ind) => (
                                          <option value={ele.code} key={ind}>
                                            {ele.label}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </Col>
                                  <Col xl={3}>
                                    <Form.Select
                                      {...userUpdateContact(
                                        "contactDetails.timeToCall.toValue"
                                      )}
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.timeType &&
                                        commonData.timeType.map((ele, ind) => (
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
                              <Col xl={3} md={3} lg={4}>
                                <Form.Label>Contact</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                <Form.Control
                                  type="text"
                                  {...userUpdateContact(
                                    "contactDetails.contact"
                                  )}
                                  maxLength={10}
                                  pattern="[0-9]*"
                                  value={phoneVal}
                                  onChange={handleChange}
                                />
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={3} md={3} lg={4}>
                                <Form.Label>Contact Display</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.contactDisplayType &&
                                  commonData.contactDisplayType.map(
                                    (ele, ind) => (
                                      <Form.Check key={ind}>
                                        <Form.Check.Label>
                                          <Form.Check.Input
                                            type="radio"
                                            {...userUpdateContact(
                                              "contactDetails.contactDisplay"
                                            )}
                                            value={ele.code}
                                          />
                                          <i className="input-helper"></i>
                                          {ele.label}
                                        </Form.Check.Label>
                                      </Form.Check>
                                    )
                                  )}
                              </Col>
                            </Row>
                            <button
                              disabled={userContactSubmitting}
                              type="submit"
                              className="btn btn-rounded btn-success"
                            >
                              Submit
                            </button>
                          </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"family"}>
                          <Form onSubmit={userFamilySubmit(onFamilySubmit)}>
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Father Name</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      type="text"
                                      {...userFamilyUpdate("family.fatherName")}
                                      className="form-control"
                                      placeholder="Father Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Mother Name</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      type="text"
                                      {...userFamilyUpdate("family.motherName")}
                                      className="form-control"
                                      placeholder="Mother Name"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Father Occupation</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    {/* <Form.Select
                                      className="form-control"
                                      {...userFamilyUpdate(
                                        "family.fatherBusiness"
                                      )}
                                    >
                                      <option value="" label="Select">
                                        Select
                                      </option>
                                      {commonData &&
                                        commonData.business &&
                                        commonData.business.map((ele, ind) => (
                                          <option value={ele.code} key={ind}>
                                            {ele.label}
                                          </option>
                                        ))}
                                    </Form.Select> */}
                                    <Form.Control
                                      {...userFamilyUpdate(
                                        "family.fatherBusiness"
                                      )}
                                      type="text"
                                      className="textboxhide"
                                      maxLength="50"
                                      placeholder="Fathers Occupation"
                                      value={fatherBusiness}
                                      onChange={handleFatherOccupationChange}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Mother Occupation</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    {/* <Form.Select
                                      className="form-control"
                                      {...userFamilyUpdate(
                                        "family.motherBusiness"
                                      )}
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.business &&
                                        commonData.business.map((ele, ind) => (
                                          <option value={ele.code} key={ind}>
                                            {ele.label}
                                          </option>
                                        ))}
                                    </Form.Select> */}
                                    <Form.Control
                                      {...userFamilyUpdate(
                                        "family.motherBusiness"
                                      )}
                                      type="text"
                                      className="textboxhide"
                                      maxLength="50"
                                      placeholder="Mothers Occupation"
                                      onChange={handleMotherOccupationChange}
                                      value={motherBusiness}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Location</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      type="text"
                                      {...userFamilyUpdate("family.location")}
                                      className="form-control"
                                      placeholder="Family Location"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Native Place</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Control
                                      type="text"
                                      {...userFamilyUpdate(
                                        "family.nativePlace"
                                      )}
                                      className="form-control"
                                      placeholder="Native Place"
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={6}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Family Affluence</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <Form.Select
                                      className="form-control"
                                      {...userFamilyUpdate(
                                        "family.familyAffluence"
                                      )}
                                    >
                                      <option value="">Select</option>
                                      {commonData &&
                                        commonData.familyAffluence &&
                                        commonData.familyAffluence.map(
                                          (ele, ind) => (
                                            <option value={ele.code} key={ind}>
                                              {ele.label}
                                            </option>
                                          )
                                        )}
                                    </Form.Select>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl={6} md={6} lg={8}>
                                <Row>
                                  <Col xl={4}>
                                    <Form.Label>Family Type</Form.Label>
                                  </Col>
                                  <Col xl={8}>
                                    <div className="d-flex">
                                      {commonData &&
                                        commonData.familyType &&
                                        commonData.familyType.map(
                                          (ele, ind) => (
                                            <Form.Check
                                              className="mx-1"
                                              key={ind}
                                            >
                                              <Form.Check.Label>
                                                <Form.Check.Input
                                                  type="radio"
                                                  name="FamilyType"
                                                  {...userFamilyUpdate(
                                                    "family.familyType"
                                                  )}
                                                  value={ele.code}
                                                />
                                                <i className="input-helper"></i>{" "}
                                                {ele.label}
                                              </Form.Check.Label>
                                            </Form.Check>
                                          )
                                        )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={12} md={6} lg={8}>
                                <Row>
                                  <Col xl={2}>
                                    <Form.Label>Family Values</Form.Label>
                                  </Col>
                                  <Col xl={6}>
                                    <div className="d-flex">
                                      {commonData &&
                                        commonData.familyValue &&
                                        commonData.familyValue.map(
                                          (ele, ind) => (
                                            <Form.Check
                                              className="mx-1"
                                              key={ind}
                                            >
                                              <Form.Check.Label>
                                                <Form.Check.Input
                                                  type="radio"
                                                  name="familyValues"
                                                  value={ele.code}
                                                  {...userFamilyUpdate(
                                                    "family.familyValue"
                                                  )}
                                                />
                                                <i className="input-helper"></i>{" "}
                                                {ele.label}
                                              </Form.Check.Label>
                                            </Form.Check>
                                          )
                                        )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col xl={12} md={6} lg={8}>
                                <Row>
                                  <Col xl={2}>
                                    <Form.Label>No of Siblings</Form.Label>
                                  </Col>
                                  <Col xl={10}>
                                    <Row>
                                      <Col xl={6}>
                                        <Row>
                                          <Col
                                            xl={2}
                                            className="d-flex align-items-center"
                                          >
                                            <Form.Label>Male</Form.Label>
                                          </Col>
                                          <Col xl={5}>
                                            <span>Not married</span>
                                            <Form.Control
                                              {...userFamilyUpdate(
                                                "family.sibling.noOfMale"
                                              )}
                                              type="text"
                                              className="form-control"
                                              maxLength={2}
                                              placeholder="Not married"
                                            />
                                            <p className="text-danger">
                                              {
                                                userFamilyErors.family?.sibling
                                                  ?.noOfMale?.message
                                              }
                                            </p>
                                          </Col>
                                          <Col xl={5}>
                                            <span>Married</span>
                                            <Form.Control
                                              {...userFamilyUpdate(
                                                "family.sibling.noOfMaleMarried"
                                              )}
                                              type="text"
                                              className="form-control"
                                              maxLength="2"
                                              placeholder="Married"
                                            />
                                            <p className="text-danger">
                                              {
                                                userFamilyErors.family?.sibling
                                                  ?.noOfMaleMarried?.message
                                              }
                                            </p>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col xl={6}>
                                        <Row>
                                          <Col
                                            xl={2}
                                            className="d-flex align-items-center"
                                          >
                                            <Form.Label>Female</Form.Label>
                                          </Col>
                                          <Col xl={5}>
                                            <span>Not married</span>
                                            <Form.Control
                                              {...userFamilyUpdate(
                                                "family.sibling.noOfFemale"
                                              )}
                                              type="text"
                                              className="form-control"
                                              maxLength="2"
                                              placeholder="Not Married"
                                            />
                                            <p className="text-danger">
                                              {
                                                userFamilyErors.family?.sibling
                                                  ?.noOfFemale?.message
                                              }
                                            </p>
                                          </Col>
                                          <Col xl={5}>
                                            <span>Married</span>
                                            <Form.Control
                                              {...userFamilyUpdate(
                                                "family.sibling.noOfFemaleMarried"
                                              )}
                                              type="text"
                                              className="form-control"
                                              maxLength="2"
                                              placeholder="Married"
                                            />
                                            <p className="text-danger">
                                              {
                                                userFamilyErors.family?.sibling
                                                  ?.noOfFemaleMarried?.message
                                              }
                                            </p>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <button
                              disabled={userFamilySubmitting}
                              type="submit"
                              className="btn btn-rounded btn-success"
                            >
                              Submit
                            </button>
                          </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"privacy"}>
                          <Form onSubmit={userPrivacySubmit(onPrivacySubmit)}>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Display Name</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                <Form.Control
                                  type="text"
                                  {...privacyUpdate(
                                    "privacyOption.displayName"
                                  )}
                                />
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Phone</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.contactDisplayType &&
                                  commonData.contactDisplayType.map(
                                    (ele, ind) => (
                                      <Form.Check key={ind}>
                                        <Form.Check.Label>
                                          <Form.Check.Input
                                            type="radio"
                                            {...privacyUpdate(
                                              "privacyOption.phone"
                                            )}
                                            value={ele.code}
                                          />
                                          <i className="input-helper"></i>
                                          {ele.label}
                                        </Form.Check.Label>
                                      </Form.Check>
                                    )
                                  )}
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Email</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.privacyEmailSetting &&
                                  commonData.privacyEmailSetting.map(
                                    (ele, ind) => (
                                      <Form.Check key={ind}>
                                        <Form.Check.Label>
                                          <Form.Check.Input
                                            type="radio"
                                            {...privacyUpdate(
                                              "privacyOption.email"
                                            )}
                                            value={ele.code}
                                          />
                                          <i className="input-helper"></i>
                                          {ele.label}
                                        </Form.Check.Label>
                                      </Form.Check>
                                    )
                                  )}
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Photo</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.privacyPhotoSetting &&
                                  commonData.privacyPhotoSetting.map(
                                    (ele, ind) => (
                                      <Form.Check key={ind}>
                                        <Form.Check.Label>
                                          <Form.Check.Input
                                            type="radio"
                                            {...privacyUpdate(
                                              "privacyOption.photo"
                                            )}
                                            value={ele.code}
                                          />
                                          <i className="input-helper"></i>
                                          {ele.label}
                                        </Form.Check.Label>
                                      </Form.Check>
                                    )
                                  )}
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Date Of Birth</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.dateOfBirth &&
                                  commonData.dateOfBirth.map((ele, ind) => (
                                    <Form.Check key={ind}>
                                      <Form.Check.Label>
                                        <Form.Check.Input
                                          type="radio"
                                          {...privacyUpdate(
                                            "privacyOption.dateOfBirth"
                                          )}
                                          value={ele.code}
                                        />
                                        <i className="input-helper"></i>
                                        {ele.label}
                                      </Form.Check.Label>
                                    </Form.Check>
                                  ))}
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Annual Income</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.annuelIncome &&
                                  commonData.annuelIncome.map((ele, ind) => (
                                    <Form.Check key={ind}>
                                      <Form.Check.Label>
                                        <Form.Check.Input
                                          type="radio"
                                          {...privacyUpdate(
                                            "privacyOption.annuelIncome"
                                          )}
                                          value={ele.code}
                                        />
                                        <i className="input-helper"></i>
                                        {ele.label}
                                      </Form.Check.Label>
                                    </Form.Check>
                                  ))}
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Visitor Setting</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.visitorSetting &&
                                  commonData.visitorSetting.map((ele, ind) => (
                                    <Form.Check key={ind}>
                                      <Form.Check.Label>
                                        <Form.Check.Input
                                          type="radio"
                                          {...privacyUpdate(
                                            "privacyOption.visitorSetting"
                                          )}
                                          value={ele.code}
                                        />
                                        <i className="input-helper"></i>
                                        {ele.label}
                                      </Form.Check.Label>
                                    </Form.Check>
                                  ))}
                              </Col>
                            </Row>
                            <Row className="form-group">
                              <Col xl={2} md={3} lg={4}>
                                <Form.Label>Profile Privacy</Form.Label>
                              </Col>
                              <Col xl={6} md={6} lg={4}>
                                {commonData &&
                                  commonData.profilePrivacy &&
                                  commonData.profilePrivacy.map((ele, ind) => (
                                    <Form.Check key={ind}>
                                      <Form.Check.Label>
                                        <Form.Check.Input
                                          type="radio"
                                          {...privacyUpdate(
                                            "privacyOption.profilePrivacy"
                                          )}
                                          value={ele.code}
                                        />
                                        <i className="input-helper"></i>
                                        {ele.label}
                                      </Form.Check.Label>
                                    </Form.Check>
                                  ))}
                              </Col>
                            </Row>
                            <button
                              disabled={userPrivacySubmitting}
                              type="submit"
                              className="btn btn-rounded btn-success"
                            >
                              Submit
                            </button>
                          </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"photos"}>
                          <Row className="form-group">
                            <Col xl={12}>
                              <Row className="d-flex justify-content-center">
                                <Col md={4}>
                                  <div className="image_upload_wrapper">
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
                                        onChange={(e) => handleImageChange(e)}
                                        // {...photoUpdate("images")}
                                        type="file"
                                        ref={fileInputRef}
                                        className="form-control"
                                        disabled={img}
                                      />
                                    </Col>
                                  </Row>
                                  {previewImg && (
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
                                  )}
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={12}>
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
                                      const {
                                        originalImage,
                                        imagePath,
                                        approvalStatus,
                                      } = ele;
                                      return (
                                        <Col md={3}>
                                          <div className="profile-upload-image-wrapper">
                                            <ImageFallback
                                              gender={profile?.basic?.gender}
                                              src={
                                                imageDomain +
                                                imagePath +
                                                originalImage
                                              }
                                              alt={"profile-image"}
                                              className="w-100"
                                            />
                                            {getCommonDataValOfImageStatus(
                                              approvalStatus
                                            )}
                                          </div>
                                        </Col>
                                      );
                                    })}
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
                                      const { originalImage, imagePath, _id } =
                                        ele;
                                      return (
                                        <Col md={3} className="form-group">
                                          <ImageFallback
                                            gender={profile?.basic?.gender}
                                            src={
                                              imageDomain +
                                              imagePath +
                                              originalImage
                                            }
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
                                      <h6 className="mt-2">
                                        No pending approvals
                                      </h6>
                                    </div>
                                  )}
                                </Row>
                              )}
                            </Col>
                          </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey={"delete-profile"}>
                          <Form
                            onSubmit={deleteHandleSubmit(onDeleteProfileSubmit)}
                          >
                            <div className="d-flex justify-content-between">
                              <h6>Delete Profile</h6>
                            </div>
                            <Row className="account-sec-edit-bg p-3">
                              <Col md={12}>
                                <p>
                                  Let us know why you wish to delete your
                                  profile?
                                </p>
                                <Row>
                                  <Col md={5} className="ml-5">
                                    {commonData?.deleteProfileReason?.map(
                                      (ele, ind) => (
                                        <div>
                                          <Form.Check
                                            type="radio"
                                            key={ind}
                                            value={ele.code}
                                            {...deleteRegister("reason")}
                                            onChange={(e) =>
                                              handleReasonChange(e)
                                            }
                                          />
                                          <label>{ele.label}</label>
                                        </div>
                                      )
                                    )}
                                    {(deleteReasonVal === "50" ||
                                      deleteReasonVal === "") && (
                                      <Form.Control
                                        as={"textarea"}
                                        {...deleteRegister("message")}
                                        placeholder="Type a reason"
                                      />
                                    )}
                                    <p className="text-danger text-start ">
                                      {deleteProfileErrors.reason?.message}
                                    </p>
                                    <p className="text-danger text-start ">
                                      {deleteProfileErrors.message?.message}
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                              <button
                                className="w-auto btn btn-sm btn-success ml-5"
                                disabled={deleteIsSubmitting}
                                type="submit"
                              >
                                Submit
                              </button>
                            </Row>
                          </Form>
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

const mapDispatchToProps = {
  reloadProfileAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProfile);
