import { store } from "../redux/store";
import * as _deepClone from "clone-deep";
import { toast } from "react-toastify";
import * as jwt_decode from "jwt-decode";
import {DeviceUUID} from "device-uuid";
import { history } from "../App";
import { clearUserData } from "../redux/actions/user-data";

export const logout = async (navRef) => {
  // Clear reducers data also
  store.dispatch(clearUserData());
};

export const deepClone = (data) => {
  return _deepClone(data);
};

export const sleepTime = (n) => new Promise((r) => setTimeout(() => r(), n));

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const showToast = (message, type = "error", duration = 4000) => {
console.log("🚀 ~ file: index.js ~ line 30 ~ showToast ~ message", message)
  toast[type](message);
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const decodeToken = (token) => {
  return jwt_decode(token);
};

export const transformArrayToObject = (sourceArray, objectKeyPropertyName) => {
  let resultantObject = {};
  if (sourceArray && sourceArray.length) {
    sourceArray.forEach((elem) => {
      resultantObject[elem[objectKeyPropertyName]] = elem;
    });
    return resultantObject;
  }
};

export const isObjectEmpty = (sourceObject = {}) => {
  return Object.keys(sourceObject).length === 0;
};

export const fetchAndDecodeToken = () => {
  let state = store.getState();
  if (state && state.userData && state.userData.token) {
    return decodeToken(state.userData.token);
  }
};

export const capitalizeEveryFirstLetter = (text = "") => {
  const modifiedText = text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return modifiedText;
};

export const calculateTotal = (arr, attr) => {
  let totalAmount = arr.reduce((acc, each) => {
    return (acc = Number(acc) + Number(each[attr]));
  }, 0);
  return totalAmount.toFixed(2);
};

export const sum = (a = 0, b = 0) => (Number(a) + Number(b)).toFixed(2);

export const formatNumber = (number) => {
  let formatedNumber = new Intl.NumberFormat().format(
    Number(number).toFixed(2)
  );
  return formatedNumber;
};

export const secondsToHms = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);

  const hDisplay = h > 0 ? (h > 9 ? h :( "0" + h)) + ":" : "";
  const mDisplay =m > 0 ? (m > 9 ? m :( "0" + m)) + ":" : "";
  const sDisplay = s > 0 ? (s > 9 ? s :( "0" + s)) + "s" : "";
  return hDisplay + (mDisplay?.length ? mDisplay : '00:') + sDisplay; 
}

export const getDeviceUUID = () => {
  return new DeviceUUID().get();
}

export const getHeader = () => {
  const header = {
    'x-header-device_id': getDeviceUUID(),
    'x-header-platform': 'web'
  }
  // "Authorization": "Bearer"+ " token"
  return header;
}
