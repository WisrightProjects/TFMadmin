import { Card, Col, Form, Row } from "react-bootstrap";
import BreadCrumb from "components/common/breadcrumb";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useEffect, useState, Fragment } from "react";
import { commonService, userService } from "core/services";
import { Link, useNavigate, useParams } from "react-router-dom";
import { utils, CONST } from "core/helper";
import {
  BRANCH_URL,
  UPDATE_STAFF,
  USER_URL,
} from "core/services/apiURL.service";
import { STAFF_PATH } from "pages/routes/routes";
import { useSelector } from "react-redux";
import Required from "components/common/required";

let validName = "";
let isNameValid = false;

let validPhone = "";
let isPhoneValid = false;

let validEmail = "";
let isEmailValid = false;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Staff name is required")
    .min(3, "Minimum 3 characters required")
    .max(25, "Maximum 25 character allowed")
    .test("Check Name", "Staff name exists", async (value) => {
      if (validName !== value) {
        const resp = await userService.isValid({ name: value });
        validName = value;
        isNameValid = resp?.data ? false : true;
      }
      return isNameValid;
    }),
  phoneCode: Yup.string().required("Required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string()
    .required("Email is required")
    .test("Check email", "Email exists", async (value) => {
      if (validEmail !== value) {
        const resp = await userService.isValid({ email: value });
        validEmail = value;
        isEmailValid = resp?.data ? false : true;
      }
      return isEmailValid;
    }),
  phone: Yup.string()
    .min(10)
    .required("Phone is required")
    .test("Check Phone", "Phone number exists", async (value) => {
      if (validPhone !== value && value.length === 10) {
        const resp = await userService.isValid({ phone: value });
        validPhone = value;
        isPhoneValid = resp?.data ? false : true;
      }

      return isPhoneValid;
    }),
  pwd: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  role: Yup.string().required("Role is required"),
});

const editSchema = Yup.object().shape({
  name: Yup.string().required("Staff name is required"),
  phoneCode: Yup.string().required("Required"),
  phone: Yup.string().min(10).required("Phone is required"),
  status: Yup.string().required("Status is required"),
});

const AddStaff = () => {
  const commonData = useSelector((state) => state?.common?.commonData);
  const [phoneVal, setPhoneVal] = useState("");
  const [pageFor] = useState("Staff");
  const [filter] = useState({ ...CONST.DEFAULT_ADV_FILTER });
  const { staffId } = useParams();
  const isAddMode = !staffId;
  const [branchList, setBranchList] = useState([]);
  const [isPasswordToggle, setIsPasswordToggle] = useState(false);

  const handlePasswordToggle = () => setIsPasswordToggle(!isPasswordToggle);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(isAddMode ? validationSchema : editSchema),
  });

  const handleChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setPhoneVal(e.target.value);
      setValue("phone", e.target.value);
    }
  };

  const onSubmit = (values) => {
    isAddMode ? addStaff(values) : editStaff(values);
  };

  const addStaff = async (values) => {
    values.branch = values.branch ? values.branch : undefined;
    const resp = await commonService.create(
      USER_URL + "/staff-register",
      values
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(CONST.MSG.RECORD_ADDED_SUCC);
      reset();
      utils.navigateTo(navigate,STAFF_PATH);
    }
  };

  const editStaff = async (values) => {
    const { name, phoneCode, phone, branch, status } = values;
    const payload = {
      name,
      phoneCode,
      phone,
      branch: branch ? branch : undefined,
      status,
    };
    const resp = await commonService.update(
      UPDATE_STAFF + "/" + staffId,
      payload
    );
    if (resp && resp.meta.code === 200) {
      utils.showSuccessMsg(resp.meta.message);
      utils.navigateTo(navigate,STAFF_PATH);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const resp = await commonService.getById(USER_URL + "/" + staffId);
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        const fields = [
          "name",
          "phoneCode",
          "phone",
          "email",
          "pwd",
          "status",
          "role",
        ];
        fields.forEach((field) => setValue(field, data[field]));
        if (data) {
          const { branch, phone } = data;
          setValue("branch", branch._id);
          setPhoneVal(phone);
        }
      }
    };
    if (staffId) {
      loadData();
    }
  }, [staffId]);

  useEffect(() => {
    const loadBranchs = async (filter) => {
      const resp = await commonService.loadBranch(
        BRANCH_URL + "/filter",
        filter
      );
      if (resp && resp.meta.code === 200) {
        const { data } = resp;
        setBranchList(data);
      }
    };
    loadBranchs(filter);
  }, [filter]);

  return (
    <Fragment>
      <BreadCrumb pageFor={(isAddMode ? "Add" : "Edit") + " " + pageFor} />
      <Card>
        <Card.Body>
          <Form autoComplete="new-password" onSubmit={handleSubmit(onSubmit)}>
            <Row className="form-group">
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">Branch</label>
                  <div className="col-sm-9">
                    <Form.Select
                      className="form-control"
                      {...register("branch")}
                    >
                      <option value="">
                        Select
                      </option>
                      {branchList &&
                        branchList.map((ele, ind) => (
                          <option value={ele._id} key={ind}>
                            {ele.name}
                          </option>
                        ))}
                    </Form.Select>
                  </div>
                </div>
              </Col>
              <Col xl={6} md={6} lg={6}>
                <div className="row">
                  <label className="col-sm-3 col-form-label">Name <Required/></label>
                  <div className="col-sm-9">
                    <Form.Control
                      {...register("name")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Staff Name"
                      maxLength={25}
                    />
                    <p className="text-danger">{errors.name?.message}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="form-group">
              <Col xl={6} md={6} lg={6}>
                <Row>
                  <Col sm={3}>
                    {" "}
                    <label className="form-label">Email <Required/></label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control
                      {...register("email")}
                      className="form-control"
                      type="text"
                      placeholder="Enter Staff Email"
                      disabled={!isAddMode}
                    />
                    <p className="text-danger">{errors.email?.message}</p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6} md={6} lg={6}>
                <Row>
                  <Col className="form-label">
                    <label className="form-label">Mobile <Required/></label>
                  </Col>
                  <Col sm={9}>
                    <Row>
                      <Col sm={4}>
                        <Form.Select
                          className="form-control"
                          {...register("phoneCode")}
                        >
                          <option value="" label="Select">
                            Select
                          </option>
                          <option value="+91">India (+91)</option>
                          <option value="61">Australia (61)</option>
                        </Form.Select>
                        <p className="text-danger">
                          {errors.phoneCode?.message}
                        </p>
                      </Col>
                      <Col sm={8}>
                        <Form.Control
                          {...register("phone")}
                          className="form-control custome_num_input"
                          type="text"
                          placeholder="Enter Staff Mobile"
                          maxLength={10}
                          pattern="[0-9]*"
                          value={phoneVal}
                          onChange={handleChange}
                        />
                        <p className="text-danger text-start">
                          {errors.phone?.message}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="form-group">
              {isAddMode && (
                <Col xl={6} md={6} lg={6}>
                  <Row>
                    <Col sm={3}>
                      <label className="form-label">Password <Required/></label>
                    </Col>
                    <Col sm={9} className="staff_password_input">
                      <Form.Control
                        {...register("pwd")}
                        className="form-control"
                        type={isPasswordToggle ? "text" : "password"}
                        placeholder="Enter Password"
                        disabled={!isAddMode}
                        maxLength={20}
                      />
                      {isPasswordToggle ? (
                        <i
                          onClick={handlePasswordToggle}
                          className="mdi mdi-eye"
                        ></i>
                      ) : (
                        <i
                          onClick={handlePasswordToggle}
                          className="mdi mdi-eye-off"
                        ></i>
                      )}
                      <p className="text-danger">{errors.pwd?.message}</p>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col xl={6} md={6} lg={6}>
                <Row>
                  <Col sm={3}>
                    <label className="form-label">Status <Required/></label>
                  </Col>
                  <Col sm={9}>
                    <Form.Select
                      {...register("status")}
                      className="form-control"
                    >
                      <option value={""}>Select</option>
                      {commonData?.userStatus?.map((ele, ind) => (
                        <option key={ind} value={ele.code}>
                          {ele.label}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger text-start">
                      {errors.status?.message}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xl={6} md={6} lg={6}>
                <Row>
                  <Col sm={3}>
                    <label className="form-label">Role <Required/></label>
                  </Col>
                  <Col sm={9}>
                    <Form.Select
                      {...register("role")}
                      className="form-control"
                      disabled={!isAddMode}
                    >
                      <option value={""}>Select</option>
                      {commonData?.staffRegisterRoles?.map((ele, ind) => (
                        <option key={ind} value={ele.code}>
                          {ele.label}
                        </option>
                      ))}
                    </Form.Select>
                    <p className="text-danger text-start">
                      {errors.role?.message}
                    </p>
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
            <Link to={STAFF_PATH} className="btn btn-rounded btn-danger">
              Cancel
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddStaff;
