import { Card, Col, Form, Row } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, Fragment } from "react";
import { commonService } from "core/services";
import { Link, useNavigate, useParams } from "react-router-dom";
import { utils } from "core/helper";
import { BRANCH_URL } from "core/services/apiURL.service";
import { BRANCHS_PATH } from "pages/routes/routes";
import { useSelector } from "react-redux";
import Required from "components/common/required";

const validationSchema = Yup.object().shape({
  name: Yup.string().label("Name").required(),
  email: Yup.string().label("Email").required(),
  mobile: Yup.string()
    .test("Invalid Phone number", (val) => val.length === 10)
    .label("Mobile number")
    .required(),
  address: Yup.string().label("Address").required(),
  place: Yup.string().label("Place").required(),
  pincode: Yup.string().label("Pin code").required(),
  status: Yup.string().label("Status").required(),
});

const AddBranch = () => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const { branchId } = useParams();
  const navigate = useNavigate();
  const isAddMode = !branchId;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const setFormValues = (values) => {
    const fields = [
      "name",
      "email",
      "mobile",
      "address",
      "place",
      "pincode",
      "status",
    ];
    fields.forEach((field) => setValue(field, values[field]));
  };

  const onSubmit = (values) => {
    isAddMode ? addBranch(values) : editBranch(values);
  };

  const addBranch = async (values) => {
    const resp = await commonService.create(BRANCH_URL, values);
    if (resp && resp.meta.code === 200) {
      const { meta } = resp;
      utils.showSuccessMsg(meta?.message);
      navigate(BRANCHS_PATH);
      reset();
    }
  };

  const editBranch = async (values) => {
    const resp = await commonService.update(
      BRANCH_URL + "/" + branchId,
      values
    );
    if (resp && resp.meta.code === 200) {
      const { meta } = resp;
      utils.showSuccessMsg(meta?.message);
      navigate(BRANCHS_PATH);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const resp = await commonService.getById(BRANCH_URL + "/" + branchId);
      if (resp && resp.meta.code === 200) {
        setFormValues(resp.data);
      }
    };
    if (branchId) {
      loadData();
    }
  }, [branchId]);

  return (
    <Fragment>
      <BreadCrumb pageFor={isAddMode ? "Add Branch" : "Edit Branch"} />
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="form-group">
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Name <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("name")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Branch Name"
                    />
                    <p className="text-danger">{errors.name?.message}</p>
                  </div>
                </div>
              </Col>
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Email <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("email")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Branch Email"
                    />
                    <p className="text-danger">{errors.email?.message}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="form-group">
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Mobile <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("mobile")}
                      className="form-control custome_num_input"
                      type="number"
                      placeholder="Enter Branch Mobile"
                      pattern="\d*"
                    />
                    <p className="text-danger">{errors.mobile?.message}</p>
                  </div>
                </div>
              </Col>
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Place <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("place")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Branch Place"
                    />
                    <p className="text-danger">{errors.place?.message}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="form-group">
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Address <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("address")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Branch Address"
                    />
                    <p className="text-danger">{errors.address?.message}</p>
                  </div>
                </div>
              </Col>
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Pincode <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("pincode")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Branch Pincode"
                    />
                    <p className="text-danger">{errors.pincode?.message}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="form-group">
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">
                    Status <Required />
                  </label>
                  <div className="col-sm-9">
                    <Form.Select
                      {...register("status")}
                      className="form-control"
                    >
                      <option value="">--Select</option>
                      {commonData?.commonStatus?.map((ele, ind) => (
                        <option value={ele.code} key={ind}>
                          {ele.label}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger">{errors.status?.message}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-rounded btn-success"
            >
              {isAddMode ? "Submit" : "Update"}
            </button>
            <Link to={BRANCHS_PATH} className="btn btn-rounded btn-danger">
              Cancel
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddBranch;
