import React from 'react';
export const LoginContext = React.createContext(null);
export const useLogin = () => React.useContext(LoginContext);

