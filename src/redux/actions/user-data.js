import { STORE_USER_TOKEN, CLEAR_USER_DATA, STORE_USER_DATA } from "./action-types";

export const storeUserToken = (token) => {
  return {
    type: STORE_USER_TOKEN,
    payload: {
      token,
    },
  };
};

export const storeUserData = (user) => {
console.log("🚀 ~ file: user-data.js ~ line 13 ~ storeUserData ~ user", user)
  return {
    type: STORE_USER_DATA,
    payload: {
      user,
    },
  };
};

export const clearUserData = () => {
  return {
    type: CLEAR_USER_DATA,
  };
};
