import React, { createContext, useState } from "react";

export const OTPVerificationContext = createContext();

const OTPVerificationContextProvider = ({ children }) => {
  const [phoneNumber, _phoneNumber] = useState(null);
  const [verificationToken, _verificationToken] = useState(null);

  return (
    <OTPVerificationContext.Provider
      value={{ phoneNumber, _phoneNumber, verificationToken, _verificationToken }}
    >
      {children}
    </OTPVerificationContext.Provider>
  );
};

export default OTPVerificationContextProvider;