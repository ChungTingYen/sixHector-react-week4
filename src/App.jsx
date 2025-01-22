import { useState } from "react";
import { ProductListsPage, LoginPage } from "./pages";
import { LoginContext } from './component/LoginContext';
function App() {
  const [isLogin, setIsLogin] = useState(false);

  //測試用Modal
  // useEffect(() => {
  //   if (detailLoading && Object.keys(tempProduct).length > 0) {
  //     const timeId = setTimeout(() => {
  //       appModalRef.current.close();
  //     }, 3000);
  //     return () => clearTimeout(timeId);
  //   }
  // }, [detailLoading]);

  return (
    <>
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
