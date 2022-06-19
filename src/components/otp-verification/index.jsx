import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Button } from "reactstrap";
import ResendOTPTimer from "../resend-otp-timer";

import styles from "./style.module.css";

const OTPVerification = (props) => {
  const [otp, _otp] = useState("");

  const _onOTPChange = (value) => {
    _otp(value);
  };

  const _clickOnVerify = () => {
    const data = {
      verification_code: otp,
    };
    props.onNext(data);
  };

  const _findLastThreeDigits = () => {
    if (props?.phoneNumber?.phone_number?.length) {
      const { phoneNumber:{phone_number} } = props;
      return phone_number.substr(phone_number.length - 3);
    }
  };

  return (
    <div>
      <div>
        <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          Create an Account
        </p>
        <p>
          <span style={{ display: "block" }}>
            Please enter 6-digit OTP sent to mobile number
          </span>
          <span>XXXXXXX{_findLastThreeDigits()}</span>{" "}
          <span className={styles.change_phone_number} onClick={props.onChangeNumber}>Change</span>
        </p>
        <div>
          <OtpInput
            value={otp}
            onChange={(otp) => _onOTPChange(otp)}
            numInputs={6}
            inputStyle={{
              outline: 0,
              borderWidth: "0 0 2px",
              marginRight: 20,
              width: 40,
              isInputNum: true,
              shouldAutoFocus: true,
            }}
          />
        </div>
        <ResendOTPTimer seconds={5} resendFn={props.onResendOTP} />
        <Button
          outline
          size="lg"
          block
          disabled={otp?.length < 6 || props?.loading}
          className={styles.nextBtn}
          onClick={_clickOnVerify}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
