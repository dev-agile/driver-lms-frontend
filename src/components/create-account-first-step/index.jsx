import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { deepClone } from "../../helper-methods";

import styles from "./style.module.css";
import { RegexConfig } from "../../config/RegexConfig";

class CreateAccountFirstStep extends Component {
  constructor() {
    super();
    this.state = {
      formFields: {
        firstName: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        lastName: {
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
        confirmPassword: {
          value: "",
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
    };
  }

  _togglePasswordField = (field) => {
    const { togglePasswordField } = deepClone(this.state);
    togglePasswordField[field] = !togglePasswordField[field];
    this.setState({ togglePasswordField });
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
      const { formFields } = deepClone(this.state);

      let isFormValid = true;

      Object.keys(formFields).forEach((fieldName, index) => {
        switch (fieldName) {
          case "firstName": {
            if (formFields.firstName.value.length) {
              formFields.firstName.isValid = true;
            } else {
              formFields.firstName.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "lastName": {
            if (formFields.lastName.value.length) {
              formFields.lastName.isValid = true;
            } else {
              formFields.lastName.isValid = false;
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
          case "confirmPassword": {
            if (
              formFields.confirmPassword.value.length &&
              formFields.password.value === formFields.confirmPassword.value
            ) {
              formFields.confirmPassword.isValid = true;
            } else {
              formFields.confirmPassword.isValid = false;
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

  _clickOnNext = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // if (this.state.isLoading) {
    //   return;
    // }
    await this._makeAllFieldDirty();
    await this._validateForm();

    const { formFields, isFormValid } = deepClone(this.state);
    if (isFormValid) {
      const data = {
        first_name: formFields?.firstName?.value,
        last_name: formFields?.lastName?.value,
        password: formFields?.password?.value,
      };
      this.props.onNext(data);
    }
  };

  render() {
    const { formFields, isFormValid, togglePasswordField } = deepClone(
      this.state
    );
    return (
      <div style={{ width: "60%" }}>
        <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          Create an Account
        </p>
        <div className={styles.form_wrapper}>
          <Form>
            <FormGroup row>
              <InputGroup className={styles.inputGroup}>
                <Input
                  type="text"
                  id=""
                  name="firstName"
                  className={[styles.input_with_bottom_border].join(",")}
                  value={formFields.firstName.value}
                  onChange={(e) => this._changeFormValue(e, "firstName")}
                  onBlur={() => this._markAsDirty("firstName")}
                  placeholder="First Name"
                />
                {!formFields.firstName.isValid &&
                formFields.firstName.isDirty ? (
                  <p className={styles.error}>First name is mandatory</p>
                ) : null}
              </InputGroup>
              <InputGroup className={styles.inputGroup}>
                <Input
                  className={[styles.input_with_bottom_border].join(",")}
                  value={formFields.lastName.value}
                  onChange={(text) => this._changeFormValue(text, "lastName")}
                  onBlur={() => this._markAsDirty("lastName")}
                  placeholder="Last Name"
                />
                {!formFields.lastName.isValid && formFields.lastName.isDirty ? (
                  <p className={styles.error}>Last name is mandatory</p>
                ) : null}
              </InputGroup>
              <InputGroup className={styles.inputGroup}>
                <Input
                  type={togglePasswordField.password ? "password" : "text"}
                  className={[
                    styles.input_with_bottom_border,
                    styles.passwordInput,
                  ].join(" ")}
                  value={formFields.password.value}
                  onChange={(text) => this._changeFormValue(text, "password")}
                  onBlur={() => this._markAsDirty("password")}
                  placeholder="Password"
                />
                <div
                  className={styles.iconWrapper}
                  onClick={() => this._togglePasswordField("password")}
                >
                  <FontAwesomeIcon
                    icon={togglePasswordField.password ? faEye : faEyeSlash}
                  />
                </div>
                {!formFields.password.isValid && formFields.password.isDirty ? (
                  <p className={styles.error}>Password is mandatory</p>
                ) : null}
              </InputGroup>
              <InputGroup className={styles.inputGroup}>
                <Input
                  type={
                    togglePasswordField.confirmPassword ? "password" : "text"
                  }
                  className={[
                    styles.input_with_bottom_border,
                    styles.passwordInput,
                  ].join(" ")}
                  value={formFields.confirmPassword.value}
                  onChange={(text) =>
                    this._changeFormValue(text, "confirmPassword")
                  }
                  onBlur={() => this._markAsDirty("confirmPassword")}
                  placeholder="Confirm Password"
                  style={{ width: "80% !important" }}
                />
                <div
                  className={styles.iconWrapper}
                  onClick={() => this._togglePasswordField("confirmPassword")}
                >
                  <FontAwesomeIcon
                    icon={
                      togglePasswordField.confirmPassword ? faEye : faEyeSlash
                    }
                  />
                </div>

                {!formFields.confirmPassword.isValid &&
                formFields.confirmPassword.isDirty ? (
                  <p className={styles.error}>
                    {!formFields.confirmPassword.value
                      ? "Confirm Password is mandatory"
                      : "Should be same as password"}
                  </p>
                ) : null}
              </InputGroup>
              <Button
                outline
                size="lg"
                block
                className={styles.nextBtn}
                onClick={this._clickOnNext}
              >
                Next
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

export default CreateAccountFirstStep;
