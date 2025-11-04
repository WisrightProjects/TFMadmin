import { Col, Row, Tab } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { Fragment, useEffect, useState } from "react";
import { masterService } from "core/services";
import Actions from "components/actions";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CONST, utils } from "core/helper";
import AsyncSelect from "react-select/async";
import {
  BRANCH_URL,
  CITY_PATH,
  COMMUNITY_FILTER,
  COUNTRY_PATH,
  DEGREE_URL,
  EXPORT_PAYMENT_BASE,
  LANGUAGE_FILTER,
  PLAN_URL,
  RELIGION_FILTER,
  REPORT_PAYMENT_BASE,
  STATE_PATH,
} from "core/services/apiURL.service";
import moment from "moment";
import { useSelector } from "react-redux";

const fieldArr = [
  {
    key: "name",
    isSelected: true,
    label: "Name",
  },
  {
    key: "profileId",
    isSelected: true,
    label: "Profile ID",
  },
  {
    key: "email",
    isSelected: true,
    label: "Email",
  },
  {
    key: "phone",
    isSelected: true,
    label: "Phone",
  },
  {
    key: "gender",
    isSelected: true,
    label: "Gender",
  },
  {
    key: "language",
    isSelected: false,
    label: "Language",
  },
  {
    key: "community",
    isSelected: false,
    label: "Community",
  },
  {
    key: "religion",
    isSelected: false,
    label: "Religion",
  },
  {
    key: "degree",
    isSelected: false,
    label: "Degree",
  },
  {
    key: "collage",
    isSelected: false,
    label: "College",
  },
  {
    key: "profession",
    isSelected: false,
    label: "Profession",
  },
  {
    key: "company",
    isSelected: false,
    label: "Company",
  },
  {
    key: "country",
    isSelected: false,
    label: "Country",
  },
  {
    key: "state",
    isSelected: false,
    label: "State",
  },
  {
    key: "city",
    isSelected: false,
    label: "City",
  },
  {
    key: "isPremium",
    isSelected: false,
    label: "Is Premium",
  },
  {
    key: "planName",
    isSelected: false,
    label: "Plan Name",
  },
  {
    key: "invoiceId",
    isSelected: false,
    label: "Invoice ID",
  },
  {
    key: "paymentMethod",
    isSelected: false,
    label: "Payment method",
  },
  {
    key: "amount",
    isSelected: false,
    label: "Amount",
  },
  {
    key: "couponAmount",
    isSelected: false,
    label: "Coupon amount",
  },
  {
    key: "branch",
    isSelected: false,
    label: "Branch",
  },
  {
    key: "maritalStatus",
    isSelected: false,
    label: "Marital Status",
  },
  {
    key: "familyAffluence",
    isSelected: false,
    label: "Family Affluence",
  },
];

const Payments = () => {
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Plan",
      selector: (row) => row.plan,
    },
    {
      cell: (row) => getActions(row),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const getActions = (row) => {
    return <Actions rowId={row._id} />;
  };

  const {
    register: search,
    handleSubmit,
    reset,
    setValue,
    resetField,
    getValues,
    formState: { isSubmitting },
  } = useForm();

  const commonData = useSelector((state) => state?.common?.commonData);

  const [paymentList, setPaymentList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filter, setFilter] = useState({
    ...CONST.DEFAULT_ASYNC_MASTER_FILTER,
  });
  const [religionFilter] = useState({ ...CONST.DEFAULT_RELIGION_FILTER });
  const [langFilter] = useState({ ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER });
  const [countrySelected, setCountrySelected] = useState([]);
  const [countryIds, setCountryIds] = useState([]);

  const [stateIds, setStateIds] = useState([]);
  const [stateSelected, setStateSelected] = useState([]);
  const [citySelected, setCitySelected] = useState([]);

  const [religionVal, setReligionVal] = useState("");
  const [religionSelected, setReligionSelected] = useState(null);
  const [communitySelected, setCommunitySelected] = useState(null);
  const [languagesSelected, setLanguageSelected] = useState(null);
  const [planSelected, setPlanSelected] = useState(null);
  const [branchSelected, setBranchSelected] = useState(null);
  const [degreeSelected, setDegreeSelected] = useState(null);

  const [spinner, setSpinner] = useState(false);
  const [isResp, setIsResp] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [exportArr, setExportArr] = useState([]);
  const [isTouchedFields, setIsTouchedFieds] = useState(false);

  const handleCommonChange = () => setIsTouchedFieds(true);

  const loadCountry = (inputValue) =>
    new Promise(async (resolve) => {
      filter.filter = {};
      if (inputValue) {
        filter.search = inputValue;
      }
      const resp = await masterService.getAllPost(
        COUNTRY_PATH + "/filter",
        filter
      );
      let countryFilterArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        countryFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(countryFilterArr);
    });

  const handleCountryChange = (values) => {
    if (values && values.length > 0) {
      const countryArrIds = [];
      const countryArr = [];

      values.map((ele) => countryArrIds.push(ele.value));

      values.map((ele) =>
        countryArr.push({
          label: ele?.label,
          value: ele?.value,
        })
      );
      setValue("country", countryArrIds);

      setCountryIds([...countryArrIds]);
      setCountrySelected(countryArr);

      setStateSelected(null);
      setCitySelected(null);
      handleCommonChange();
      return values;
    } else {
      setCountrySelected(null);
      setStateSelected(null);
      setCitySelected(null);
      setCountryIds([]);
      setValue("country", []);
      setValue("state", []);
      setValue("city", []);
    }
  };

  const loadStates = (inputValue) =>
    new Promise(async (resolve) => {
      if (countryIds.length === 0) {
        resolve([]);
        return false;
      }
      if (countryIds.length > 0) {
        filter.filter = {
          country: countryIds,
        };
      }
      if (inputValue) {
        filter.search = inputValue;
      }
      let stateFilterArr = [];
      const resp = await masterService.getAllPost(
        STATE_PATH + "/filter",
        filter
      );
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        stateFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(stateFilterArr);
    });

  const handleStateChange = (values) => {
    if (values.length > 0) {
      const stateArray = [];
      const stateIds = [];
      values.map((ele) => stateIds.push(ele.value));

      values.map((ele) =>
        stateArray.push({
          label: ele?.label,
          value: ele?.value,
        })
      );

      setValue("state", stateIds);
      setStateIds([...stateIds]);
      setStateSelected(stateArray);

      setCitySelected(null);
      handleCommonChange();
    } else {
      setValue("state", []);
      setStateIds([]);
      setStateSelected(null);
      setCitySelected(null);
      setValue("city", []);
    }
  };

  const loadCity = (inputValue) =>
    new Promise(async (resolve) => {
      if (stateIds.length === 0) {
        resolve([]);
        return false;
      }
      if (stateIds.length > 0) {
        filter.filter = {
          state: stateIds,
        };
      }
      if (inputValue) {
        filter.search = inputValue;
      }
      const resp = await masterService.getAllPost(
        CITY_PATH + "/filter",
        filter
      );
      let cityFilterArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        if (data && data?.length > 0) {
          cityFilterArr = data?.map((ele) => ({
            value: ele._id,
            label: ele.name,
          }));
        }
      }
      resolve(cityFilterArr);
    });

  const handleCityChange = (values) => {
    if (values.length > 0) {
      const cityIds = [];
      const cityArr = [];
      values.map((ele) => cityIds.push(ele.value));
      setValue("city", cityIds);
      handleCommonChange();

      values.map((ele) =>
        cityArr.push({
          label: ele?.label,
          value: ele?.value,
        })
      );
      setCitySelected(cityArr);
    } else {
      setCitySelected(null);
      setValue("city", []);
    }
  };

  const loadReligion = async (inputValue) =>
    new Promise(async (resolve) => {
      if (inputValue) {
        religionFilter.search = inputValue;
      }
      let religionFilterArr = [];
      const resp = await masterService.getAllPost(
        RELIGION_FILTER,
        religionFilter
      );
      if (resp && resp?.meta?.code === 200) {
        const { data } = resp;
        religionFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(religionFilterArr);
    });

  const handleReligionChange = (value) => {
    if (value) {
      setValue("religion", value?._id);
      setReligionVal(value?._id);
      handleCommonChange();
      setReligionSelected({
        value: value?._id,
        label: value?.label,
      });
      setCommunitySelected(null);
      setValue("community", "");
    } else {
      setReligionSelected(null);
      setValue("religion", "");
      setReligionVal("");
      setCommunitySelected(null);
      setValue("community", "");
    }
  };

  const loadCommunity = (inputValue) =>
    new Promise(async (resolve) => {
      if (religionVal === "" || religionVal === undefined) {
        resolve([]);
        return false;
      }
      if (religionVal) {
        filter.filter = {
          religion: [religionVal],
        };
      }
      if (inputValue) {
        filter.search = inputValue;
      }
      const resp = await masterService.getAllPost(COMMUNITY_FILTER, filter);
      let communityFilterArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        communityFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.community,
          ...ele,
        }));
      }
      resolve(communityFilterArr);
    });

  const handleCommunityChange = (value) => {
    if (value) {
      setValue("community", value?._id);
      setCommunitySelected({
        value: value?._id,
        label: value?.label,
      });
      handleCommonChange();
    } else {
      setValue("community", "");
      setCommunitySelected(null);
    }
  };

  const loadLanguage = async (inputValue) =>
    new Promise(async (resolve) => {
      langFilter.filter = {};
      if (inputValue) {
        langFilter.search = inputValue;
      }
      const resp = await masterService.getAllPost(LANGUAGE_FILTER, langFilter);
      let languageFilterArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        languageFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(languageFilterArr);
    });

  const handleLanguageChange = (value) => {
    if (value) {
      handleCommonChange();
      setValue("language", value?._id);
      setLanguageSelected({
        value: value?._id,
        label: value?.label,
      });
    } else {
      setLanguageSelected(null);
      setValue("language", "");
    }
  };

  const loadPlans = async (inputValue) =>
    new Promise(async (resolve) => {
      filter.filter = {
        status: 10,
      };
      if (inputValue) {
        filter.search = inputValue;
      }
      let planFilterArr = [];
      const resp = await masterService.getAllPost(PLAN_URL + "/filter", filter);
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        planFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(planFilterArr);
    });

  const handlePlanChange = (value) => {
    if (value) {
      setValue("plan", value?._id);
      handleCommonChange();
      setPlanSelected({
        label: value?.label,
        value: value?._id,
      });
    } else {
      setValue("plan", "");
      setPlanSelected(null);
    }
  };

  const handlePageChange = (page) => {
    setFilter({
      ...filter,
      skip: page > 1 ? (page - 1) * perPage : 0,
    });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setFilter({
      ...filter,
      skip: page > 1 ? (page - 1) * perPage : 0,
      limit: newPerPage,
    });
  };

  const loadBranch = async (inputValue) =>
    new Promise(async (resolve) => {
      filter.filter = {};
      if (inputValue) {
        filter.search = inputValue;
      }
      const resp = await masterService.getAllPost(
        BRANCH_URL + "/filter",
        filter
      );
      let branchFilterArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        branchFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(branchFilterArr);
    });

  const handleBranchChange = (value) => {
    if (value) {
      setValue("branch", value?._id);
      handleCommonChange();
      setBranchSelected({
        label: value?.label,
        value: value?._id,
      });
    } else {
      setValue("branch", "");
      setBranchSelected(null);
    }
  };

  const loadDegree = async (inputValue) =>
    new Promise(async (resolve) => {
      filter.filter = {};
      if (inputValue) {
        filter.search = inputValue;
      }
      const resp = await masterService.getAllPost(
        DEGREE_URL + "/filter",
        filter
      );
      let degreeFilterArr = [];
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        degreeFilterArr = data.map((ele) => ({
          value: ele._id,
          label: ele.name,
          ...ele,
        }));
      }
      resolve(degreeFilterArr);
    });

  const handleDegreeChange = (value) => {
    if (value) {
      setValue("degree", value?._id);
      handleCommonChange();
      setDegreeSelected({
        label: value?.label,
        value: value?._id,
      });
    } else {
      setDegreeSelected(null);
      setValue("degree", "");
    }
  };

  const onSubmitSearch = async (values) => {
    const {
      from,
      to,
      plan,
      country,
      state,
      city,
      religion,
      community,
      language,
      branch,
      degree,
      maritalStatus,
      gender,
      familyAffluence,
      paymentStatus,
    } = values;
    if (
      (from === "" || from === undefined || from === null) &&
      (to === undefined || to === "" || to === null) &&
      (country?.length === 0 || country === "" || country === undefined) &&
      (state?.length === 0 || state === "" || state === undefined) &&
      (city?.length === 0 || city === "" || city === undefined) &&
      (religion === null || religion === "" || religion === undefined) &&
      (community === null || community === "" || community === undefined) &&
      (language === "" || language === undefined || language === "") &&
      (branch === "" || branch === undefined || branch === "") &&
      (degree === "" || degree === undefined || degree === "") &&
      (plan === "" || plan === undefined || plan === "") &&
      (maritalStatus === "" ||
        maritalStatus === undefined ||
        maritalStatus === null) &&
      (gender === "" || gender === undefined || gender === null) &&
      (familyAffluence === "" ||
        familyAffluence === undefined ||
        familyAffluence === null) &&
      (paymentStatus === "" ||
        paymentStatus === undefined ||
        paymentStatus === null)
    ) {
      utils.showErrMsg("Minimum field is required");
      setPaymentList([]);
      return false;
    }

    const filterObj = {};
    if (from && from !== "") {
      filterObj.from = from;
    }
    if (to && to !== "") {
      filterObj.to = to;
    }
    if (plan && plan !== "") {
      filterObj.plan = [plan];
    }
    if (country && country.length > 0) {
      filterObj.country = country;
    }
    if (state && state.length > 0 && state !== "") {
      filterObj.state = state;
    }
    if (city && city.length > 0 && city !== "") {
      filterObj.city = city;
    }
    if (religion && religion !== "") {
      filterObj.religion = [religion];
    }
    if (community && community !== "") {
      filterObj.community = [community];
    }
    if (language && language !== "") {
      filterObj.language = [language];
    }
    if (branch && branch !== "") {
      filterObj.branch = [branch];
    }
    if (degree && degree !== "") {
      filterObj.degree = [degree];
    }
    if (maritalStatus !== "") {
      filterObj.maritalStatus = [Number(maritalStatus)];
    }
    if (gender !== "") {
      filterObj.gender = [Number(gender)];
    }
    if (familyAffluence !== "") {
      filterObj.familyAffluence = [Number(familyAffluence)];
    }
    if (paymentStatus !== "") {
      filterObj.paymentStatus = [Number(paymentStatus)];
    }

    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const searchReset = () => {
    reset();
    setCountrySelected([]);
    setStateSelected([]);
    setCitySelected([]);
    setReligionSelected(null);
    setCommunitySelected(null);
    setLanguageSelected(null);
    setPlanSelected(null);
    setBranchSelected(null);
    setDegreeSelected(null);
    setPaymentList([]);
    setSpinner(false);
    setValue("from", "");
    setValue("to", "");
    setFromDate("");

    setReligionVal("");
    setCountryIds([]);
    setStateIds([]);

    setFilter({
      ...filter,
      filter: {},
    });
    setIsTouchedFieds(false);
  };

  const exportPayments = async () => {
    Object.keys(filter).map((val) => {
      if (
        filter[val] === undefined ||
        filter[val] === null ||
        filter[val] === ""
      ) {
        delete filter[val];
      }
    });
    const {
      city,
      community,
      country,
      from,
      language,
      plan,
      religion,
      state,
      status,
      to,
      branch,
      familyAffluence,
      maritalStatus,
    } = filter.filter;
    const exportPayload = {
      exportArr,
      filter: {
        city,
        community,
        country,
        from,
        language,
        plan,
        religion,
        state,
        to,
        paymentStatus: status,
        branch,
        familyAffluence,
        maritalStatus,
      },
    };
    // return false;
    const resp = await masterService.export(EXPORT_PAYMENT_BASE, exportPayload);
    const blob = new Blob([resp.data], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "payment.xlsx";
    link.click();
  };

  const handleChangeExportKey = (e) => {
    const { checked, name } = e.target;
    const exportArray = [];
    const fieldArrObj = fieldArr.find((ele) => ele.key === name);
    if (checked === true) {
      exportArray.push(fieldArrObj.key);
      setExportArr([...exportArr, ...exportArray]);
    }
    if (checked === false) {
      const exportArrObj = exportArr.find((ele) => ele === name);
      const filterEle = exportArrObj && exportArr.filter((ele) => ele !== name);
      setExportArr(filterEle);
    }
  };

  useEffect(() => {
    const exportArray = [];
    fieldArr.map((ele) => {
      if (ele.isSelected === true) {
        exportArray.push(ele.key);
      }
      return setExportArr(exportArray);
    });
  }, [fieldArr]);

  const loadPayments = async (filter) => {
    delete filter.search;
    setSpinner(true);
    const resp = await masterService.getAllPost(REPORT_PAYMENT_BASE, filter);
    if (resp && resp?.meta?.code === 200) {
      setSpinner(true);
      const { data, pagination } = resp;
      setTotalRows(pagination?.totalCount);
      setPaymentList(data);
      setIsResp(true);
      setSpinner(false);
    } else {
      setSpinner(false);
      setPaymentList([]);
    }
  };

  useEffect(() => {
    if (Object.keys(filter.filter).length > 0) {
      loadPayments(filter);
    }
  }, [filter]);

  console.log("fromdate formate::", moment(fromDate).format());
  console.log("fromdate state::", fromDate);
  console.log("fromdate state::", new Date(fromDate));

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmitSearch)} className="forms-sample">
        <Row>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter From Date"
                size="md"
                {...search("from")}
                onChange={(e) => {
                  console.log("e::", e);
                  setFromDate(e.target.value);
                  handleCommonChange();
                  resetField("to");
                }}
                max={moment().subtract(1, "days").format("YYYY-MM-DD")}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter To Date"
                size="md"
                {...search("to")}
                min={fromDate}
                onChange={handleCommonChange}
                disabled={
                  !fromDate || fromDate === "" || fromDate === undefined
                }
                max={moment().format("YYYY-MM-DD")}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Plans</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadPlans}
                onChange={handlePlanChange}
                value={planSelected}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Country</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCountry}
                onChange={handleCountryChange}
                isMulti
                value={countrySelected}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>State</Form.Label>
              <AsyncSelect
                key={countryIds}
                cacheOptions
                defaultOptions
                loadOptions={loadStates}
                onChange={handleStateChange}
                isMulti
                value={stateSelected}
                isDisabled={countryIds.length === 0}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>City</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCity}
                onChange={handleCityChange}
                isMulti
                value={citySelected}
                key={stateIds}
                isDisabled={countryIds.length === 0 || stateIds.length === 0}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Religion</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadReligion}
                onChange={handleReligionChange}
                value={religionSelected}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Community</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCommunity}
                onChange={handleCommunityChange}
                value={communitySelected}
                isDisabled={religionVal.length === 0}
                key={religionVal}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Language</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadLanguage}
                onChange={handleLanguageChange}
                isClearable
                value={languagesSelected}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Branch</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadBranch}
                onChange={handleBranchChange}
                value={branchSelected}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Degree</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadDegree}
                onChange={handleDegreeChange}
                value={degreeSelected}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Marital Status</Form.Label>
              <select
                {...search("maritalStatus")}
                onChange={handleCommonChange}
                className="form-control"
              >
                <option value={""}>Select</option>
                {commonData?.maritalStatus?.map((ele, ind) => (
                  <option key={ind} value={ele.code}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Gender</Form.Label>
              <select
                {...search("gender")}
                onChange={handleCommonChange}
                className="form-control"
              >
                <option value={""}>Select</option>
                {commonData?.gender?.map((ele, ind) => (
                  <option key={ind} value={ele.code}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Family Affluence</Form.Label>
              <select
                {...search("familyAffluence")}
                onChange={handleCommonChange}
                className="form-control"
              >
                <option value={""}>Select</option>
                {commonData?.familyAffluence?.map((ele, ind) => (
                  <option key={ind} value={ele.code}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Status</Form.Label>
              <select
                {...search("paymentStatus")}
                onChange={handleCommonChange}
                className="form-control"
              >
                <option value={""}>Select</option>
                {commonData?.paymentStatus?.map((ele, ind) => (
                  <option key={ind} value={ele.code}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <Form.Label>Select Columns:</Form.Label>
          </Col>
          <Col md={10}>
            <div className="download_report_field_wrapper row">
              {fieldArr.map((ele, ind) => (
                <div className="col-md-3" key={ind}>
                  <div className="d-flex">
                    <input
                      type="checkbox"
                      value={ele.key}
                      defaultChecked={ele.isSelected}
                      onChange={handleChangeExportKey}
                      name={ele.key}
                    />
                    <label className="mx-2 text-capitalize">{ele.label}</label>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <div className="pb-2 d-flex justify-content-between">
          <div className="d-flex">
            <button
              type="submit"
              className="btn btn-gradient-primary mr-2"
              disabled={isSubmitting}
            >
              Search
            </button>
            {isTouchedFields && (
              <button
                onClick={searchReset}
                type="button"
                className="btn btn-gradient-danger mr-2"
              >
                Reset
              </button>
            )}
          </div>
          <div className="d-flex">
            {paymentList.result?.length > 0 && (
              <strong className="mx-3 text-dark mt-3">
                Total Amount : {paymentList?.totalAmount}
              </strong>
            )}
            {paymentList.result?.length > 0 && isResp && (
              <button
                type="button"
                className="btn btn-success mr-2"
                disabled={isSubmitting}
                onClick={exportPayments}
              >
                Export
              </button>
            )}
          </div>
        </div>
      </Form>
      <Tab.Pane eventKey={"payments"}>
        <DataTableRemote
          noHeader={true}
          subHeader={false}
          columns={columns}
          data={paymentList?.result}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          totalRows={totalRows}
          progressPending={spinner}
        />
      </Tab.Pane>
    </Fragment>
  );
};

export default Payments;
