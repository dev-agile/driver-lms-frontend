import React, { createContext, useState } from "react";

export const RegistrationDataContext = createContext();

const RegistrationDataContextProvider = ({ children }) => {
  const [firstStepData, _firstStepData] = useState(null);
  const [secondStepData, _secondStepData] = useState(null);

  return (
    <RegistrationDataContext.Provider
      value={{ firstStepData, _firstStepData, secondStepData, _secondStepData }}
    >
      {children}
    </RegistrationDataContext.Provider>
  );
};

export default RegistrationDataContextProvider;