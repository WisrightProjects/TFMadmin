import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CONST, utils } from "core/helper";
import { masterService, usersService } from "core/services";
import { Col, Form, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import {
  CITY_PATH,
  COUNTRY_PATH,
  STATE_PATH,
} from "core/services/apiURL.service";
import { Country } from "country-state-city";
import Select from "react-select";

const validationSchema = Yup.object().shape({
  location: Yup.object().shape({
    country: Yup.string(),
    state: Yup.string().nullable(),
    city: Yup.string().nullable(),
    countryGrowUp: Yup.array().of(Yup.string()),
    ethnicOrigin: Yup.string(),
    zipCode: Yup.string(),
  }),
});

const Location = (props) => {
  const { profile, profileID } = props;
  const [countryFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [stateFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [cityFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [countryGrownUpSelected, setCountryGrownUpSelected] = useState([]);
  const [countryGrownUp, setCountryGrownUp] = useState([]);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const setFormValues = (location) => {
    if (location) {
      const { country, state, city, countryGrowUp, ethnicOrigin, zipCode } =
        location;
      const countryArr = [];
      const stateArr = [];
      const cityArr = [];
      const countryGrowUpArr = [];
      countryArr.push({
        label: country?.name,
        value: country?._id,
      });
      stateArr.push({
        label: state?.name,
        value: state?._id,
      });
      cityArr.push({
        label: city?.name,
        value: city?._id,
      });
      countryGrowUp?.map((ele) =>
        countryGrowUpArr.push({
          label: ele,
          value: ele,
        })
      );
      setSelectedCountry(countryArr);
      setSelectedState(stateArr);
      setSelectedCity(cityArr);

      setCountryGrownUpSelected(countryGrowUpArr);
      setValue("location", {
        country: country?._id,
        state: state?._id,
        city: city?._id,
        countryGrowUp: countryGrowUp,
        ethnicOrigin: ethnicOrigin,
        zipCode: zipCode,
      });
    }
  };

  useEffect(() => {
    setFormValues(profile?.location);
  }, [profile]);

  const countryVal = getValues("location.country");
  const stateval = getValues("location.state");

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

  const handleCountryChange = (values) => {
    if (values) {
      const { label, value } = values;
      const countryArr = [];
      countryArr.push({ value, label });
      setSelectedCountry(countryArr);
      setValue("location.country", value);
    } else {
      setSelectedCountry(null);
      setValue("location.country", "");
    }
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
      stateFilter.filter = {
        country: countryVal ? [countryVal] : [profile?.country?._id],
      };
      stateFilter.search = value;
      const resp = await masterService.getAllPost(
        STATE_PATH + "/filter",
        stateFilter
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
    setValue("location.state", value);
    setSelectedState(stateArr);
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
      cityFilter.filter = {
        country: countryVal ? [countryVal] : [profile?.country?._id],
        state: stateval ? [stateval] : [profile?.state?._id],
      };
      cityFilter.search = value;
      const resp = await masterService.getAllPost(
        CITY_PATH + "/filter",
        cityFilter
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
    setValue("location.city", value);
    cityArr.push({ value, label });
    setSelectedCity(cityArr);
  };

  const loadCountryGrownUp = () => {
    const countries = Country.getAllCountries();
    const updateCountries = countries.map((ele) => ({
      label: ele.name,
      value: ele.name,
      ...ele,
    }));
    setCountryGrownUp(updateCountries);
  };

  const handleCountryGrowupChange = (value) => {
    const countryArr = [];
    value.map((ele) => countryArr.push(ele.value));
    setValue("location.countryGrowUp", countryArr, {
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

  const payloadValCheck = (key) => {
    Object.keys(key).map((val) => {
      if (key[val] === undefined || key[val] === null || key[val] === "") {
        delete key[val];
      }
    });
  };

  const onSubmit = async (values) => {
    payloadValCheck(values.location);
    const resp = await usersService.updateUser(
      { location: values.location },
      profileID
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
    }
  };

  useEffect(() => {
    loadCountryGrownUp();
  }, []);

  return (
    <Tab.Pane eventKey={"location"}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="form-group">
          <Col xl={6} md={6} lg={6}>
            <Row>
              <Col xl={4}>
                <Form.Label>Country</Form.Label>
              </Col>
              <Col xl={8}>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCountry}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  isClearable
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
                  {...register("location.ethnicOrigin")}
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
                  {...register("location.zipCode")}
                  placeholder="Zipcode"
                />
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

export default Location;
