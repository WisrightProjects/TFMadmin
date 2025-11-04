import { useNavigate, useParams, Link} from 'react-router-dom';
import {Form, Button} from "react-bootstrap";
import { utils } from "core/helper";
import { LOGIN_PATH } from "pages/routes/routes";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import {userService} from "core/services";
import Logo from '../assets/images/logo.svg';

const validationSchema = Yup.object().shape({
    pwd: Yup
        .string()
        .required('Password is required'),
    confirmpwd: Yup
        .string()
        .test("confirm-password-test",
        "Password not match",
            function(value){
                return value === this.parent.pwd;
            }
        )
        .required('Confirm password is required'),
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const {token} = useParams();
    
    const {register, handleSubmit, formState} = useForm({
        resolver: yupResolver(validationSchema)
    });
    const {errors, isSubmitting} = formState;

    async function onSubmit({pwd, confirmpwd}){
        const resp = await userService.resetPassword({pwd, confirmpwd, token});
        if(resp && resp.meta.code === 200){
            utils.showSuccessMsg("Password reset successfully");
            utils.navigateTo(navigate, LOGIN_PATH)
        }
    };

    return(
        <>
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
                                            <Form  onSubmit={handleSubmit(onSubmit)} className="pt-3">
                                                <Form.Group className="search-field form-group">
                                                    <Form.Control 
                                                        {...register("pwd")}
                                                        type="password" 
                                                        placeholder="Password" 
                                                        size="lg" 
                                                        className="h-auto" 
                                                    />
                                                    <p className='text-danger text-start'>{errors.email?.message}</p>
                                                </Form.Group>
                                                <Form.Group className="search-field form-group">
                                                    <Form.Control 
                                                        {...register("confirmpwd")}
                                                        type="password" 
                                                        placeholder="Confirm Password" 
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
                                                    >SUBMIT</Button>
                                                </div>
                                                <div className="my-2 d-flex justify-content-between align-items-center">
                                                    <div className="form-check">
                                                        <label className="form-check-label text-muted">
                                                            {/* <input type="checkbox" className="form-check-input" /> */}
                                                            <i className="input-helper"></i>
                                                            {/* Keep me signed in */}
                                                        </label>
                                                    </div>
                                                    <Link to="/login"  className="auth-link text-black">Back</Link>
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
        </>
    )
};

export default ResetPassword;