import {
  Button,
  Card,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import DataTableRemote from "components/data-table";
import { Fragment, useEffect, useRef, useState } from "react";
import { commonService, masterService } from "core/services";
import ModalCommon from "components/modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CONST, utils } from "core/helper";
import Actions from "components/actions";
import { CKEditor } from "ckeditor4-react";
import BreadCrumb from "components/common/breadcrumb";
import moment from "moment";
import { BLOG_FILTER } from "core/services/apiURL.service";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .matches("^[0-9a-zA-Z \b]+$", "Invalid title, is required")
    .required(),
  blogImg: Yup.mixed().required("Blog image is required"),
  description: Yup.string().required("Description is required"),
});

const Blog = () => {
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "URI",
      selector: (row) => row.uri,
    },
    {
      name: "Author",
      selector: (row) => row.author,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.createdAt).format("DD-mm-yyyy"),
    },
    {
      name: "Action",
      cell: (row) => getActions(row),
      ignoreRowClick: true,
      grow: 1,
    },
  ];

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors, isSubmitting } = formState;

  const getActions = (row) => {
    return (
      <Actions
        editOnClick={handleEditBlog}
        viewOnClick={handleViewBlog}
        deleteOnClick={handleDeleteBlog}
        rowId={row.uri}
        id={row._id}
      />
    );
  };
  const fileInputRef = useRef();
  const [pageFor] = useState("Blogs");
  const [blog, setBlog] = useState([]);
  const [data, setData] = useState();

  const [getData, setGetData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [blogId, setBlogId] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [editorInstance, setEditorInstance] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [img, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const [filter, setFilter] = useState({ ...CONST.DEFAULT_FILTER });
  const [reloadList, setReloadList] = useState(false);
  const imageDomain = process.env.REACT_APP_IMAGE_PATH;
  const imgSrc =
    imageDomain + data?.blogImg?.imagePath + data?.blogImg?.originalImage;
  const {
    register: search,
    handleSubmit: searchHandleSubmit,
    reset: searchReset,
    formState: { isDirty, isSubmitting: searchIsSubmitting },
  } = useForm();
  const toggleReloadList = () => setReloadList(!reloadList);

  const onSubmitSearch = async (values) => {
    const { title } = values;
    if (title === "") {
      utils.showErrMsg("Title is required");
      return false;
    }

    setFilter({
      ...filter,
      search: title,
    });
  };

  const loadBlog = async (id) => {
    const resp = await commonService.getBlog(id);
    if (resp && resp.meta.code === 200) {
      return resp.data;
    }
    return false;
  };

  const onSubmit = (value) =>
    data ? updateBlog(blogId, value) : createBlog(value);

  const createBlog = async (value) => {
    const { title, description } = value;
    const payload = {
      title,
      description,
      blogImg: imageId,
    };
    const resp = await commonService.createBlog(payload);
    const { meta } = resp;
    if (meta.code === 200) {
      utils.showSuccessMsg(meta.message);
      reset();
      handleModalClose();
      toggleReloadList();
    } else {
      utils.showErrMsg(meta.message);
      return false;
    }
  };

  const updateBlog = async (blogId, value) => {
    const { title, description } = value;
    const payload = {
      title,
      description,
      blogImg: imageId ? imageId : undefined,
    };
    const resp = await commonService.updateBlog(blogId, payload);
    const { meta } = resp;
    if (meta.code === 200) {
      utils.showSuccessMsg(meta.message);
      reset();
      handleModalClose();
      toggleReloadList();
    } else {
      utils.showErrMsg(meta.message);
      return false;
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    file ? setImage(file) : setImage(null);
  };

  const handleUploadImg = async () => {
    const formData = new FormData();
    formData.append("type", 30);
    formData.append("images", img);
    const resp = await commonService.imageUpload(formData);
    if (resp && resp.meta.code === 200) {
      setValue("blogImg", img, { shouldValidate: true });
      const { data } = resp;
      setImageId(data[0]._id);
    }
  };

  const handleCancelBlogImg = () => {
    setPreviewImg(null);
    setImage(null);
    fileInputRef.current.value = null;
  };

  const handleModalShow = () => setModalShow(true);

  const handleModalClose = () => {
    setModalShow(false);
    setDescriptionText("");
    reset();
    setPreviewImg(null);
    setImage(null);
    setImageId("");
  };

  const handleAddBlog = () => {
    handleModalShow();
    setModalTitle("Add Blog");
    setBlogId("");
    setGetData(null);
  };

  const handleEditBlog = async (id) => {
    const resp = await loadBlog(id);
    setModalTitle("Edit Blog");
    handleModalShow();
    setBlogId(id);
    if (resp) {
      setData(resp);
      setGetData(resp)
      setDescriptionText(resp.description);
      const fields = ["title", "description"];
      fields.forEach((field) => setValue(field, resp[field]));
      setValue("description", resp.description);
      setValue("blogImg", [resp?.blogImg?._id], { shouldValidate: true });
    }
  };

  const handleViewBlog = async (id) => {
    const resp = await loadBlog(id)
    if(resp){
      setModalTitle("View Blog");
      handleModalShow();
      setGetData(resp);
    }
  };

  const handleDeleteBlog = async (uri, id) => {
    const resp = await commonService.deleteBlog(id);
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      toggleReloadList();
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

  const handleDescriptionChange = ({ editor }) => {
    const data = editor.getData();
    setValue("description", data);
    setDescriptionText(data);
  };

  const handleInstanceReady = ({ editor }) => {
    setEditorInstance(editor);
  };

  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    const loadAllBlog = async () => {
      setSpinner(true);
      const resp = await masterService.getAllPost(BLOG_FILTER, filter);
      if (resp && resp?.meta?.code === 200) {
        const { data: blogs, pagination } = resp;
        setTotalRows(pagination.totalCount);
        setBlog(blogs);
        setSpinner(false);
      }
    };
    const handleChange = async () => {
      await loadAllBlog(filter);
    };
    if (isComponentMounted) {
      handleChange();
    }
  }, [isComponentMounted, filter, reloadList]);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  useEffect(() => {
    if (editorInstance) {
      editorInstance.setData(descriptionText);
    }
  }, [editorInstance]);

  useEffect(() => {
    if (editorInstance) {
      editorInstance.setData(descriptionText);
    }
  }, [data]);

  useEffect(() => {
    if (img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(img);
    } else {
      setPreviewImg(null);
    }
  }, [img]);

  const handleReset = () => {
    searchReset();
    setFilter({
      ...filter,
      search: "",
    });
  };

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
                    onClick={handleAddBlog}
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
                  <Col md={3}>
                    <Form.Group className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        size="md"
                        {...search("title")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
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
                noHeader={true}
                subHeader={false}
                title="Blog"
                columns={columns}
                data={blog}
                addLink={handleAddBlog}
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
        >
          {modalTitle &&
            (modalTitle === "Add Blog" || modalTitle === "Edit Blog") && (
              <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                <Row>
                  <Col md={2}>
                    <Form.Label>Title  <Required/></Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="search-field form-group">
                      <Form.Control
                        {...register("title")}
                        type="text"
                        placeholder="Title"
                        className="h-auto w-25"
                      />
                      <p className="text-danger text-start">
                        {errors.title?.message}
                      </p>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={2}>
                    <Form.Label>Blog Image  <Required/></Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="search-field form-group">
                      <Form.Group className="search-field form-group">
                        <Form.Control
                          {...register("blogImg")}
                          type="file"
                          className="h-auto w-25"
                          ref={fileInputRef}
                          onChange={(e) => handleImageChange(e)}
                          disabled={img}
                        />
                        {blogId && (
                          <a href={imgSrc} rel="noreferrer" target={"_blank"}>
                            View Blog Image
                          </a>
                        )}
                      </Form.Group>

                      {previewImg && (
                        <div className="d-block">
                          <div>
                            <img alt="blog-img" src={previewImg} width={250} height={250} />
                          </div>
                          {!imageId && (
                            <Fragment>
                              <button
                                onClick={handleUploadImg}
                                className="btn btn-rounded btn-success btn-sm mt-2"
                                type="button"
                              >
                                Upload
                              </button>
                              <button
                                onClick={handleCancelBlogImg}
                                className="btn btn-rounded btn-danger btn-sm mt-2 mx-2"
                                type="button"
                              >
                                Cancel
                              </button>
                            </Fragment>
                          )}
                        </div>
                      )}
                      <p className="text-danger text-start">
                        {errors.blogImg?.message}
                      </p>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Label>Description  <Required/></Form.Label>
                <Form.Group className="search-field form-group">
                  <CKEditor
                    {...register("description")}
                    initData={descriptionText}
                    onInstanceReady={handleInstanceReady}
                    onChange={handleDescriptionChange}
                  />
                  <p className="text-danger text-start">
                    {errors.description?.message}
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
          {modalTitle && modalTitle === "View Blog" && getData && (
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
                      <h5 className="text-bold">Title</h5>
                    </td>
                    <td>{getData.title}</td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="text-bold">Description</h5>
                    </td>
                    <td
                      dangerouslySetInnerHTML={{ __html: getData.description }}
                    >
                      {}
                    </td>
                  </tr>
                  <tr>
                    <td>Blog Image</td>
                    <td>
                      <img
                        alt="blog-img"
                        className="w-25 h-25 rounded-0"
                        src={
                          imageDomain +
                          getData.blogImg?.imagePath +
                          getData.blogImg?.images?.medium
                        }
                      />
                    </td>
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

export default Blog;