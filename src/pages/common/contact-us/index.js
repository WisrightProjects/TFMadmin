import { Card, Col, Form, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { Fragment, useEffect, useState } from "react";
import { commonService, masterService } from "core/services";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CONST, utils } from "core/helper";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import {
  CONTACT_US_FILTER,
  REPLY_CONTACT_US,
} from "core/services/apiURL.service";
import { useSelector } from "react-redux";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  reply: Yup.string().label("Reply").required(),
  status: Yup.string().label("Status").required(),
});

const ContactUs = () => {
  const commonData = useSelector((state) => state?.common?.commonData);

  const columns = [
    {
      name: "Subject",
      selector: (row) => row.subject,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobileNo,
    },
    {
      name: "Status",
      selector: (row) => {
        const { status } = row;
        const { contactusStatus } = commonData;
        const data = contactusStatus
          ? contactusStatus.find((ele) => ele?.code === status)
          : {};
        let class_name = "";
        switch (data?.code) {
          case 10:
            class_name = "btn-success";
            break;
          case 20:
            class_name = "btn-primary";
            break;
          case 30:
            class_name = "btn-danger";
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
      cell: (row) => getActions(row),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const getActions = (row) => {
    return <Actions viewOnClick={handleViewContactUs} rowId={row} />;
  };

  const [contactUs, setContactUs] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [viewContactUs, setViewContactUs] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [replyShow, setReplyShow] = useState(false);
  const [contactReplyed, setContactReplyed] = useState("");
  const [spinner, setSpinner] = useState(true);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_ADV_FILTER });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors, isSubmitting } = formState;
  const handleReplyShow = () => setReplyShow(!replyShow);

  const handleModalShow = () => setModalShow(true);

  const handleModalClose = () => {
    setModalShow(false);
    reset();
    setReplyShow(false);
  };

  const handleViewContactUs = async (row) => {
    setContactReplyed(row?.status);
    setModalTitle("View Contact Us");
    handleModalShow();
    const resp = await commonService.getContactUs(row._id);
    setViewContactUs(resp ? resp.data : {});
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

  useEffect(() => {
    const loadAllContactUs = async () => {
      setSpinner(true);
      const resp = await masterService.getAllPost(CONTACT_US_FILTER, filter);
      if (resp && resp?.meta?.code === 200) {
        const { data: contacts, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setContactUs(contacts);
        setSpinner(false);
      }
    };
    loadAllContactUs();
  }, [filter]);

  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    formState: searchFormState,
    reset: searchReset,
  } = useForm();
  const { isDirty: searchIsDirty, isSubmitting: searchIsSubmitting } =
    searchFormState;

  const onSubmitSearch = async (values) => {
    const { email, phone, status, subject } = values;
    console.log("status::", status);
    if ((email || phone || subject || status) === "") {
      utils.showErrMsg("Minimum field is required");
      return false;
    }

    const filterObj = {};
    if (subject !== "") {
      filterObj.subject = subject;
    }

    if (email !== "") {
      filterObj.email = email;
    }

    if (phone !== "") {
      filterObj.phone = phone;
    }

    if (status !== "") {
      filterObj.status = Number(status);
    }

    if (status === "All") {
      delete filterObj.status;
      setFilter({
        ...filter,
        filter: filterObj,
      });
    }

    setFilter({
      ...filter,
      filter: filterObj,
    });
  };

  const handleResetSearch = () => {
    searchReset();
    setFilter({
      ...filter,
      filter: {},
    });
  };

  const onSubmitHandleReply = async (values) => {
    const resp = await masterService.getAllPost(
      REPLY_CONTACT_US + "/" + viewContactUs?._id,
      values
    );
    if (resp && resp?.meta?.code === 200) {
      const { meta } = resp;
      utils.showSuccessMsg(meta?.message);
      handleModalClose();
    }
  };

  const handleReplyCancel = () => {
    reset();
    setReplyShow(false);
  };

  return (
    <div>
      <BreadCrumb pageFor="Contact Us" listUrl="Contact Us" />
      <Row>
        <Col xl={12}>
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
                        placeholder="Enter Subject"
                        size="md"
                        {...searchRegister("subject")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Email"
                        size="md"
                        {...searchRegister("email")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Mobile"
                        size="md"
                        {...searchRegister("phone")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Select
                        className="form-control"
                        {...searchRegister("status")}
                      >
                        <option>All</option>
                        {commonData?.contactusStatus?.map((ele, ind) => (
                          <option key={ind} value={ele.code}>
                            {ele.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <div className="pb-2 d-flex justify-content-start">
                      <button
                        disabled={searchIsSubmitting}
                        type="submit"
                        className="btn btn-gradient-primary mr-2"
                      >
                        Search
                      </button>
                      {searchIsDirty && (
                        <button
                          onClick={handleResetSearch}
                          type="reset"
                          className="btn btn-gradient-danger mr-2"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
              <DataTableRemote
                title="Contact Us"
                columns={columns}
                data={contactUs}
                noHeader={true}
                subHeader={false}
                handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
                totalRows={totalRows}
                progressPending={spinner}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {modalShow && (
        <ModalCommon
          show={modalShow}
          handleClose={handleModalClose}
          size="lg"
          modalTitle={modalTitle}
          scrollable={true}
        >
          {modalTitle && modalTitle === "View Contact Us" && viewContactUs && (
            <div className="table-responsive">
              <Form onSubmit={handleSubmit(onSubmitHandleReply)}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h5 className="text-bold">Name</h5>
                      </td>
                      <td>{viewContactUs.name}</td>
                    </tr>
                    <tr>
                      <td>
                        <h5 className="text-bold">Email</h5>
                      </td>
                      <td>{viewContactUs.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <h5 className="text-bold">Mobile</h5>
                      </td>
                      <td>{viewContactUs.mobileNo}</td>
                    </tr>
                    <tr>
                      <td>
                        <h5 className="text-bold">Subject</h5>
                      </td>
                      <td>{viewContactUs.subject}</td>
                    </tr>
                    <tr>
                      <td>
                        <h5 className="text-bold">Raised Message</h5>
                      </td>
                      <td>{viewContactUs.raisedMessage}</td>
                    </tr>
                    {!replyShow && contactReplyed === 10 && (
                      <tr>
                        <td></td>
                        <td>
                          <button
                            type="button"
                            onClick={handleReplyShow}
                            className="btn btn-primary btn-sm"
                          >
                            Reply
                          </button>
                        </td>
                      </tr>
                    )}
                    {replyShow && (
                      <Fragment>
                        <tr>
                          <td>Reply Message <Required/></td>
                          <td>
                            <Form.Group className="search-field form-group">
                              <Form.Control
                                {...register("reply")}
                                as={"textarea"}
                                rows={10}
                                placeholder="Name"
                                className="h-auto"
                              />
                              <p className="text-danger text-start">
                                {errors.reply?.message}
                              </p>
                            </Form.Group>
                          </td>
                        </tr>
                        <tr>
                          <td>Status <Required/></td>
                          <td>
                            <Form.Group className="search-field form-group">
                              <Form.Select
                                {...register("status")}
                                className="form-control"
                              >
                                <option value={""}>Select</option>
                                {commonData?.adminContactUsStatus?.map(
                                  (ele, ind) => (
                                    <option key={ind} value={ele.code}>
                                      {ele.label}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                              <p className="text-danger text-start">
                                {errors.status?.message}
                              </p>
                            </Form.Group>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <button
                              disabled={isSubmitting}
                              type="submit"
                              className="btn btn-primary btn-sm"
                            >
                              Submit
                            </button>
                            <button
                              onClick={handleReplyCancel}
                              className="btn btn-danger btn-sm"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  </tbody>
                </table>
              </Form>
            </div>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default ContactUs;
