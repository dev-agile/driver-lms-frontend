import React, { Component } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  CustomInput,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPenSquare,
  faUserCircle,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import ReactCustomFlagSelect from "react-custom-flag-select";
import Autocomplete, { geocodeByPlaceId } from "react-google-autocomplete";

import styles from "./style.module.css";
import { deepClone } from "../../helper-methods";
import { CountryCodes } from "../../config/CountryCodeConfig";
import moment from "moment";
import { RegexConfig } from "../../config/RegexConfig";
import { addCustomerPhone } from "../../http-calls";

class AddContactModal extends Component {
  constructor() {
    super();
    this.state = {
      cImg: "https://img.icons8.com/ios-filled/35/ffffff/mac-os.png",
      formFields: {
        image: {
          preview: null,
          value: null,
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },

        fullName: {
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
        address: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
          lat: null,
          lng: null,
        },
        mobile: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        isFavourite: {
          value: false,
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        isDefaultAddress: {
          value: false,
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
      isFormValid: false,
    };
  }

  _uploadPhoto = (e) => {
    if (e.target.files.length) {
      const { formFields } = deepClone(this.state);

      formFields["image"]["preview"] = URL.createObjectURL(e.target.files[0]);
      formFields["image"]["value"] = e.target.files[0];
      this.setState({ formFields });
    }
  };

  _changeFormValue = (value, attr) => {
    const { formFields } = deepClone(this.state);
    formFields[attr]["value"] = value;
    // For lat lng update
    if (attr === "address") {
      formFields[attr]["lat"] = null;
      formFields[attr]["lng"] = null;
    }
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
          case "fullName": {
            if (formFields.fullName.value.length) {
              formFields.fullName.isValid = true;
            } else {
              formFields.fullName.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "email": {
            if (
              (formFields.email.value.length &&
                RegexConfig.email.test(String(formFields.email.value))) ||
              !formFields.email.value?.length
            ) {
              formFields.email.isValid = true;
            } else {
              formFields.email.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "address": {
            console.log(
              `address`,
              formFields.address,
              !formFields.address.value?.length ||
                (formFields.address.value.length &&
                  formFields.address.lat &&
                  formFields.address.lng)
            );
            if (
              !formFields.address.value?.length ||
              (formFields.address.value.length &&
                formFields.address.lat &&
                formFields.address.lng)
            ) {
              console.log(`if`);
              formFields.address.isValid = true;
            } else {
              console.log(`else`);

              formFields.address.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "mobile": {
            if (formFields.mobile.value?.length === 10 ) {
              formFields.mobile.isValid = true;
            } else {
              formFields.mobile.isValid = false;
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

  _createContact = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // if (this.state.isLoading) {
    //   return;
    // }
    await this._makeAllFieldDirty();
    await this._validateForm();

    const { formFields, isFormValid } = deepClone(this.state);
    console.log(
      "🚀 ~ file: index.jsx ~ line 197 ~ AddContactModal ~ _createContact= ~ formFields, isFormValid",
      formFields,
      isFormValid
    );
    if (isFormValid) {

      const data = {
        country_code: `+${formFields.countryCode.value.id}`,
        phone_number: formFields.mobile.value,
        full_name: formFields.fullName.value,
        isFavorite: formFields.isFavourite.value,
        isDefault: formFields.isDefaultAddress.value,
      };

      if (formFields.address?.value?.length) {
        data["address_name"] = formFields.address?.value;
        data["address_latitude"] = formFields.address?.lat;
        data["address_longitude"] = formFields.address?.lng;
      }

      if (formFields.address?.value?.length) {
        data["address_name"] = formFields.address?.value;
        data["address_latitude"] = formFields.address?.lat;
        data["address_longitude"] = formFields.address?.lng;
      }

      console.log(`data`, data)

      this._addContactAPI(data);
    }
  };

  _addContactAPI = (data = null) => {
    if(!data) return;

    addCustomerPhone(data).then(res => {
    console.log("🚀 ~ file: index.jsx ~ line 272 ~ AddContactModal ~ addCustomerPhone ~ res", res)

    })
    .catch(err => {
    console.log("🚀 ~ file: index.jsx ~ line 276 ~ AddContactModal ~ err", err)
      
    })
  }

  _selectPlace = async (place) => {
    const { formFields } = deepClone(this.state);

    formFields["address"]["lat"] = place.geometry.location.lat();
    formFields["address"]["lng"] = place.geometry.location.lng();
    formFields["address"]["value"] = place?.formatted_address;

    console.log(`formFields["address"]`, formFields["address"]);
    this.setState({ formFields });
  };

  render() {
    const { isVisible, closeModal } = this.props;
    const { formFields, isFormValid } = deepClone(this.state);

    return (
      <div>
        <Modal
          isOpen={isVisible}
          toggle={closeModal}
          backdrop={true}
          keyboard={true}
          className={styles.contactModal}
          wrapClassName="offffff"
          style={{ zIndex: 1100 }}
        >
          <p className={styles.heading}>ADD NEW CONTACT</p>
          <div className={styles.icon_container}>
            <label htmlFor="upload-button">
              {formFields.image.preview ? (
                <img
                  className={styles.userImage}
                  src={formFields.image.preview}
                  alt="IMG_PREVIEW"
                />
              ) : (
                <FontAwesomeIcon
                  size="6x"
                  color="#E4F1F3"
                  icon={faUserCircle}
                />
              )}
            </label>
            <input
              type="file"
              id="upload-button"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => this._uploadPhoto(e)}
            />{" "}
            <label htmlFor="upload-button">
              <FontAwesomeIcon size="2x" color="#39B8CD" icon={faPenSquare} />
            </label>
            <span className={styles.close} onClick={closeModal}>
              <FontAwesomeIcon size="2x" color="#718093" icon={faTimes} />
            </span>
            <span
              className={styles.back}
              onClick={closeModal}
              htmlFor="upload-button"
            >
              <FontAwesomeIcon
                size="2x"
                color="#718093"
                icon={faLongArrowAltLeft}
              />
            </span>
          </div>
          <Form className={[styles.form_wrap, "mt-xl-5"].join(" ")}>
            <Row className={styles.form_fields}>
              <Col md={12} className="mb-4">
                <FormGroup>
                  {/* <Label for="exampleEmail">Email</Label> */}
                  <Input
                    type="text"
                    name="fullname"
                    id="name"
                    placeholder="Full Name"
                    value={formFields.fullName.value}
                    onChange={(e) =>
                      this._changeFormValue(e.target.value, "fullName")
                    }
                    onBlur={() => this._markAsDirty("fullName")}
                  />
                  {!formFields.fullName.isValid &&
                  formFields.fullName.isDirty ? (
                    <p className={styles.error}>Full Name is mandatory</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col xs={3} sm={3} md={3} lg={3} xl={3} className="mb-4 pr-0">
                <FormGroup>
                  {/* <Label for="exampleSelect">Select</Label> */}
                  {/* <Input type="select" name="select" id="mobile"  value={formFields.mobile.value}
                  onChange={(e) => this._changeFormValue(e.target.value, "mobile")}>
                    <option value="65">
                      65
                    </option>
                  </Input> */}

                  <ReactCustomFlagSelect
                    attributesWrapper={{ id: "areaCodeWrapper", tabIndex: "1" }} //Optional.[Object].Modify wrapper general attributes.
                    attributesButton={{ id: "areaCodeButton" }} //Optional.[Object].Modify button general attributes.
                    attributesInput={{ id: "areaCode", name: "areaCode" }}
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
                      marginTop: 15,
                      // width: 20,
                      borderBottom: "2px solid #ced4da ",
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
                </FormGroup>
              </Col>
              <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                <FormGroup>
                  {/* <Label for="exampleEmail">Email</Label> */}
                  <Input
                    type="text"
                    name="numer"
                    id="number"
                    placeholder="Mobile Number"
                    value={formFields.mobile.value}
                    onChange={(e) =>
                      this._changeFormValue(e.target.value, "mobile")
                    }
                    onBlur={() => this._markAsDirty("mobile")}
                  />
                  {!formFields.mobile.isValid && formFields.mobile.isDirty ? (
                    <p className={styles.error}>Mobile Number is mandatory</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md={12} className="mb-4">
                <FormGroup>
                  {/* <Label for="exampleEmail">Email</Label> */}
                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="Email Id"
                    value={formFields.email.value}
                    onChange={(e) =>
                      this._changeFormValue(e.target.value, "email")
                    }
                    onBlur={() => this._markAsDirty("email")}
                  />
                  {!formFields.email.isValid && formFields.email.isDirty ? (
                    <p className={styles.error}>Email is mandatory</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md={12} className="mb-4">
                <FormGroup>
                  <Autocomplete
                    className={styles.autoComplete}
                    style={{ width: "100%" }}
                    apiKey={"AIzaSyAJVtdQu_3dWjNEwaKF04twRoZXYO9w5Ig"}
                    options={{
                      componentRestrictions: {
                        country: ["sg"],
                      },
                      types: ["establishment"],
                    }}
                    value={formFields.address.value}
                    onChange={(e) =>
                      this._changeFormValue(e?.target?.value, "address")
                    }
                    onPlaceSelected={(place) => {
                      this._selectPlace(place);
                    }}
                    placeholder="Address"
                  />
                  {/* <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Address"
                    value={formFields.address.value}
                    onChange={(e) =>
                      this._changeFormValue(e.target.value, "address")
                    }
                    onBlur={() => this._markAsDirty("address")}
                  /> */}
                  {!formFields.address.isValid && formFields.address.isDirty ? (
                    <p className={styles.error}>Address is mandatory</p>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={10} xs={10}>
                <p className="mb-2">Add to Favourite</p>
              </Col>
              <Col md={2} xs={2}>
                <CustomInput
                  type="switch"
                  id="isFavourite"
                  name="isFavourite"
                  value={formFields.isFavourite.value}
                  onChange={(e) =>
                    this._changeFormValue(e.target.checked, "isFavourite")
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col sm={10} xs={10} md={10}>
                <p className="m-0">Set as Default Pickup Address</p>
              </Col>
              <Col md={2} sm={2} xs={2}>
                <CustomInput
                  type="switch"
                  id="isDefaultAddress"
                  name="isDefaultAddress"
                  value={formFields.isDefaultAddress.value}
                  onChange={(e) =>
                    this._changeFormValue(e.target.checked, "isDefaultAddress")
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className={styles.addBtn}>
                <Button
                  className="w-100"
                  id="add"
                  color="primary"
                  size="lg"
                  block
                  onClick={this._createContact}
                  disabled={!isFormValid}
                >
                  Add Contact
                </Button>
              </Col>
              <Col md={12} className={styles.cancelBtn}>
                <Button
                  className="w-100"
                  color="secondary"
                  size="lg"
                  block
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default AddContactModal;
