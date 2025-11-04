import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from '../shared/Spinner';
import {
    PRE_LOGIN_PATH, UNKNOWN_PATH, LOGIN_PATH,
    FORGOT_PATH, CHANGE_FORGOT_PATH
} from 'pages/routes/routes';
import "assets/styles/custom.css";

import Login from '../login';
import ForgotPassword from '../forgot-password';
import ResetPassword from '../reset-password';

const PreLogin = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route path={PRE_LOGIN_PATH} element={<Navigate replace to={LOGIN_PATH} />} />
                <Route path={UNKNOWN_PATH} element={<Navigate replace to={LOGIN_PATH} />} />
                <Route path={LOGIN_PATH} element={<Login />} />
                <Route path={FORGOT_PATH} element={<ForgotPassword />} />
                <Route path={CHANGE_FORGOT_PATH} element={<ResetPassword />} />
            </Routes>
        </Suspense>
    )
};

export default PreLogin;