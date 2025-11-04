import { Button, Card, Col, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { useEffect, useState } from "react";
import { commonService } from "core/services";
import Actions from "components/actions";
import { VIEW_PROFILE, ADD_PROFILE, EDIT_PROFILE } from "pages/routes/routes";
import BreadCrumb from "components/common/breadcrumb";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { INACTIVE_USERS, PROFILE_URL } from "core/services/apiURL.service";
import { CONST, utils } from "core/helper";
import { connect } from "react-redux";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  status: Yup.number().required("Status is required"),
});

const InActiveUsers = (props) => {
  const { commonData } = props;

  const columns = [
    {
      name: "Matri ID",
      selector: (row) => row.profileID,
    },
    {
      name: "Name",
      selector: (row) => row.user.name,
    },
    {
      name: "Phone",
      selector: (row) => row.user.phone,
    },
    {
      name: "Email",
      selector: (row) => row.user.email,
    },
    {
      name: "Plan",
      selector: (row) => "Free",
    },
    {
      name: "CreatedBy",
      selector: (row) => "Staff",
    },
    {
      name: "UpdatedBy",
      selector: (row) => "Staff",
    },
    {
      name: "Status",
      selector: (row) => {  
        const { status } = row.user;
        const { userStatus } = commonData;
        const data = userStatus
          ? userStatus.find((ele) => ele.code === status)
          : {};
        let class_name = "";
        switch (data.code) {
          case 10:
            class_name = "btn-success";
            break;
          case 20:
            class_name = "btn-danger";
            break;
          case 30:
            class_name = "btn-info";
            break;

          default:
            class_name = "btn-primary";
            break;
        }
        return (
          <button
            type="button"
            onClick={() => handleStatusChange(row)}
            className={`btn ${class_name} btn-sm`}
          >
            {data.label}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Actions
          viewUrl={VIEW_PROFILE + "/" + row.profileID}
          editUrl={EDIT_PROFILE + "/" + row.profileID}
          // editOnClick={handleProfileEdit}
          rowId={row._id}
        />
      ),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const [pageFor] = useState("In Acitve Users");
  const [dataSource, setDataSource] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });

  const [modalShow, setModalShow] = useState(false);
  const [profile, setProfile] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  const handleModalShow = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchFromReset,
    formState: { isDirty, isSubmitting: searchIsSubmitting },
  } = useForm();

  const handleStatusChange = (profile) => {
    setModalTitle("Change Profile Status");
    setProfile(profile);
    setValue("status", profile.user.status);
    handleModalShow();
  };

  const onSubmit = async (value) => {
    const resp = await commonService.create(
      PROFILE_URL + "/change-status/" + profile.profileID,
      value
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      reset();
      handleModalClose();
      setFilter({
        ...filter,
        filter: {},
      });
    }
  };

  const inActiveUsers = async () => {
    const resp = await commonService.inActiveUsers(INACTIVE_USERS);
    if (resp && resp.meta.code === 200) {
      const { data, pagination } = resp;
      setTotalRows(data.length > 0 ? pagination.totalCount : 0);
      setDataSource(data.length > 0 ? data : []);
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

  const handleStatusFilter = (eve) => {};

  const searchReset = () => {
    searchFromReset();
    setFilter({
      ...filter,
      filter: {},
    });
  };

  const onSubmitSearch = async (values) => {
    const { name, profileID, email } = values;
    if (email === "" && profileID === "" && name === "") {
      utils.showErrMsg("Atleast minimum field is required");
      return false;
    }
    const filterObj = {};
    if (email !== "") {
      filterObj.email = email;
    }
    if (name !== "") {
      filterObj.name = name;
    }
    if (profileID !== "") {
      filterObj.profileID = profileID;
    }
    
    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const handleChange = async () => {
      await inActiveUsers();
    };
    if (isComponentMounted) {
      handleChange();
    }
  }, [isComponentMounted, filter]);

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
                <Col md={6}></Col>
                <Col
                  md={6}
                  className="ml-lg-auto d-flex pt-2 pt-md-0 align-items-stretch justify-content-end"
                >
                  <Link className="nav-link" to={ADD_PROFILE}>
                    <button className="btn btn-rounded btn-success">
                      + Add
                    </button>
                  </Link>
                </Col>
              </Row>

              <Form
                className="forms-sample"
                onSubmit={searchHandleSubmit(onSubmitSearch)}
              >
                <Row>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Matimony Id"
                        size="md"
                        {...search("profileID")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        size="md"
                        {...search("name")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Useremail"
                        size="md"
                        {...search("email")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Select
                        className="form-control"
                        onChange={handleStatusFilter}
                      >
                        <option value="all">All</option>
                        <option value="10">Active</option>
                        <option value="20">In-Active</option>
                        <option value="30">Deleted</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="pb-2 d-flex justify-content-end">
                  <button
                    disabled={searchIsSubmitting}
                    type="submit"
                    className="btn btn-gradient-primary mr-2"
                  >
                    Search
                  </button>
                  {isDirty && (
                    <button
                      onClick={searchReset}
                      type="reset"
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
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {modalShow && (
        <ModalCommon
          show={modalShow}
          handleClose={handleModalClose}
          size="md"
          modalTitle={modalTitle}
        >
          {modalTitle && modalTitle === "Change Profile Status" && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <Form.Group className="search-field form-group">
                <div className="d-flex">
                  {commonData.userStatus &&
                    commonData.userStatus.map((ele, ind) => {
                      return (
                        <Form.Check key={ind}>
                          <Form.Check.Label>
                            <Form.Check.Input
                              type="radio"
                              name="status"
                              value={ele.code}
                              {...register("status")}
                            />
                            <i className="input-helper"></i> {ele.label}
                          </Form.Check.Label>
                        </Form.Check>
                      );
                    })}
                </div>
                <p className="text-danger">{errors.status?.message}</p>
              </Form.Group>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm font-weight-medium auth-form-btn"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  className="btn btn-danger btn-sm"
                  onClick={handleModalClose}
                >
                  Close
                </Button>
              </div>
            </Form>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    commonData: state?.common?.commonData,
    user: state?.account?.authUser,
  };
};

export default connect(mapStateToProps, null)(InActiveUsers);
