import React from "react";
import OTPVerificationContextProvider from "./OTPVerificationContext";
import RegistrationDataContextProvider from "./RegistrationDataContext";

const ContextWrapper = ({ children }) => {
  return (
    <RegistrationDataContextProvider>
      <OTPVerificationContextProvider>
        {children}
      </OTPVerificationContextProvider>
    </RegistrationDataContextProvider>
  );
};

export default ContextWrapper;
