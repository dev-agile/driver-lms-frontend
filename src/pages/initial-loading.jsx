import React, { useEffect } from "react";
import { isUserAuthenticated } from "../guards/auth-guard";

const InitialLoading = (props) =>  {
  useEffect(() => {
    if (isUserAuthenticated()) {
      props.history.push("/dashboard");
      return;
    }
    props.history.push("/login");
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div></div>;
}

export default InitialLoading;
