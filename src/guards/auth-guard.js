import { store } from "../redux/store";

export const isUserAuthenticated = () => {
  const state = store.getState();
  console.log("🚀 ~ file: auth-guard.js ~ line 5 ~ isUserAuthenticated ~ state", state)

  if (state?.userData?.token?.length) {
    return true;
  }
  return false;
};
