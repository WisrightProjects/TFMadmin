import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import Logo from '../assets/images/logo.svg';
import { commonService } from 'core/services';
import { utils } from "core/helper";
import { AUTH_URL } from 'core/services/apiURL.service';

const forgotSchema = Yup.object().shape({
    email: Yup
        .string()
        .required('Email is required'),
});

const ForgotPassword = () => {
    const {
        register, handleSubmit, reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(forgotSchema)
    });

    const onSubmit = async ({ email }) => {
        const resp = await commonService.create(AUTH_URL + "/forgotpwd", { email });
        if (resp && resp.meta.code === 200) {
            reset();
            utils.showSuccessMsg(`Password send to ${email} successfully`);
        }
    };

    return (
        <div className="container-scroller">
            <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="d-flex align-items-center auth px-0">
                            <div className="row w-100 mx-0">
                                <div className="col-lg-4 mx-auto">
                                    <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                        <div className="brand-logo">
                                            <img src={Logo} alt="logo" />
                                        </div>
                                        <h4 className='text-center'>Forgot Password</h4>
                                        <Form onSubmit={handleSubmit(onSubmit)} className="pt-3">
                                            <Form.Group className="search-field form-group">
                                                <Form.Control
                                                    {...register("email")}
                                                    type="email"
                                                    placeholder="Username"
                                                    size="lg"
                                                    className="h-auto"
                                                />
                                                <p className='text-danger text-start'>{errors.email?.message}</p>
                                            </Form.Group>
                                            <div className="mt-3">
                                                <Button
                                                    disabled={isSubmitting}
                                                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                                    type='submit'
                                                >SEND</Button>
                                            </div>
                                            <div className="my-2 d-flex justify-content-between align-items-center">
                                                <div className="form-check">
                                                    <label className="form-check-label text-muted">
                                                        {/* <input type="checkbox" className="form-check-input" /> */}
                                                        <i className="input-helper"></i>
                                                        {/* Keep me signed in */}
                                                    </label>
                                                </div>
                                                <Link to="/login" className="auth-link text-black">Back</Link>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ForgotPassword;