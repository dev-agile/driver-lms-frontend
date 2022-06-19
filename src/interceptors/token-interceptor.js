import { store } from "../redux/store";

/**
 *
 * Checks for auth token in auth state & storage
 *
 */
export const getToken = () => {
  return new Promise((resolve, reject) => {
    let token = null;
    const oldState = store.getState();
    const state = { ...oldState };
    // Try to get token from state
    if (
      state &&
      state.userData &&
      state.userData["token"]
    ) {
      token = state.userData["token"];
    }
    resolve(token);
  });
};


export const resolve = async (promise) => {

  const resolved = {
    data: null,
    error: null
  };
  try {
    console.log(`promise`, promise)
    resolved.data = await promise;

  } catch (e) {
    console.log("🚀 ~ file: token-interceptor.js ~ line 40 ~ resolve ~ e", e)
    resolved.error = e.response;

    promise.catch((data) => {
    console.log("🚀 ~ file: token-interceptor.js ~ line 41 ~ resolve ~ data", data)
   
      // datadogLogs.logger.log(e,{data,error:resolved.error},'error');
    })
  }
  return resolved;
}


