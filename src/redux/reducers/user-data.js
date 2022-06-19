import { STORE_USER_TOKEN, CLEAR_USER_DATA, STORE_USER_DATA } from "../actions/action-types";

const initialState = {
  token: null,
  user: null
};

export const userDataReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case STORE_USER_TOKEN: {
      newState["token"] = action.payload.token;
      break;
    }

    case STORE_USER_DATA: {
      newState["user"] = action.payload.user;
      break;
    }

    case CLEAR_USER_DATA: {
      newState = initialState;
      break;
    }
    default: {
    }
  }
  return newState;
};
