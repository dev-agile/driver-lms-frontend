import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  InputGroup,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import ReactCustomFlagSelect from "react-custom-flag-select";

import { RegexConfig } from "../../config/RegexConfig";
import { OTPVerificationContext } from "../../context/OTPVerificationContext";
import styles from "./style.module.css";
import { CountryCodes } from "../../config/CountryCodeConfig";

const SocialSignup = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [phoneNumber, _phoneNumber] = useState("");
  const [isFormValid, _isFormValid] = useState(false);
  const [countryCode, _countryCode] = useState(null);


  useEffect(() => {

    console.log(`CountryCodes`, CountryCodes)
    _countryCode(CountryCodes[0]);

  }, [])


  useEffect(() => {
    if (props?.value?.length) {
      _phoneNumber(props?.value);
    }
  }, [props?.value]);

  useEffect(() => {
    if (
      phoneNumber.toString().length &&
      RegexConfig.mobileNumber.test(
        String(phoneNumber.toString()).toLowerCase()
      )
    ) {
      _isFormValid(true);
    } else {
      _isFormValid(false);
    }
  }, [phoneNumber]);

  const _clickOnNext = () => {
    const phone = {
      country_code: "+65",
      phone_number: phoneNumber,
    };
    props.onNext(phone);
  };

  const _redirectToLogin = () => {
    props.history.push("/login");
  };

  return (
    <div className={styles.spacing}>
      <Row >
        <Col sm={{ size: 10, offset: 2 }} xs={{ size: 10, offset: 1 }} md={{ size: 8, offset: 2 }} lg={{ size: 8, offset: 2 }} xl={{ size: 8, offset: 2 }}>
          <p className={[styles.welcometext, "mt-md-5"].join(" ")}>
            Create an Account
          </p>
          <Button
            outline
            size="lg"
            className={styles.appleLoginBtn}
          >
            <span ><img src="https://img.icons8.com/ios-filled/30/ffffff/mac-os.png" className={styles.logo} alt="apple" /></span>
            Sign up with Apple
          </Button>
          <Button
            outline
            size="lg"
            block
            className={styles.googleLoginbtn}
          >
            <span><img src="https://img.icons8.com/color/30/000000/google-logo.png" className={styles.logo} alt="google" /></span>
            Sign up with Google
          </Button>

          <span className={styles.back}>
            <FontAwesomeIcon
              size="2x"
              color="#718093"
              icon={faLongArrowAltLeft}
            />
          </span>
          <div className={styles.or_div_wrapper}>
            <div className={styles.or_side_div}></div>
            <div className={styles.or_div}>or</div>
            <div className={styles.or_side_div}></div>
          </div>
          <Row>
            <Col sm={12} xs={12} xl={12}>
              <div className={styles.form_wrapper}>
                <Form>
                  <FormGroup>

                    <Row>
                      <InputGroup>

                        <Col xs={3} sm={3} md={4} lg={3} xl={2} className="pr-0">
                          {countryCode && <ReactCustomFlagSelect
                            attributesWrapper={{ id: "areaCodeWrapper", tabIndex: "1" }} //Optional.[Object].Modify wrapper general attributes.
                            attributesButton={{ id: "areaCodeButton" }} //Optional.[Object].Modify button general attributes.
                            attributesInput={{ id: "areaCode", name: "areaCode" }}
                            value={countryCode.id}
                            disabled={false}
                            showSearch={false}
                            fields={["name", "locale"]}
                            showArrow={true}
                            animate={true}
                            optionList={CountryCodes}
                            customStyleContainer={{
                              borderBottom: "2px solid #ced4da ", fontSize: "12px",
                            }}
                            // customStyleSelect={{ width: "100px" }}
                            customStyleOptionListItem={{}}
                            customStyleOptionListContainer={{
                              maxHeight: "100px",
                              overflow: "auto",
                              // width: "120px",
                              marginTop: "11px",
                            }}
                            onChange={(areaCode) => {
                              console.log(areaCode)
                            }}
                          />}
                        </Col>
                        <Col xs={9} sm={9} md={8} lg={9} xl={10} >
                          <Input
                            type="text"
                            id=""
                            name="phoneNumber"
                            className={[styles.input_with_bottom_border].join(" ")}
                            value={phoneNumber}
                            onChange={(e) =>
                              _phoneNumber((prev) => (prev = e.target.value))
                            }
                            placeholder="Phone Number"
                            maxlength="10"
                          />
                          {/* {!isFormValid ? (
                   <p className={styles.error}>Phone Number is mandatory</p>
                 ) : null} */}
                        </Col>
                        <Col sm={12} xs={12} xl={12}>

                          <Button
                            outline
                            size="lg"
                            block
                            className={styles.nextBtn}
                            onClick={() => _clickOnNext()}
                            disabled={!isFormValid || props?.loading}
                          >
                            Next
                          </Button>
                        </Col>
                      </InputGroup>
                    </Row>
                  </FormGroup>
                </Form>
              </div>
            </Col>
          </Row>
          <div className={styles.existingUserWrapper}>
            <span className={styles.existing_user}>Existing user?</span>
            <span className={styles.loginText} onClick={_redirectToLogin}>
              Login
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SocialSignup;
