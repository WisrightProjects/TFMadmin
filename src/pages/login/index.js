import React, { useState } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { loginAction } from "redux/action";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Logo from "../../pages/assets/images/logo-img.png";
import { DASH_PATH, PROFILES_PATH } from "../routes/routes";
import { utils } from "core/helper";
import { commonService } from "core/services";
import { AUTH_URL } from "core/services/apiURL.service";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = (props) => {
  const { loginAction } = props;
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((show) => !show);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({ email, password }) {
    const resp = await commonService.create(AUTH_URL + "/staff-login", {
      email,
      pwd: password,
    });
    if (resp && resp.meta.code === 200) {
      loginAction({
        isLoggedIn: true,
        token: resp.data.token,
        authUser: resp.data,
        refreshToken: resp?.data?.refreshToken,
      });
      reset();
      utils.showSuccessMsg("login successfully");
      utils.navigateTo(navigate,PROFILES_PATH);
    }
  }

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="d-flex align-items-center auth px-0">
              <div className="row w-100 mx-0">
                <div className="col-lg-4 mx-auto">
                  <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                    <div className="brand-logo d-flex justify-content-center">
                      <img src={Logo} alt="logo" className="mx-auto my-2" />
                    </div>
                    <h4>Hello! let's get started</h4>
                    <h6 className="font-weight-light">Sign in to continue.</h6>
                    <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                      <Form.Group className="search-field form-group">
                        <Form.Control
                          {...register("email")}
                          type="email"
                          placeholder="Username"
                          size="lg"
                          className="h-auto"
                        />
                        <p className="text-danger text-start">
                          {errors.email?.message}
                        </p>
                      </Form.Group>
                      <Form.Group className="search-field form-group password_input">
                        <Form.Control
                          {...register("password")}
                          type={passwordShown ? "text" : "password"}
                          placeholder="Password"
                          size="lg"
                          className="h-auto"
                          id="passwordInput"
                        />
                        {passwordShown ? (
                          <i
                            onClick={togglePasswordVisiblity}
                            className="mdi mdi-eye"
                          ></i>
                        ) : (
                          <i
                            onClick={togglePasswordVisiblity}
                            className="mdi mdi-eye-off"
                          ></i>
                        )}
                        <p className="text-danger text-start">
                          {errors.password?.message}
                        </p>
                      </Form.Group>
                      <div className="mt-3">
                        <Button
                          disabled={isSubmitting}
                          className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                          type="submit"
                        >
                          SIGN IN
                        </Button>
                      </div>
                      <div className="my-2 d-flex justify-content-between align-items-center">
                        <div className="form-check">
                          <label className="form-check-label text-muted">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <i className="input-helper"></i>
                            Keep me signed in
                          </label>
                        </div>
                        {/* <Link
                          to="/forgot-password"
                          className="auth-link text-black"
                        >
                          Forgot password?
                        </Link> */}
                      </div>
                      {/* <div className="text-center mt-4 font-weight-light">
                            Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                        </div> */}
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.account?.isLoggedIn,
  };
};
const mapDispatchToProps = {
  loginAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
