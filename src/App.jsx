 
import { useState } from "react";
import { ProductListsPage, LoginPage } from "./pages";
import { LoginContext } from './component/LoginContext';
function App() {
  const [isLogin, setIsLogin] = useState(false);

  //參考同學的Loading
  //const [isLoading, setIsLoading] = useState(false);
  // const Loading = ({ isLoading }) => {
  //   return (
  //     <div
  //       className="loading"
  //       style={{
  //         display: isLoading ? "flex" : "none",
  //       }}
  //     >
  //       <div className="spinner-border" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      {/* <Loading isLoading={isLoading} /> */}
      <LoginContext.Provider value={{ setIsLogin }}>
        {isLogin ? (
          <ProductListsPage />
        ) : (
          <LoginPage />
        )}
      </LoginContext.Provider>
    </>
  );
}

export default App;
