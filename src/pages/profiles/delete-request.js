import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { Fragment, useEffect, useState } from "react";
import Actions from "components/actions";
import { CONST, utils } from "core/helper";
import DataTableRemote from "components/data-table";
import { masterService, usersService } from "core/services";
import { connect } from "react-redux";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { USER_PROFILE } from "core/services/apiURL.service";
import moment from "moment";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  remark: Yup.string().label("Remarks").required(),
});

const DeleteRequest = (props) => {
  const { commonData } = props;
  const [dataSource, setDataSource] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(CONST.DEFAULT_PER_PAGE);
  const [filter, setFilter] = useState({ ...CONST.DELETE_REQ_FILTER });
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [viewUser, setViewUser] = useState({});
  const [userData, setUserData] = useState(null);
  console.log("userData::", userData);
  const [spinner, setSpinner] = useState(true);
  const handleModalShow = () => setModalShow(true);
  const handleModalClose = () => {
    setModalShow(false);
    reset();
  };

  const columns = [
    {
      name: "Matri ID",
      selector: (row) => row?.profileID || "",
    },
    {
      name: "Profile Name",
      selector: (row) => row?.userName || "",
    },
    {
      name: "Phone",
      selector: (row) => row?.phone || "",
    },
    {
      name: "Email",
      selector: (row) => row?.email || "",
    },
    {
      name: "Marital Status",
      selector: (row) => {
        const { maritalStatus } = row;
        const { maritalStatus: maritalStatusList } = commonData;
        const data = maritalStatusList
          ? maritalStatusList.find((ele) => ele.code === maritalStatus)
          : {};
        return data?.label || "";
      },
    },
    {
      name: "Reason",
      selector: (row) => {
        const { defaultReasonToDel, reasonForDel } = row;
        const { deleteProfileReason } = commonData;
        const data = deleteProfileReason
          ? deleteProfileReason.find((ele) => ele.code === defaultReasonToDel)
          : {};
        return defaultReasonToDel === 50 ? reasonForDel : (data?.label || "");
      },
    },
    {
      name: "Status",
      selector: (row) => {
        const { status } = row;
        const { userStatus } = commonData;
        const data = userStatus
          ? userStatus.find((ele) => ele.code === status)
          : {};
        let class_name = "";
        switch (status) {
          case 10:
            class_name = "btn-success";
            break;
          case 20:
            class_name = "btn-warning";
            break;
          case 30:
            class_name = "btn-danger";
            break;
          default:
            class_name = "btn-success";
            break;
        }
        return (
          <button type="button" className={`btn ${class_name} btn-sm`}>
            {data?.label}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Actions rowId={row._id} viewOnClick={handleViewDeleteReq} />
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
      filter: {},
    });
  };

  const handleViewDeleteReq = (id) => {
    setModalTitle("Approve Delete Request");
    handleModalShow();
    const deleteReqObj = dataSource.find((ele) => ele._id === id);
    setViewUser(deleteReqObj);
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
    const { email, profileID, name, phone } = values;

    if ((profileID || email || name || phone) === "") {
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
    if (phone !== "") {
      filterObj.phone = phone;
    }
    if (profileID !== "") {
      filterObj.profileID = profileID;
    }
    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const onSubmit = async (values) => {
    console.log("values::", values);
    const { remark, type } = values;
    const deleteResponse = await usersService.approveDeleteRequest(
      viewUser._id,
      type,
      { remark: remark }
    );
    const { meta } = deleteResponse;
    if (deleteResponse && meta.code === 200) {
      handleModalClose();
      utils.showSuccessMsg(meta.message);
      setFilter({
        ...filter,
      });
    }
  };

  useEffect(() => {
    if (viewUser?.profileID) {
      const getUser = async (profileID) => {
        const resp = await masterService.getById(
          USER_PROFILE + "/" + profileID
        );
        if (resp && resp?.meta?.code === 200) {
          setUserData(resp.data);
        }
      };
      getUser(viewUser?.profileID);
    }
  }, [viewUser?.profileID]);

  const readReason = (request) => {
    const { defaultReasonToDel, reasonForDel } = request;
    const { deleteProfileReason } = commonData;
    const data = deleteProfileReason
      ? deleteProfileReason.find((ele) => ele.code === defaultReasonToDel)
      : {};
    return defaultReasonToDel === 50 ? reasonForDel : (data?.label || "");
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const getDeleteRequest = async (filter) => {
      setSpinner(true);
      const resp = await usersService.profileDeleteRequest(filter);
      if (resp && resp.meta.code === 200) {
        const { data, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setDataSource(data);
        setSpinner(false);
      }
    };
    if (isComponentMounted) {
      getDeleteRequest(filter);
    }
  }, [filter, isComponentMounted]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const getCommonDataVal = (key, value) => {
    const data = commonData[key]?.find((ele) => ele.code === value);
    return data ? data?.label : "";
  };

  console.log("viewUser::", viewUser);
  return (
    <Fragment>
      <BreadCrumb pageFor="Delete Request" listUrl="Delete Request" />
      <Card>
        <Card.Body>
          <Form
            className="forms-sample"
            onSubmit={searchHandleSubmit(onSubmitSearch)}
          >
            <Row>
              <Col md={3}>
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    placeholder="Matri Id"
                    size="md"
                    {...search("profileID")}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="form-group">
                  <Form.Control
                    type="number"
                    size="md"
                    {...search("phone")}
                    placeholder="Phone"
                    className="custome_num_input"
                    pattern="\d*"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    size="md"
                    {...search("name")}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    size="md"
                    {...search("email")}
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
                  onClick={searchReset}
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
      {modalShow && (
        <ModalCommon
          size="md"
          show={modalShow}
          handleClose={handleModalClose}
          modalTitle={modalTitle}
        >
          {modalTitle && modalTitle === "Approve Delete Request" && (
            <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
              <div className="">
                <h5>
                  <u>User Details</u>
                </h5>
              </div>
              <Table>
                <tr>
                  <th>Profile ID:</th>
                  <td>{viewUser.profileID}</td>
                </tr>
                <tr>
                  <th>Profile Name:</th>
                  <td>{viewUser.userName}</td>
                </tr>
                <tr>
                  <th>Gender:</th>
                  <td>{getCommonDataVal("gender", viewUser.gender)}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{viewUser.email}</td>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td>{viewUser.phone}</td>
                </tr>
                <tr>
                  <th>Reason :</th>
                  <td>{readReason(viewUser)}</td>
                </tr>
              </Table>
              {userData?.deleteProfiletimeLine?.length > 0 && (
                <Fragment>
                  <div className="">
                    <h5>
                      <u>Timeline</u>
                    </h5>
                  </div>
                  <table className="table border">
                    <thead>
                      <tr>
                        <th>Remarks</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.deleteProfiletimeLine?.map((ele, ind) => (
                        <tr key={ind}>
                          <td>{ele?.revertRemark}</td>
                          <td>{moment(ele?.updatedAt).format("DD-MM-YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Fragment>
              )}
              <div className="">
                <h5>
                  <u>Remarks </u><Required/>
                </h5>
              </div>
              <Form.Group className="search-field form-group">
                <Form.Control
                  as={"textarea"}
                  rows={"5"}
                  {...register("remark")}
                  placeholder="Delete Request Comment"
                  className="h-auto"
                />
                <p className="text-danger text-start">
                  {errors.remark?.message}
                </p>
              </Form.Group>
              <div className="row mt-3">
                <div className="col-md-6">
                  <button
                    disabled={isSubmitting}
                    onClick={() => {
                      setValue("type", 10, {
                        shouldValidate: true,
                      });
                    }}
                    className="btn btn-primary btn-sm font-weight-medium auth-form-btn"
                    type="submit"
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-success btn-sm font-weight-medium auth-form-btn"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {
                      setValue("type", 20, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    Revert
                  </button>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-end">
                    <Button
                      className="btn btn-danger btn-sm"
                      onClick={handleModalClose}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </ModalCommon>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    commonData: state?.common?.commonData,
    user: state?.account?.authUser,
  };
};

export default connect(mapStateToProps, null)(DeleteRequest);
