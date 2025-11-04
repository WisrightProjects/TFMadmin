import { Button, Card, Col, Form, Row } from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { Fragment, useEffect, useState } from "react";
import { commonService, masterService } from "core/services";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { utils } from "core/helper";
import Actions from "components/actions";
import BreadCrumb from "components/common/breadcrumb";
import { CKEditor } from "ckeditor4-react";
import { FAQ_FILTER } from "core/services/apiURL.service";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  question: Yup.string().required("Question is required"),
  answer: Yup.string().required("Answer is required"),
});

const FAQ = () => {
  const columns = [
    {
      name: "Question",
      selector: (row) => row.question,
      format: (row) => {
        const length = row.question.length;
        return length > 40
          ? row.question.slice(0, 40) + "..."
          : row.question.slice(0, 40);
      },
    },
    {
      name: "Answer",
      selector: (row) => row.answer,
      format: (row) => {
        const length = row.answer.length;
        return (
          <Fragment>
            {/* {length < 40 ? row.answer.slice(0, 40) : row.answer.slice(0, 40) + "..."} */}
            <span
              dangerouslySetInnerHTML={{
                __html:
                  length > 40
                    ? row.answer.slice(0, 40) + "..."
                    : row.answer.slice(0, 40),
              }}
            ></span>
          </Fragment>
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

  // const convertString = (answer) => {
  //     return (
  //         <p dangerouslySetInnerHTML={{ __html: answer }}></p>
  //     )
  // };

  const getActions = (row) => {
    return (
      <Actions
        editOnClick={handleEditFaq}
        viewOnClick={handleViewFaq}
        deleteOnClick={handleDeleteFaq}
        rowId={row._id}
      />
    );
  };

  const [faq, setFaq] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [viewFaq, setViewFaq] = useState({});
  const [isAddMode, setIsAddMode] = useState(true);
  const [faqId, setFaqId] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [answerText, setAnswerText] = useState("");
  const [editorInstance, setEditorInstance] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    skip: 0,
    limit: 10,
  });

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    formState: searchFormState,
    reset: searchReset,
  } = useForm();
  const { errors, isSubmitting } = formState;
  const { isDirty: searchIsDirty, isSubmitting: searchIsSubmitting } =
    searchFormState;

  const loadAllFaq = async () => {
    setSpinner(true);
    const resp = await masterService.getAllPost(FAQ_FILTER, filter);
    if (resp && resp?.meta?.code === 200) {
      const { data: faq_s, pagination } = resp;
      setTotalRows(pagination.totalCount);
      setFaq(faq_s);
      setSpinner(false);
    }
  };

  const onSubmit = (value) => {
    isAddMode ? createFaq(value) : updateFaq(faqId, value);
  };

  const createFaq = async (value) => {
    const resp = await commonService.createFaq(value);
    const { meta } = resp;
    if (meta.code === 200) {
      utils.showSuccessMsg(meta?.message);
      reset();
      handleModalClose();
      loadAllFaq();
    } else {
      utils.showErrMsg(meta.message);
      return false;
    }
  };

  const updateFaq = async (faqId, value) => {
    const resp = await commonService.updateFaq(faqId, value);
    const { meta } = resp;
    if (meta.code === 200) {
      utils.showSuccessMsg(meta?.message);
      reset();
      handleModalClose();
      loadAllFaq();
    }
  };

  const loadFaq = async (id) => {
    const getFaq = await commonService.getFaq(id);
    const { data } = getFaq;
    const fields = ["question", "answer"];
    fields.forEach((field) => setValue(field, data[field]));
    setAnswerText(data.answer);
  };

  const handleModalShow = () => setModalShow(true);

  const handleModalClose = () => {
    setModalShow(false);
    reset();
  };

  const handleAddFaq = () => {
    handleModalShow();
    setModalTitle("Add FAQ");
    setAnswerText("");
  };

  const handleViewFaq = async (id) => {
    setModalTitle("View FAQ");
    handleModalShow();
    const resp = await commonService.getFaq(id);
    setViewFaq(resp ? resp.data : {});
  };

  const handleEditFaq = async (id) => {
    setModalTitle("Edit FAQ");
    handleModalShow();
    setIsAddMode(false);
    setFaqId(id);
    loadFaq(id);
  };

  const handleDeleteFaq = async (id) => {
    await commonService.deleteFaq(id);
    loadAllFaq();
  };

  const handleInstanceReady = ({ editor }) => {
    setEditorInstance(editor);
  };

  const handleDescriptionChange = ({ editor }) => {
    const data = editor.getData();
    setValue("answer", data);
    setAnswerText(data);
  };

  useEffect(() => {
    if (editorInstance) {
      editorInstance.setData(answerText);
    }
  }, [editorInstance]);

  useEffect(() => {
    if (editorInstance) {
      editorInstance.setData(answerText);
    }
  }, [answerText]);

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
    const handleChange = async () => {
      await loadAllFaq(filter);
    };
    if (isComponentMounted) {
      handleChange();
    }
  }, [isComponentMounted, filter]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const onSubmitSearch = async (values) => {
    const { question } = values;
    if (question === "") {
      utils.showErrMsg("Question is required");
      return false;
    }

    setFilter({
      ...filter,
      search: question,
    });
  };

  const handleReset = () => {
    searchReset();
    setFilter({
      ...filter,
      search: "",
    });
  };

  return (
    <div>
      <BreadCrumb pageFor="FAQ" listUrl="FAQ" />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Row className="m-2">
                <Col md={6} />
                <Col
                  md={6}
                  className="ml-lg-auto d-flex pt-5 align-items-stretch justify-content-end"
                >
                  <button
                    onClick={handleAddFaq}
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
                        placeholder="Enter Question"
                        size="md"
                        {...searchRegister("question")}
                      />
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
                          onClick={handleReset}
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
                title="FAQ"
                noHeader={true}
                subHeader={false}
                columns={columns}
                data={faq}
                addLink={handleAddFaq}
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
          size="md"
          modalTitle={modalTitle}
        >
          {modalTitle &&
            (modalTitle === "Add FAQ" || modalTitle === "Edit FAQ") && (
              <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                <Form.Label>Question  <Required/></Form.Label>
                <Form.Group className="search-field form-group">
                  <Form.Control
                    {...register("question")}
                    type="text"
                    placeholder="Question"
                    className="h-auto"
                  />
                  <p className="text-danger text-start">
                    {errors.question?.message}
                  </p>
                </Form.Group>
                <Form.Label>Answer  <Required/></Form.Label>
                <Form.Group className="search-field form-group">
                  <CKEditor
                    {...register("answer")}
                    initData={answerText}
                    onInstanceReady={handleInstanceReady}
                    onChange={handleDescriptionChange}
                  />
                  <p className="text-danger text-start">
                    {errors.answer?.message}
                  </p>
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
          {modalTitle && modalTitle === "View FAQ" && viewFaq && (
            <div className="table-responsive">
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
                      <h5 className="text-bold">Question</h5>
                    </td>
                    <td>{viewFaq.question}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Answer</h5>
                    </td>
                    <td
                      dangerouslySetInnerHTML={{ __html: viewFaq.answer }}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </ModalCommon>
      )}
    </div>
  );
};

export default FAQ;
