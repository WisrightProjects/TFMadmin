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
import { COUNTRY_PATH } from "core/services/apiURL.service";
import { connect } from "react-redux";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Country name is required"),
  isoCode: Yup.string().required("ISO Code is required"),
  phoneCode: Yup.string().required("Pincode is required"),
  currency: Yup.string().required("Currency is required"),
  currencyName: Yup.string().required("Currency name is required"),
  status: Yup.string().required("Status is required"),
});

const Countries = (props) => {
  const { commonData } = props;

  const [pageFor] = useState("Country List");
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState(null);
  const [spinner, setSpinner] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);

  const [reloadList, setReloadList] = useState(false);
  const toggleReloadList = () => setReloadList(!reloadList);

  const columns = [
    {
      name: "Country Name",
      selector: (row) => row.name,
    },
    {
      name: "Phone Code",
      selector: (row) => row.phoneCode,
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
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
    data ? updateCountry(data._id, values) : createCountry(values);
  };

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchFormReset,
    formState: { isSubmitting: searchIsSubmitting, isDirty },
  } = useForm();

  const searchReset = () => {
    searchFormReset();
    setFilter({
      ...filter,
      search: "",
    });
  };

  const onSubmitSearch = async (values) => {
    const { name } = values;
    if (name === "") {
      utils.showErrMsg("Country name is required");
      return false;
    }
    setFilter({
      ...filter,
      search: name,
    });
  };

  const createCountry = async (values) => {
    const resp = await masterService.create(COUNTRY_PATH, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    }
  };

  const updateCountry = async (id, values) => {
    // const { name, status } = values;
    // const payload = { name, status }
    const resp = await masterService.update(COUNTRY_PATH + "/" + id, values);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_UPDATED_SUCC);
      reset();
      toggleModal();
      toggleReloadList();
    }
  };

  const loadCountryById = async (id) => {
    const resp = await masterService.getById(COUNTRY_PATH + "/" + id);
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
    const resp = await loadCountryById(id);
    if (resp) {
      setModalTitle("Edit");
      toggleModal();
      setData(resp);
      const fields = [
        "name",
        "isoCode",
        "phoneCode",
        "currency",
        "currencyName",
        "status",
      ];
      fields.forEach((field) =>
        setValue(field, resp[field], { shouldValidate: true })
      );
    }
  };

  const handleView = async (id) => {
    const resp = await loadCountryById(id);
    if (resp) {
      setModalTitle("View");
      toggleModal();
      setData(resp);
    }
  };

  const loadList = async (filter) => {
    const resp = await masterService.getAllPost(
      COUNTRY_PATH + "/filter",
      filter
    );
    if (resp && resp.meta.code === 200 && resp.data.length > 0) {
      const { data, pagination } = resp;
      setTotalRows(pagination.totalCount);
      setDataSource(data);
    } else {
      setDataSource([]);
    }
  };

  const handleDelete = async (id) => {
    const resp = await masterService.delete(COUNTRY_PATH + "/" + id);
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

  const getCommonDataVal = (key, value) => {
    if (commonData) {
      const data = commonData[key]?.find((ele) => ele.code === value);
      return data ? data.label : "";
    }
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadList = async (filter) => {
      setSpinner(true);
      const resp = await masterService.getAllPost(
        COUNTRY_PATH + "/filter",
        filter
      );
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
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
              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={4}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        size="md"
                        {...search("name")}
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
                  {isDirty && (
                    <button
                      onClick={() => searchReset()}
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
          modalTitle={modalTitle + " Country"}
        >
          {modalTitle && (modalTitle === "Add" || modalTitle === "Edit") && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Row>
                <Col md={6}>
                  <Form.Label>Country Name <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("name")}
                      type="text"
                      placeholder="Country Name"
                      className="h-auto"
                    />
                    <p className="text-danger text-start">
                      {errors.name?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>ISO Code <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("isoCode")}
                      type="text"
                      className="form-control"
                      placeholder="ISO Code"
                    />
                    <p className="text-danger text-start">
                      {errors.isoCode?.message}
                    </p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Label>Phone Code <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("phoneCode")}
                      type="text"
                      className="form-control"
                      placeholder="Phone Code"
                    />
                    <p className="text-danger text-start">
                      {errors.phoneCode?.message}
                    </p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Label>Currency <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("currency")}
                      type="text"
                      className="form-control"
                      placeholder="Currency"
                    />
                    <p className="text-danger text-start">
                      {errors.currency?.message}
                    </p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Label>Currency Name <Required/></Form.Label>
                  <Form.Group className="search-field form-group">
                    <Form.Control
                      {...register("currencyName")}
                      type="text"
                      className="form-control"
                      placeholder="Currency Name"
                    />
                    <p className="text-danger text-start">
                      {errors.currencyName?.message}
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
                    <h5>Country Name</h5>
                  </td>
                  <td>{data.name}</td>
                </tr>
                <tr>
                  <td>
                    <h5>ISO Code</h5>
                  </td>
                  <td>{data.isoCode}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Phone Code</h5>
                  </td>
                  <td>{data.phoneCode}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Currency</h5>
                  </td>
                  <td>{data.currency}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Currency Name</h5>
                  </td>
                  <td>{data.currencyName}</td>
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

export default connect(mapStateToProps, null)(Countries);
