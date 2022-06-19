import axios from "axios";

import { API_URL } from "../config/ApiConfig";
import { getHeader } from "../helper-methods";
import { resolve } from "../interceptors/token-interceptor";

export const requestForOtp = async (data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}customer/sign-up/send/sms-otp`, data, {
        headers: getHeader(),
      })
      .then((res) => {
        console.log("🚀 ~ file: index.js ~ line 14 ~ .then ~ res", res);
        resolve(res);
      })
      .catch(async (error) => {
        const response = error?.response;

        if (typeof response.data.text === "function") {
          const responsePayload = await response.data.text();
          resolve(responsePayload);
        } else {
          console.log(
            "🚀 ~ file: index.js ~ line 19 ~ requestForOtp ~ response",
            response
          );
          resolve(response);
        }
      });
  });
};

export const verifyOTP = async (data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}customer/sign-up/verify/sms-otp`, data, {
        headers: getHeader(),
      })
      .then((res) => {
        resolve(res);
      })
      .catch(async (error) => {
        const response = error?.response;
        if (typeof response.data.text === "function") {
          const responsePayload = await response.data.text();
          resolve(responsePayload);
        } else {
          resolve(response);
        }
      });
  });
};

export const signupUser = async (data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}customer/sign-up`, data, {
        headers: getHeader(),
      })
      .then((res) => {
        resolve(res);
      })
      .catch(async (error) => {
        const response = error?.response;
        if (typeof response?.data?.text === "function") {
          const responsePayload = await response.data.text();
          resolve(responsePayload);
        } else {
          resolve(response);
        }
      });
  });
};

export const loginViaPhoneNumber = async (data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}customer/sign-in/phone-number`, data, {
        headers: getHeader(),
      })
      .then((res) => {
        resolve(res);
      })
      .catch(async (error) => {
        const response = error?.response;
        if (typeof response?.data?.text === "function") {
          const responsePayload = await response.data.text();
          resolve(responsePayload);
        } else {
          resolve(response);
        }
      });
  });
};

export const loginViaEmail = async (data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}customer/sign-in/email`, data, {
        headers: getHeader(),
      })
      .then((res) => {
        resolve(res);
      })
      .catch(async (error) => {
        const response = error?.response;
        if (typeof response.data.text === "function") {
          const responsePayload = await response.data.text();
          resolve(responsePayload);
        } else {
          resolve(response);
        }
      });
  });
};

export const addCustomerPhone = async (data = null) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}customer/phone-book`, data, {
        headers: getHeader(),
      })
      .then((res) => {
        resolve(res);
      })
      .catch(async (error) => {
        const response = error?.response;
        if (typeof response.data.text === "function") {
          const responsePayload = await response.data.text();
          resolve(responsePayload);
        } else {
          resolve(response);
        }
      });
  });
};
