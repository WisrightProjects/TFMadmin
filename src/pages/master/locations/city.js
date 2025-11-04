import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ModalCommon from "components/modal";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { masterService } from "core/services";
import { utils, CONST } from "core/helper";
import {
  CITY_PATH,
  COUNTRY_PATH,
  STATE_PATH,
} from "core/services/apiURL.service";
import { connect } from "react-redux";
import AsyncSelect from "react-select/async";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  country: Yup.string().label("Country").required(),
  state: Yup.string().label("State").required(),
  name: Yup.string().label("City").required(),
  lattitude: Yup.number().typeError("Lattitude is required").required(),
  longitude: Yup.number().typeError("Longitude is required").required(),
  status: Yup.string().label("Status").required(),
});

const Cities = (props) => {
  const { commonData } = props;

  const columns = [
    {
      name: "City Name",
      selector: (row) => row.name,
    },
    {
      name: "State Name",
      selector: (row) => (row.state?.name ? row.state?.name : " - "),
    },
    {
      name: "Country Name",
      selector: (row) => (row.country?.name ? row.country?.name : " - "),
    },
    {
      name: "Last Updated",
      selector: (row) => utils.formatDate(row.updatedAt),
    },
    {
      name: "Status",
      selector: (row) => {
        const { status } = row;
        const { commonStatus } = commonData;
        const data = commonStatus
          ? commonStatus.find((ele) => ele.code === status)
          : {};
        let class_name = "";
        switch (data.code) {
          case 10:
            class_name = "btn-success";
            break;
          case 20:
            class_name = "btn-danger";
            break;
          default:
            class_name = "btn-primary";
            break;
        }
        return (
          <button type="button" className={`btn ${class_name} btn-sm`}>
            {data.label}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Actions
          editOnClick={handleEdit}
          viewOnClick={handleView}
          deleteOnClick={handleDelete}
          rowId={row._id}
        />
      ),
      ignoreRowClick: true,
      grow: 1,
    },
  ];
  const [pageFor] = useState("City List");
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [countryFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [stateFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });

  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  const [spinner, setSpinner] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);

  const [searchCountrySelected, setSearchCountrySelected] = useState(null);
  const [searchStateelected, setSearchStateSelected] = useState(null);

  const toggleModal = () => {
    setModalShow(!modalShow);
    setSelectedCountry(null);
    setSelectedState(null);
  };
  const getCommonDataVal = (key, val) => {
    const resp =
      commonData && commonData[key]
        ? commonData[key]?.find((e) => e.code === val)
        : "";
    return resp ? resp.label : "";
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const countryValWatch = watch("country");

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchReset,
    setValue: searchValue,
    getValues: searchGetValues,
    watch: searchWatch,
    formState: { isDirty, isSubmitting: searchIsSubmitting },
  } = useForm();

  const searchCountryWatch = searchWatch("country");

  const onSubmit = (values) => {
    data ? updateCity(data._id, values) : createCity(values);
  };

  const loadSearchCountry = async (value) =>
    new Promise(async (resolve) => {
      filter.search = value;
      const resp = await masterService.getAllPost(
        COUNTRY_PATH + "/filter",
        filter
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

  const handleSearchCountryChange = (value) => {
    searchValue("country", value._id);
    setSearchCountrySelected({
      label: value.name,
      value: value._id,
    });
  };

  const loadSearchStates = async (value) =>
    new Promise(async (resolve) => {
      const countryVal = searchGetValues("country");
      if (
        countryVal === "" ||
        countryVal === null ||
        countryVal === undefined
      ) {
        resolve([]);
        return false;
      }
      filter.filter = {
        country: [countryVal],
      };
      filter.search = value;
      const resp = await masterService.getAllPost(
        STATE_PATH + "/filter",
        filter
      );
      let stateFilterArr = [];
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

  const handleSearchStateChange = (value) => {
    searchValue("state", value._id);
    setSearchStateSelected({
      label: value.name,
      value: value._id,
    });
  };

  const loadCountry = async (value) =>
    new Promise(async (resolve) => {
      countryFilter.search = value;
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

  const handleCountryChange = (option) => {
    const { _id, label } = option;
    setValue("country", _id);
    setSelectedCountry({
      label: label,
      value: _id,
    });
  };

  const loadStates = async (value) =>
    new Promise(async (resolve) => {
      const countryVal = getValues("country");
      if (
        countryVal === "" ||
        countryVal === null ||
        countryVal === undefined
      ) {
        resolve([]);
        return false;
      }
      if (countryVal) {
        stateFilter.filter = {
          country: [countryVal],
        };
      }
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
    const { _id, label } = values;
    setValue("state", _id);
    setSelectedState({
      label: label,
      value: _id,
    });
  };

  const loadCities = async () => {
    setSpinner(true);
    const resp = await masterService.getAllPost(CITY_PATH + "/filter", filter);
    if (resp && resp.meta.code === 200) {
      const { data, pagination } = resp;
      setTotalRows(data.length > 0 ? pagination.totalCount : 0);
      setDataSource(data.length > 0 ? data : []);
      setSpinner(false);
    }
  };

  const createCity = async (values) => {
    filter.filter = {};
    const coordinates = [
      parseFloat(values.lattitude),
      parseFloat(values.longitude),
    ];
    values.location = {
      type: "Point",
      coordinates: coordinates,
    };
    delete values.lattitude;
    delete values.longitude;
    const resp = await masterService.create(CITY_PATH, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      toggleModal();
      loadCities();
    }
  };

  const updateCity = async (id, values) => {
    const coordinates = [
      parseFloat(values.lattitude),
      parseFloat(values.longitude),
    ];
    values.location = {
      type: "Point",
      coordinates: coordinates,
    };
    delete values.lattitude;
    delete values.longitude;
    const resp = await masterService.update(CITY_PATH + "/" + id, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_UPDATED_SUCC);
      reset();
      toggleModal();
      loadCities();
    }
  };

  const loadCityById = async (id) => {
    const resp = await masterService.getById(CITY_PATH + "/" + id);
    if (resp && resp.meta.code === 200) {
      return resp.data;
    }
    return false;
  };

  const handleAdd = () => {
    setModalTitle("Add");
    setData(null);
    reset();
    toggleModal();
  };

  const handleEdit = async (id) => {
    const resp = await loadCityById(id);
    if (resp) {
      const { location } = resp;
      setModalTitle("Edit");
      toggleModal();
      setData(resp);
      const fields = ["name", "status"];
      fields.forEach((field) => setValue(field, resp[field]));
      setValue("lattitude", location.coordinates[0], { shouldValidate: true });
      setValue("longitude", location.coordinates[1], { shouldValidate: true });
      setValue("state", resp?.state?._id, { shouldValidate: true });
      setValue("country", resp?.country?._id, { shouldValidate: true });
      setSelectedCountry({
        label: resp?.country?.name,
        value: resp?.country?._id,
      });
      setSelectedState({
        label: resp?.state?.name,
        value: resp?.state?._id,
      });
    }
  };

  const handleView = async (id) => {
    const resp = await loadCityById(id);
    if (resp) {
      setModalTitle("View");
      toggleModal();
      setData(resp);
    }
  };

  const handleDelete = async (id) => {
    const resp = await masterService.delete(CITY_PATH + "/" + id);
    if (resp && resp.meta.code === 200) {
      const { meta } = resp;
      utils.showSuccessMsg(meta?.message);
      loadCities(filter);
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

  const onSubmitSearch = async (values) => {
    const { state, city, country } = values;
    if ((country || state || city) === "") {
      utils.showErrMsg("Minimum field is required");
      return false;
    }

    const filterObj = {};
    if (state && state !== "") {
      filterObj.state = [state];
    }
    if (country && country !== "") {
      filterObj.country = [country];
    }

    setFilter({
      ...filter,
      filter: filterObj,
      search: city,
    });
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const handleChange = async () => {
      await loadCities(filter);
    };
    if (isComponentMounted) {
      handleChange();
    }
  }, [isComponentMounted, filter]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const handleReset = () => {
    searchReset();
    setSearchCountrySelected(null);
    setSearchStateSelected(null);
    setCountryOnBlur(false);
    setStateOnBlur(false);
    setFilter({
      ...filter,
      filter: {},
      search: "",
    });
  };

  const [countryOnblur, setCountryOnBlur] = useState(false);
  const [stateOnblur, setStateOnBlur] = useState(false);
  const handleCountryOnBlur = () => setCountryOnBlur(true);
  const handleStateOnBlur = () => setStateOnBlur(true);

  return (
    <div>
      <BreadCrumb pageFor={pageFor} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Row className="m-2">
                <Col md={6} />
                <Col
                  md={6}
                  className="ml-lg-auto d-flex pt-2 pt-md-0 align-items-stretch justify-content-end"
                >
                  <button
                    onClick={handleAdd}
                    className="btn btn-rounded btn-success"
                  >
                    + Add
                  </button>
                </Col>
              </Row>
              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadSearchCountry}
                        onChange={handleSearchCountryChange}
                        placeholder="Select Country"
                        onBlur={handleCountryOnBlur}
                        value={searchCountrySelected}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadSearchStates}
                        onChange={handleSearchStateChange}
                        placeholder="Select State"
                        onBlur={handleStateOnBlur}
                        value={searchStateelected}
                        key={searchCountryWatch}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="City"
                        size="md"
                        {...search("city")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="pb-2">
                  <button
                    disabled={searchIsSubmitting}
                    type="submit"
                    className="btn btn-gradient-primary mr-2"
                  >
                    Search
                  </button>
                  {(isDirty || countryOnblur || stateOnblur) && (
                    <button
                      onClick={handleReset}
                      className="btn btn-gradient-danger mr-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </Form>
              <DataTableRemote
                noHeader={true}
                subHeader={false}
                columns={columns}
                data={dataSource}
                totalRows={totalRows}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                progressPending={spinner}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {modalShow && (
        <ModalCommon
          show={modalShow}
          handleClose={toggleModal}
          size="md"
          modalTitle={modalTitle + " City"}
        >
          {modalTitle && (modalTitle === "Add" || modalTitle === "Edit") && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Row>
                <Col md={6}>
                  <Form.Label>Country <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <AsyncSelect
                      cacheOptions
                      loadOptions={loadCountry}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      defaultOptions
                    />
                    <p className="text-danger text-start">
                      {errors.country?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>State Name <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <AsyncSelect
                      defaultOptions
                      cacheOptions
                      loadOptions={loadStates}
                      value={selectedState}
                      onChange={handleStateChange}
                      key={countryValWatch}
                    />
                    <p className="text-danger text-start">
                      {errors.state?.message}
                    </p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Label>City <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("name")}
                      type="text"
                      className="form-control"
                      placeholder="City Name"
                    />
                    <p className="text-danger text-start">
                      {errors.name?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>Lattitude <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("lattitude")}
                      type="text"
                      className="form-control"
                      placeholder="Lattitude"
                    />
                    <p className="text-danger text-start">
                      {errors.lattitude?.message}
                    </p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Label>Longitude <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("longitude")}
                      type="text"
                      className="form-control"
                      placeholder="Longitude"
                    />
                    <p className="text-danger text-start">
                      {errors.longitude?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>Status <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Select
                      {...register("status")}
                      type="text"
                      className="form-control"
                      placeholder="Currency Name"
                    >
                      <option value={""}>Select</option>
                      {commonData?.commonStatus?.map((ele, ind) => (
                        <option key={ind} value={ele.code}>
                          {ele.label}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger text-start">
                      {errors.status?.message}
                    </p>
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm font-weight-medium auth-form-btn"
                  type="submit"
                >
                  Submit
                </Button>
                <Button className="btn btn-danger btn-sm" onClick={toggleModal}>
                  Close
                </Button>
              </div>
            </Form>
          )}
          {modalTitle && modalTitle === "View" && data && (
            <Table className="borderless">
              <tbody>
                <tr>
                  <td>
                    <h5>City Name</h5>
                  </td>
                  <td>{data.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>State Name</h5>
                  </td>
                  <td>{data.state?.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Country Name</h5>
                  </td>
                  <td>{data.country?.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Location</h5>
                  </td>
                  <td colSpan={"2"}>
                    {"lattitude : " +
                      data.location?.coordinates[0] +
                      " , " +
                      " longitude : " +
                      data.location?.coordinates[1]}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Status</h5>
                  </td>
                  <td>{getCommonDataVal("userStatus", data.status)}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    commonData: state?.common?.commonData,
  };
};

export default connect(mapStateToProps, null)(Cities);
