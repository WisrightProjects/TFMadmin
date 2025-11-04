import React, { lazy, useEffect, Suspense } from "react";
import { connect, useSelector } from "react-redux";
import { ToastContainer, Zoom } from "react-toastify";
import { updateLoginAction } from "redux/action";
import { localStorage } from "core/helper";
import Spinner from "../shared/Spinner";

const PreLogin = lazy(() => import("../preLogin/preLogin"));
const PostLogin = lazy(() => import("../postLogin/postLogin"));

const Container = (props) => {
  const { updateLoginAction } = props;
  const isLoggedIn = useSelector((state) => state?.account?.isLoggedIn);

 

  useEffect(() => {
    const checkSessionlogin = () => {
      const token = localStorage.getAuthToken();
      if (token === "") {
        return false;
      }
  
      const user = localStorage.getAuthUser();
      updateLoginAction({
        isLoggedIn: true,
        authUser: user?.authUser,
        token: token,
      });
    };
    checkSessionlogin();
  }, []);

  return (
    <React.Fragment>
      <Suspense fallback={<Spinner />}>
        {isLoggedIn && <PostLogin />}
        {!isLoggedIn && <PreLogin />}
      </Suspense>
      <ToastContainer draggable={false} transition={Zoom} theme="dark" />
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  updateLoginAction,
};

export default connect(null, mapDispatchToProps)(Container);
