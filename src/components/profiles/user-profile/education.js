import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { CONST, utils } from "core/helper";
import { masterService, usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  COLLAGE_CREATE,
  COLLAGE_FILTER,
  COMPANY_CREATE,
  COMPANY_FILTER,
  DEGREE_CREATE,
  DEGREE_FILTER,
  DEGREE_GET_BY_ID,
  PROFESSION_FILTER,
  PROFESSION_GET_BY_ID,
  PROFESSION_URL,
} from "core/services/apiURL.service";

const validationSchema = Yup.object().shape({
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

const Education = (props) => {
  const { profile, profileID } = props;
  const commonData = useSelector((state) => state.common?.commonData);
  const [degreeFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [professionFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [companyFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [collageFilter] = useState({
    ...CONST.DEFAULT_ADVANCE_ASYNC_LANG_FILTER,
  });
  const [selectedCollage, setSelectedCollage] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);

  const [degreeCategory, setDegreeCategory] = useState();
  const [professionCategory, setProfessionCategory] = useState();

  const setFormValues = (qualification) => {
    if (qualification) {
      const {
        collage,
        degree,
        currentCompanyName,
        profession,
        workWith,
        annualIncome,
      } = qualification;
      const collageArr = [];
      const degreeArr = [];
      const companyArr = [];
      const professionArr = [];

      collageArr.push({
        label: collage?.name,
        value: collage?._id,
      });
      degreeArr.push({
        label: degree?.name,
        value: degree?._id,
      });
      companyArr.push({
        label: currentCompanyName?.name,
        value: currentCompanyName?._id,
      });
      professionArr.push({
        label: profession?.name,
        value: profession?._id,
      });
      setValue("qualification", {
        collage: collage?._id,
        degree: degree?._id,
        profession: profession?._id,
        workWith: workWith,
        annualIncome: annualIncome,
        currentCompanyName: currentCompanyName?._id,
      });
      setSelectedCollage(collageArr);
      setSelectedDegree(degreeArr);
      setSelectedProfession(professionArr);
      setSelectedCompany(companyArr);
      // setWorkwithVal(workWith?.toString());
      setDegreeCategory(degreeCategory);
      setProfessionCategory(professionCategory);
    }
  };

  useEffect(() => {
    setFormValues(profile?.qualification);
  }, [profile]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    resetField,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const workWithVal = getValues("qualification.workWith");

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

  const handleDegreeChange = async (option) => {
    if (option) {
      if (!option.__isNew__) {
        setValue("qualification.degree", option.value, {
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
          setValue("qualification.degree", data._id, {
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
      setValue("qualification.degree", "", {
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
        setValue("qualification.profession", option.value, {
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
          setValue("qualification.profession", data._id, {
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
      setValue("qualification.profession", "", {
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
        setValue("qualification.collage", option.value, {
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
          setValue("qualification.collage", data._id, {
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
      setValue("qualification.collage", "", {
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

  const handleCompanyChange = async (option) => {
    if (option) {
      if (!option.__isNew__) {
        setValue("qualification.currentCompanyName", option._id, {
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
          setValue("qualification.currentCompanyName", data._id, {
            shouldValidate: true,
          });
          setSelectedCompany({
            label: data?.name,
            value: data?._id,
          });
          utils.showSuccessMsg(resp.meta.message);
        }
      }
    } else {
      setSelectedCompany(null);
      setValue("qualification.currentCompanyName", "", {
        shouldValidate: false,
      });
    }
  };

  const handleWorkWithChange = (e) => {
    const { value } = e.target;
    if (value !== "10" || value !== "20") {
      setSelectedCompany({
        label: "",
        value: "",
      });
      setValue("qualification.workWith", value)
    }
    if (value === "50") {
      resetField("qualification.annualIncome");
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

  return (
    <Tab.Pane eventKey={"education"}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("qualification.workWith")}
                  onChange={handleWorkWithChange}
                >
                  <option value="" label="Select">
                    Select
                  </option>
                  {commonData &&
                    commonData.workWithTypes &&
                    commonData.workWithTypes.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
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
                  isDisabled={workWithVal !== "10" && workWithVal !== "20"}
                  isClearable
                />
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
                  {...register("qualification.annualIncome")}
                  disabled={workWithVal === "50"}
                >
                  <option value="">Select</option>
                  {commonData &&
                    commonData.yearlyIncome &&
                    commonData.yearlyIncome.map((ele, ind) => (
                      <option value={ele.code} key={ind}>
                        {ele.label}
                      </option>
                    ))}
                </Form.Select>
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

export default Education;
