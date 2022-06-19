import React, { Component } from "react";
import { Button, Form, FormGroup, Input, InputGroup } from "reactstrap";
import Geocode from "react-geocode";
import Autocomplete, { geocodeByPlaceId } from "react-google-autocomplete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { deepClone } from "../../helper-methods";

import styles from "./style.module.css";

class CreateAccountSecondStep extends Component {
  constructor() {
    Geocode.setApiKey("AIzaSyAJVtdQu_3dWjNEwaKF04twRoZXYO9w5Ig");
    super();
    this.state = {
      formFields: {
        // fullName: {
        //   value: null,
        //   error: null,
        //   isValid: false,
        //   isDirty: false,
        //   isRequired: true,
        // },
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
        gender: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
        dob: {
          value: "",
          error: null,
          isValid: false,
          isDirty: false,
          isRequired: true,
        },
      },
      isFormValid: false,
    };
  }

  _changeFormValue = (event, attr) => {
    const { formFields } = deepClone(this.state);
    formFields[attr]["value"] = event?.target?.value;
    // For lat lng update
    if (attr === "address") {
      formFields[attr]["lat"] = null;
      formFields[attr]["lng"] = null;
    } else if(attr === "dob" && moment(event).isValid()){
      formFields[attr]["value"] = event;
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
          // case "fullName": {
          //   if (formFields.fullName.value.length) {
          //     formFields.fullName.isValid = true;
          //   } else {
          //     formFields.fullName.isValid = false;
          //     isFormValid = false;
          //   }
          //   break;
          // }
          case "email": {
            if (formFields.email.value.length) {
              formFields.email.isValid = true;
            } else {
              formFields.email.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "address": {
            if (
              formFields.address.value.length &&
              formFields.address.lat &&
              formFields.address.lng
            ) {
              formFields.address.isValid = true;
            } else {
              formFields.address.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "gender": {
            if (formFields.gender.value.length) {
              formFields.gender.isValid = true;
            } else {
              formFields.gender.isValid = false;
              isFormValid = false;
            }
            break;
          }
          case "dob": {
            if (formFields.dob.value) {
              formFields.dob.isValid = true;
            } else {
              formFields.dob.isValid = false;
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
        birth_day: moment(formFields.dob.value).format('DD/MM/YYYY'),
        email_id: formFields.email.value,
        gender:formFields.gender.value,
        address_latitude:formFields.address.lat,
        address_longitude:formFields.address.lng,
        address_name:formFields.address.value,
      };
      console.log(`formFields`, formFields, data)
      this.props.onNext(data);
    }
  };

  _getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // success callback
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Get address from latitude & longitude.
        Geocode.fromLatLng(lat, lng).then(
          (response) => {
            const address = response.results[0].formatted_address;
            const tempFormfields = deepClone(this.state.formFields);
            tempFormfields.address.value = address;
            tempFormfields.address.lat = lat;
            tempFormfields.address.lng = lng;
            this.setState({ formFields: tempFormfields });
          },
          (error) => {
            console.error(error);
          }
        );
      },
      () => {
        // error callback
      },
      { timeout: 10000 }
    );
  };

  _getAddressObject = (address_components) => {
    
    const ShouldBeComponent = {
      street_number: ["street_number"],
      postal_code: ["postal_code"],
      street: ["street_address", "route"],
      province: [
        "administrative_area_level_1",
        "administrative_area_level_2",
        "administrative_area_level_3",
        "administrative_area_level_4",
        "administrative_area_level_5",
      ],
      city: [
        "locality",
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "sublocality_level_3",
        "sublocality_level_4",
      ],
      country: ["country"],
    };

    let address = {
      street_number: "",
      postal_code: "",
      street: "",
      province: "",
      city: "",
      country: "",
    };

    address_components.forEach((component) => {
      for (var shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          if (shouldBe === "country") {
            address[shouldBe] = component.short_name;
          } else {
            address[shouldBe] = component.long_name;
          }
        }
      }
    });

    // Fix the shape to match our schema
    address.address = address.street_number + " " + address.street;
    delete address.street_number;
    delete address.street;
    if (address.country === "US") {
      address.state = address.province;
      delete address.province;
    }
    return address;
  };

  _selectPlace = async (place) => {
    const { formFields } = deepClone(this.state);

    formFields["address"]["lat"] = place.geometry.location.lat();
    formFields["address"]["lng"] = place.geometry.location.lng();
    formFields["address"]["value"] = place?.formatted_address;
    this.setState({ formFields });
  };

  render() {
    const { formFields, isFormValid } = deepClone(this.state);

    return (
      <div style={{ width: "60%" }}>
        <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          Create an Account
        </p>
        <p className={styles.subHeader}>Kindly enter the following details</p>
        <div className={styles.form_wrapper}>
          <Form>
            <FormGroup row>
              <InputGroup className={styles.inputGroup}>
                <Input
                  type="text"
                  name="fullName"
                  className={[styles.input_with_bottom_border].join(",")}
                  value={this.props.name}
                  // onChange={(e) => this._changeFormValue(e, "fullName")}
                  // onBlur={() => this._markAsDirty("fullName")}
                  placeholder="First Name"
                  disabled
                />
                {/* {!formFields.fullName.isValid && formFields.fullName.isDirty ? (
                  <p className={styles.error}>Full name is mandatory</p>
                ) : null} */}
              </InputGroup>
              <InputGroup className={styles.inputGroup}>
                <Input
                  type="text"
                  id=""
                  name="email"
                  className={[styles.input_with_bottom_border].join(",")}
                  value={formFields.email.value}
                  onChange={(e) => this._changeFormValue(e, "email")}
                  onBlur={() => this._markAsDirty("email")}
                  placeholder="Email"
                />
                {!formFields.email.isValid && formFields.email.isDirty ? (
                  <p className={styles.error}>Email is mandatory</p>
                ) : null}
              </InputGroup>
              <InputGroup className={styles.inputGroup}>
                <Autocomplete
                  className={[styles.input_with_bottom_border].join(" ")}
                  apiKey={"AIzaSyAJVtdQu_3dWjNEwaKF04twRoZXYO9w5Ig"}
                  options={{
                    componentRestrictions: {
                      country: ["sg"],
                    },
                    types: ["establishment"],
                  }}
                  value={formFields.address.value}
                  onChange={(e) => this._changeFormValue(e, "address")}
                  onPlaceSelected={(place) => {
                    this._selectPlace(place);
                  }}
                  placeholder="Address"
                />
                {/*   <Input
                  type="text"
                  id=""
                  name="address"
                  className={[styles.input_with_bottom_border].join(" ")}
                  value={formFields.address.value}
                  onChange={(e) => this._changeFormValue(e, "address")}
                  onBlur={() => this._markAsDirty("address")}
                  placeholder="Address"
                /> */}
                {!formFields.address.isValid && formFields.address.isDirty ? (
                  <p className={styles.error}>Valid address is mandatory</p>
                ) : null}
                <div
                  className={styles.locationWrapper}
                  onClick={this._getCurrentLocation}
                >
                  <img
                    src="/assets/img/location-marker.svg"
                    alt="location_marker"
                  />
                  <span>Use current location</span>
                </div>
              </InputGroup>

              <InputGroup className={styles.inputGroup}>
                <select
                  type="select"
                  className={styles.customSelect}
                  value={formFields.gender.value}
                  onChange={(e) => this._changeFormValue(e, "gender")}
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                {!formFields.gender.isValid && formFields.gender.isDirty ? (
                  <p className={styles.error}>Gender is mandatory</p>
                ) : null}
              </InputGroup>

              <InputGroup className={styles.inputGroup}>
                <DatePicker 
                 className={[styles.input_with_bottom_border, styles.dob].join(
                  " "
                )}
                selected={formFields.dob.value}
                  onChange={(e) => this._changeFormValue(e, "dob")}
                  maxDate={new Date()}
                  showDisabledMonthNavigation
                  placeholderText="DOB"
                  dateFormat="dd/MM/yyyy"
                />
                {/* <Input
                  type="date"
                  id=""
                  name="dob"
                  className={[styles.input_with_bottom_border, styles.dob].join(
                    " "
                  )}
                  value={formFields.dob.value}
                  onChange={(e) => this._changeFormValue(e, "dob")}
                  onBlur={() => this._markAsDirty("dob")}
                  placeholder="DOB -&nbsp;"
                  data-date-format="DD/MM/YYYY"
                  max={new Date()}
                /> */}
                {!formFields.dob.isValid && formFields.dob.isDirty ? (
                  <p className={styles.error}>DOB is mandatory</p>
                ) : null}
              </InputGroup>
              <p className={styles.agreeText}>
                By clicking below, you are agreeing to our{" "}
                <span className={styles.agreeTextLink}>
                  Terms and Conditions
                </span>
              </p>
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

export default CreateAccountSecondStep;
