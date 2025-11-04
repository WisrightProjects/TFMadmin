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
import { COUNTRY_PATH, STATE_PATH } from "core/services/apiURL.service";
import { connect } from "react-redux";
import AsyncSelect from "react-select/async";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  name: Yup.string().label("Country").required(),
  stateCode: Yup.string().label("Statecode").required(),
  country: Yup.string().label("Country").required(),
  lattitude: Yup.number()
    .typeError("Lattitude is required")
    .label("Lattitude")
    .required(),
  longitude: Yup.number()
    .typeError("Longitude is required")
    .label("Longitude")
    .required(),
  status: Yup.string().label("Status").required(),
});

const States = (props) => {
  const { commonData } = props;

  const columns = [
    {
      name: "Country Name",
      selector: (row) => row.country?.name,
    },
    {
      name: "State Name",
      selector: (row) => row.name,
    },
    {
      name: "State Code",
      selector: (row) => row.stateCode,
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

  const [pageFor] = useState("State List");
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [countrySelected, setCountrySelected] = useState(null);
  const [isTochedFields, setIsTouchedFields] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);

  const [reloadList, setReloadList] = useState(false);
  const toggleReloadList = () => setReloadList(!reloadList);

  const handleCommonChange = () => setIsTouchedFields(true);

  const getCommonDataVal = (key, val) => {
    const resp =
      commonData && commonData[key]
        ? commonData[key]?.find((e) => e.code === val)
        : "";
    return resp ? resp?.label : "";
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values) => {
    data ? updateState(data._id, values) : createState(values);
  };

  const {
    register: searchRegister,
    handleSubmit: handleSubmitForSearch,
    reset: searchFromReset,
    setValue: searchValue,
  } = useForm();

  const loadCountry = async (value) =>
    new Promise(async (resolve) => {
      filter.search = value;
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

  const handleSearchCountryChange = (value) => {
    handleCommonChange();
    searchValue("country", value._id);
    setCountrySelected({
      label: value?.label,
      value: value?._id,
    });
  };

  const onSearchSubmit = async (values) => {
    const { country, name } = values;

    if ((country || name) === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }

    const filterObj = {};

    if (country !== "") {
      filterObj.country = country && [country];
    }

    setFilter({
      ...filter,
      filter: filterObj,
      search: name,
    });
  };

  const searchReset = () => {
    searchFromReset();
    setFilter({
      ...filter,
      filter: {},
      search: "",
    });
    setCountrySelected(null);
    setIsTouchedFields(false);
  };

  const loadCountries = async () => {
    const listUrl = COUNTRY_PATH + "/filter";
    const filterObj = { skip: 0, limit: 1000, filter: {} };
    const resp = await masterService.getAllPost(listUrl, filterObj);
    if (resp && resp.meta.code === 200 && resp.data.length > 0) {
      setCountries(resp.data);
    }
  };

  const createState = async (values) => {
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
    const resp = await masterService.create(STATE_PATH, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    }
  };

  const updateState = async (id, values) => {
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
    const resp = await masterService.update(STATE_PATH + "/" + id, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_UPDATED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    }
  };

  const loadStateById = async (id) => {
    const resp = await masterService.getById(STATE_PATH + "/" + id);
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
    const resp = await loadStateById(id);
    if (resp) {
      const { location } = resp;
      setModalTitle("Edit");
      toggleModal();
      setData(resp);
      const fields = ["name", "stateCode", "status"];
      fields.forEach((field) => setValue(field, resp[field]));
      setValue("lattitude", location.coordinates[0], { shouldValidate: true });
      setValue("longitude", location.coordinates[1], { shouldValidate: true });
      setValue("country", resp?.country?._id);
    }
  };

  const handleView = async (id) => {
    const resp = await loadStateById(id);
    if (resp) {
      setModalTitle("View");
      toggleModal();
      setData(resp);
    }
  };

  const loadList = async (filter) => {
    const listUrl = STATE_PATH + "/filter";
    const resp = await masterService.getAllPost(listUrl, filter);
    if (resp && resp.meta.code === 200) {
      const { data, pagination } = resp;
      setTotalRows(data.length > 0 ? pagination.totalCount : 0);
      setDataSource(data.length > 0 ? data : []);
      // loadCountries();
    } else {
      setDataSource([]);
    }
  };

  const handleDelete = async (id) => {
    const resp = await masterService.delete(STATE_PATH + "/" + id);
    if (resp && resp.meta.code === 200) {
      const { meta } = resp;
      utils.showSuccessMsg(meta?.message);
      loadList(filter);
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

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadList = async (filter) => {
      setSpinner(true);
      const listUrl = STATE_PATH + "/filter";
      const resp = await masterService.getAllPost(listUrl, filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(data.length > 0 ? pagination.totalCount : 0);
        setDataSource(data.length > 0 ? data : []);
        setSpinner(false);
        loadCountries();
      } else {
        setDataSource([]);
      }
    };
    if (isComponentMounted) {
      loadList(filter);
    }
  }, [isComponentMounted, filter, reloadList]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

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
              <Row className="m-2">
                <Col md={12}>
                  <Form
                    className="forms-sample"
                    onSubmit={handleSubmitForSearch(onSearchSubmit)}
                  >
                    <Row>
                      <Col md={4}>
                        <Form.Group className="form-group">
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadCountry}
                            onChange={handleSearchCountryChange}
                            placeholder="Select Country"
                            value={countrySelected}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="form-group">
                          <Form.Control
                            onChange={handleCommonChange}
                            type="text"
                            placeholder="State Name"
                            size="md"
                            {...searchRegister("name")}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <div className="pb-2">
                          <button
                            type="submit"
                            className="btn btn-gradient-primary mr-2"
                          >
                            Search
                          </button>
                          {isTochedFields && (
                            <button
                              onClick={searchReset}
                              className="btn btn-gradient-danger mr-2"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
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
          modalTitle={modalTitle + " State"}
        >
          {modalTitle && (modalTitle === "Add" || modalTitle === "Edit") && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Row>
                <Col md={6}>
                  <Form.Label>
                    Country <Required />
                  </Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Select
                      {...register("country")}
                      type="text"
                      className="form-control"
                    >
                      <option value={""}>Select</option>
                      {countries.map((ele, ind) => (
                        <option key={ind} value={ele._id}>
                          {ele.name}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger text-start">
                      {errors.country?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>
                    State Name <Required />
                  </Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("name")}
                      type="text"
                      placeholder="State Name"
                      className="h-auto"
                    />
                    <p className="text-danger text-start">
                      {errors.name?.message}
                    </p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Label>
                    State Code <Required />
                  </Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("stateCode")}
                      type="text"
                      className="form-control"
                      placeholder="State Code"
                    />
                    <p className="text-danger text-start">
                      {errors.stateCode?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>
                    Lattitude <Required />
                  </Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("lattitude")}
                      type="num"
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
                  <Form.Label>
                    Longitude <Required />
                  </Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("longitude")}
                      type="num"
                      className="form-control"
                      placeholder="Longitude"
                    />
                    <p className="text-danger text-start">
                      {errors.longitude?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>
                    Status <Required />
                  </Form.Label>
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
                    <h5>State Code</h5>
                  </td>
                  <td>{data?.stateCode}</td>
                </tr>
                <tr>
                  <td>
                    <h5>State Name</h5>
                  </td>
                  <td>{data?.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Country</h5>
                  </td>
                  <td>{data?.country?.name}</td>
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

export default connect(mapStateToProps, null)(States);
