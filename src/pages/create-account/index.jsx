import React, { useState, useContext } from "react";
import OtpInput from "react-otp-input";
import { Container, Row, Col, Button } from "reactstrap";

import CreateAccountFirstStep from "../../components/create-account-first-step";
import CreateAccountSecondStep from "../../components/create-account-second-step";
import OTPVerification from "../../components/otp-verification";
import SocialSignup from "../../components/social-signup";
import { OTPVerificationContext } from "../../context/OTPVerificationContext";
import { RegistrationDataContext } from "../../context/RegistrationDataContext";
import { deepClone, showToast } from "../../helper-methods";
import { requestForOtp, signupUser, verifyOTP } from "../../http-calls";
import styles from "./style.module.css";

function CreateAccount(props) {
  const { _phoneNumber, phoneNumber, _verificationToken, verificationToken } =
    useContext(OTPVerificationContext);

  const { firstStepData, _firstStepData, secondStepData, _secondStepData } =
    useContext(RegistrationDataContext);

  const [formSection, _formSection] = useState({
    socialSignupSection: true,
    otpSection: false,
    accountFirstStep: false,
    accountSecondStep: false,
  });
  const [nextSection, _nextSection] = useState("");
  const [requestForOTPData, _requestForOTPData] = useState(null);
  const [loading, _loading] = useState(false);

  const _requestForOTP = async (data) => {
    try {
      _loading(true);
      // set data into context
      _phoneNumber(data);
      _requestForOTPData(data);
      const response = await requestForOtp(data);
      _loading(false);
      // success case
      if (response?.data?.success) {
        // set verify_token
        showToast(response?.data?.result?.message, "success");
        _verificationToken(response?.data?.result?.verificationToken);
        _changeRegistrationComponent("otpSection");
      } else {
        showToast(response?.data?.error?.message);
      }
    } catch (error) {
      console.log(`error`, error);
      _loading(false);
    }
  };

  const _verifyOTP = async (data) => {
    try {
      _loading(true);
      const addlData = {
        country_code: requestForOTPData?.country_code,
        phone_number: requestForOTPData?.phone_number,
        verification_token: verificationToken,
      };
      data = { ...data, ...addlData };
      const response = await verifyOTP(data);
      _loading(false);

      if (response?.data?.success) {
        showToast("Mobile numer has been verified successfully", "success");
        _changeRegistrationComponent("accountFirstStep");
      } else {
        showToast(response?.data?.error?.message);
      }
    } catch (error) {
      console.log(`error`, error);
      _loading(false);
    }
  };

  const _storeFirstStepData = (data) => {
    _firstStepData(data);
    _changeRegistrationComponent("accountSecondStep");
  };

  const _resendOTP = () => {
    _requestForOTP(requestForOTPData);
  }

  const _callRegistrationAPI = async (data) => {
    data = { ...phoneNumber, ...firstStepData, ...data, verification_token: verificationToken };
    const response =await signupUser(data);

    if (response?.data?.success) {
      showToast(response?.data?.result?.message || "You have successfully registered", "success");
      //  store token and redirect to auth route, for now redirect to login route
      props.history.replace("/login");
    } else {
      showToast(response?.data?.error?.message);
    }
  };

  const _onNext = (data = null, nextSectionName) => {
    _nextSection((prev) => (prev = nextSectionName));
    switch (nextSectionName) {
      case "otpSection":
        _requestForOTP(data);
        break;

      case "accountFirstStep":
        _verifyOTP(data);
        break;

      case "accountSecondStep":
        _storeFirstStepData(data);
        break;

      case "registration":
        _callRegistrationAPI(data);
        break;

      default:
        break;
    }
  };

  const _changeRegistrationComponent = (nextSection = null) => {
    const tempFormSection = deepClone(formSection);
    for (let section in tempFormSection) {
      if (section === nextSection) {
        tempFormSection[section] = true;
      } else {
        tempFormSection[section] = false;
      }
    }
    _formSection({ ...tempFormSection });
  };

  const _changePhoneNumber = () => {
    _changeRegistrationComponent("socialSignupSection");
  };

  return (
    <Container>
      {/* Header */}
      <Row style={{ alignItems: "center" }}>
        <Col className={styles.loginImage}>
          <img
            src="/assets/img/illus_1.svg"
            alt="img-3"
            className="w-100"
          />
        </Col>
        <Col >
          {formSection.socialSignupSection && (
            <SocialSignup
              {...props}
              onNext={(data) => _onNext(data, "otpSection")}
              value={phoneNumber?.phone_number}
              loading={loading}
            />
          )}

          {formSection.otpSection && (
            <OTPVerification
              {...props}
              phoneNumber={phoneNumber}
              onNext={(data) => _onNext(data, "accountFirstStep")}
              onChangeNumber={_changePhoneNumber}
              loading={loading}
              onResendOTP = {_resendOTP}
            />
          )}

          {formSection.accountFirstStep && (
            <CreateAccountFirstStep
              {...props}
              onNext={(data) => _onNext(data, "accountSecondStep")}
              loading={loading}
            />
          )}

          {formSection.accountSecondStep && (
            <CreateAccountSecondStep
              {...props}
              name={firstStepData?.first_name + " " + firstStepData?.last_name}
              onNext={(data) => _onNext(data, "registration")}
              loading={loading}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAccount;
