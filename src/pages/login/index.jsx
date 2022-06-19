import React, { useEffect, useState } from "react";
// import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";

import SocialLogin from "../../components/social-login";
import { showToast } from "../../helper-methods";
import { loginViaEmail, loginViaPhoneNumber } from "../../http-calls";
import { storeUserData, storeUserToken } from "../../redux/actions/user-data";
import styles from "./style.module.css";

const LoginPage = (props) => {

  const dispatch = useDispatch();
 const userData = useSelector(state => state?.userData);

 const [loading, _loading] = useState(false);

  useEffect(() => {
    if(userData?.token?.length && userData?.user && Object.keys(userData?.user)?.length){
      props.history.push("/dashboard");
    }
  },[userData])

  const _login = async (data) => {
    _loading(true);
    if (data?.hasOwnProperty("email")) {
      const response = await loginViaEmail(data);

      if (response?.data?.success) {
        console.log(`response email`, response);
        //  store token and redirect to auth route, for now redirect to login route
        dispatch(storeUserToken(response?.data?.token));
        dispatch(storeUserData(response?.data?.result));
      } else {
    _loading(false);

        showToast(response?.data?.error?.message);
      }
    } else {
      const response = await loginViaPhoneNumber(data);

      if (response?.data?.success) {
        console.log(`response phone number`, response);
        //  store token and redirect to auth route, for now redirect to login route
        dispatch(storeUserToken(response?.data?.token));
        dispatch(storeUserData(response?.data?.result));
      } else {
        _loading(false);
        showToast(response?.data?.error?.message);
      }
    }
  };

  return (
    <Container>
      <Row style={{ alignItems: "center" }}>
        <Col className={styles.loginImage}>
          <img
            src="/assets/img/illus_2.svg"
            alt="img-3"
            className="w-100"
          />
        </Col>
        <Col>
          <SocialLogin {...props} isLoading={loading} onNext={(data) => _login(data)}  />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
