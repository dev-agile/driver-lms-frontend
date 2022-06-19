import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  InputGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAppleAlt,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import ReactCustomFlagSelect from "react-custom-flag-select";

import { RegexConfig } from "../../config/RegexConfig";
import styles from "./style.module.css";
import { deepClone } from "../../helper-methods";

import AddContactModal from "../AddContactModal";
import { CountryCodes } from "../../config/CountryCodeConfig";
class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {
      formFields: {
        phoneNumber: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        password: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        email: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        countryCode: {
          value: CountryCodes[0],
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
      },
      togglePasswordField: {
        password: true,
        confirmPassword: true,
      },

      isFormValid: false,
      activeTab: "1",
      showAddContact: false,
    };
  }

  _clearFormFields = () => {
    let { formFields, isFormValid } = deepClone(this.state);

    formFields = {
      phoneNumber: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true,
      },
      password: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true,
      },
      email: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true,
      },
      countryCode: {
        value: CountryCodes[0],
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true,
      },
    };
    isFormValid = false;

    this.setState({ formFields, isFormValid });
  };

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this._clearFormFields();
      this.setState({ activeTab: tab }, () => {
        console.log(`this.state`, this.state);
      });
    }
  };

  _changeFormValue = (event, attr) => {
    const { formFields } = deepClone(this.state);
    formFields[attr]["value"] = event?.target?.value;
    this.setState({ formFields }, () => {
      this._validateForm();
    });
  };

  _validateForm = () => {
    return new Promise((resolve, reject) => {
      const { formFields, activeTab } = deepClone(this.state);

      let isFormValid = true;

      Object.keys(formFields).forEach((fieldName, index) => {
        switch (fieldName) {
          case "phoneNumber": {
            if (
              activeTab === "2" ||
              (formFields.phoneNumber.value.length &&
                RegexConfig.mobileNumber.test(
                  String(formFields.phoneNumber.value.toString()).toLowerCase()
                ))
            ) {
              formFields.phoneNumber.isValid = true;
            } else {
              formFields.phoneNumber.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "password": {
            if (formFields.password.value.length) {
              if (
                RegexConfig.password.test(String(formFields.password.value))
              ) {
                formFields.password.isValid = true;
              } else {
                formFields.password.isValid = false;
                isFormValid = false;
              }
            } else {
              formFields.password.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "email": {
            if (activeTab === "1" || formFields.email.value.length) {
              formFields.email.isValid = true;
            } else {
              formFields.email.isValid = false;
              isFormValid = false;
            }
            break;
          }
          default:
            break;
        }
      });
      this.setState({ formFields, isFormValid }, () => {
        resolve();
      });
    });
  };

  _markAsDirty = (fieldName) => {
    const { formFields } = deepClone(this.state);
    formFields[fieldName].isDirty = true;

    let data = {};
    formFields[fieldName].isValid = false;
    formFields[fieldName].isFocused = false;
    this.setState({ formFields }, () => {
      this._validateForm();
    });
  };

  _makeAllFieldDirty = () => {
    return new Promise((resolve) => {
      const { formFields } = deepClone(this.state);
      Object.keys(formFields).forEach((fieldName, index) => {
        formFields[fieldName].isDirty = true;

        // this._markAsDirty(fieldName);
      });
      this.setState({ formFields }, () => {
        resolve();
      });
    });
  };

  _togglePasswordField = (field) => {
    const { togglePasswordField } = deepClone(this.state);
    togglePasswordField[field] = !togglePasswordField[field];
    this.setState({ togglePasswordField });
  };

  _redirectToCreateAccount = () => {
    this.props.history.push("/create-account");
  };

  _clickOnNext = async (e) => {
    if (e) {
      e.preventDefault();
    }

    await this._makeAllFieldDirty();
    await this._validateForm();

    const { formFields, isFormValid } = deepClone(this.state);

    if (isFormValid) {
      let data = { password: formFields.password.value };

      if (this.state.activeTab === "1") {
        data = {
          ...data,
          country_code: "+65",
          phone_number: formFields.phoneNumber.value,
        };
      } else {
        data = {
          ...data,
          email: formFields.email.value,
        };
      }

      this.props.onNext(data);
    }
  };

  _loginWithPhoneNumber = () => {
    const { formFields } = deepClone(this.state);
    const data = {
      country_code: "+65",
      phone_number: formFields.phoneNumber.value,
      password: formFields.password.value,
    };
  };

  render() {
    const { isFormValid, togglePasswordField, formFields, activeTab } =
      deepClone(this.state);

    console.log(`formFields`, formFields)
    return (
      <div className={styles.spacing}>
        <Row>
          <Col
            sm={{ size: 10, offset: 2 }}
            xs={{ size: 10, offset: 1 }}
            md={{ size: 8, offset: 2 }}
            lg={{ size: 8, offset: 2 }}
            xl={{ size: 8, offset: 2 }}
          >
            <p className={[styles.welcometext, "mt-md-5"].join(" ")}>Welcome Back!</p>
            <Button outline size="lg" className={styles.appleLoginBtn}>
              <span>
                <img
                  src="https://img.icons8.com/ios-filled/30/ffffff/mac-os.png"
                  className={styles.logo}
                  alt="apple"
                />
              </span>
              Login with Apple
            </Button>
            <Button outline size="lg" block className={styles.googleLoginbtn}>
              <span>
                <img
                  src="https://img.icons8.com/color/30/000000/google-logo.png"
                  className={styles.logo}
                  alt="google"
                />
              </span>
              Login with Google
            </Button>
            <div className={styles.or_div_wrapper}>
              <div className={styles.or_side_div}></div>
              <div className={styles.or_div}>or</div>
              <div className={styles.or_side_div}></div>
            </div>
            <div className={styles.form_wrapper}>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={[
                      activeTab === "1" ? styles.selectedTab : "",
                      styles.tabHead,
                    ].join(" ")}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    Login via phone
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={[
                      activeTab === "2" ? styles.selectedTab : "",
                      styles.tabHead,
                    ].join(" ")}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    Login via email
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Form>
                    <FormGroup>
                      <Row>
                        <InputGroup
                          className={styles.inputGroup}
                          style={{ marginTop: 25 }}
                        >
                          <Col xs={3} sm={3} md={4} lg={3} xl={2} className="pr-0">
                            <ReactCustomFlagSelect
                              // attributesWrapper={{
                              //   id: "areaCodeWrapper",
                              //   tabIndex: "1",
                              // }} //Optional.[Object].Modify wrapper general attributes.
                              // attributesButton={{ id: "areaCodeButton" }} //Optional.[Object].Modify button general attributes.
                              // attributesInput={{ id: "areaCode", name: "areaCode" }}
                              value={formFields.countryCode.value.id}
                              disabled={false}
                              showSearch={false}
                              fields={["name", "locale"]}
                              showArrow={true}
                              animate={true}
                              optionList={CountryCodes}
                              customStyleContainer={{
                                border: "none",
                                fontSize: "12px",
                                borderBottom: "2px solid #ced4da ",
                                // width: 100,
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
                                console.log(areaCode);
                              }}
                            />
                          </Col>
                          <Col xs={9} sm={9} md={8} lg={9} xl={10}>
                            <Input
                              type="text"
                              autoComplete="new-password"
                              name="phoneNumber"
                              className={[styles.input_with_bottom_border].join(
                                " "
                              )}
                              // style={{marginLeft: 77}}
                              value={formFields.phoneNumber.value}
                              onChange={(e) =>
                                this._changeFormValue(e, "phoneNumber")
                              }
                              onBlur={() => this._markAsDirty("phoneNumber")}
                              placeholder="Phone Number"
                              maxlength="10"
                            />
                            
                          </Col>
                          {!formFields.phoneNumber.isValid &&
                            formFields.phoneNumber.isDirty ? (
                            <p className={[styles.error, "w-100", styles.pl15].join(" ")}>
                              Phone Number is mandatory
                            </p>
                          ) : null}
                         
                        </InputGroup>
                        <InputGroup
                          className={[styles.inputGroup, "mb-0"].join(" ")}
                        >
                          <Col sm={10} xs={10} xl={11} className="pr-0">
                            <Input
                              type={
                                togglePasswordField.password ? "password" : "text"
                              }
                              className={[
                                styles.input_with_bottom_border,
                                styles.passwordInput,
                              ].join(" ")}
                              value={formFields.password.value}
                              onChange={(text) =>
                                this._changeFormValue(text, "password")
                              }
                              onBlur={() => this._markAsDirty("password")}
                              placeholder="Password"
                            />
                            
                          {!formFields.password.isValid &&
                            formFields.password.isDirty ? (
                              <p className={styles.error}>Password is mandatory</p>
                              ) : null}
                          </Col>
                          <Col sm={2} xs={2} xl={1} className="pl-0">

                            <div
                              className={styles.iconWrapper}
                              onClick={() => this._togglePasswordField("password")}
                            >
                              <FontAwesomeIcon
                                icon={
                                  togglePasswordField.password ? faEye : faEyeSlash
                                }
                              />
                            </div>
                              </Col>
                        </InputGroup>
                      </Row>
                      <p className={styles.forgotPassord}>Forgot Password?</p>

                      <Button
                        outline
                        size="lg"
                        block
                        className={[styles.nextBtn, "mt-5"].join(" ")}
                        onClick={this._clickOnNext}
                        disabled={!isFormValid || this.props.isLoading}
                        style={{width: "100%"}}
                      >
                        Next
                      </Button>
                    </FormGroup>
                  </Form>
                </TabPane>

                <TabPane tabId="2">
                  <Form>
                    <FormGroup>
                      <Row>
                        <InputGroup
                          className={styles.inputGroup}
                          style={{ marginTop: 25 }}
                        >
                          <Col xs={12} md={12}>
                            <Input
                              type="text"
                              autoComplete="new-password"
                              id=""
                              name="email"
                              className={[styles.input_with_bottom_border].join(
                                " "
                              )}
                              style={{ width: "100%" }}
                              value={formFields.email.value}
                              onChange={(e) => this._changeFormValue(e, "email")}
                              onBlur={() => this._markAsDirty("email")}
                              placeholder="Email"
                            />
                            {!formFields.email.isValid &&
                              formFields.email.isDirty ? (
                              <p className={styles.error}>Email is mandatory</p>
                            ) : null}
                          </Col>
                        </InputGroup>
                        <InputGroup
                          className={[styles.inputGroup, "mb-0"].join(" ")}
                        >
                          <Col sm={10} xs={10} xl={11} className="pr-0">
                            <Input
                              type={
                                togglePasswordField.password ? "password" : "text"
                              }
                              className={[
                                styles.input_with_bottom_border,
                                styles.passwordInput,
                              ].join(" ")}
                              value={formFields.password.value}
                              onChange={(text) =>
                                this._changeFormValue(text, "password")
                              }
                              onBlur={() => this._markAsDirty("password")}
                              placeholder="Password"
                            />

                            {!formFields.password.isValid &&
                              formFields.password.isDirty ? (
                              <p className={styles.error}>Password is mandatory</p>
                            ) : null}
                          </Col>
                          <Col sm={2} xs={2} xl={1} className="pl-0">
                            <div
                              className={styles.iconWrapper}
                              onClick={() => this._togglePasswordField("password")}
                            >
                              <FontAwesomeIcon
                                icon={
                                  togglePasswordField.password ? faEye : faEyeSlash
                                }
                              />
                            </div>

                          </Col>
                        </InputGroup>
                      </Row>

                      <p className={styles.forgotPassord}>Forgot Password?</p>

                      <Button
                        outline
                        size="lg"
                        block
                        className={styles.nextBtn}
                        onClick={this._clickOnNext}
                        disabled={!isFormValid || this.props.isLoading}
                      >
                        Next
                      </Button>
                    </FormGroup>
                  </Form>
                </TabPane>
              </TabContent>
            </div>
            <div className={styles.existingUserWrapper}>
              <span className={styles.existing_user}>
                Don't have an account?
              </span>
              <span
                className={styles.loginText}
                onClick={this._redirectToCreateAccount}
              >
                Create Account
              </span>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SocialLogin;
