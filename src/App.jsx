 
import { useState } from "react";
import {
  ProductLists,
  Login,
  AppFunction,
} from "./component";
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
      {/* <pre>{JSON.stringify(productData, null, 2)}</pre> */}
      {isLogin ? (
        <>
          <AppFunction setIsLogin={setIsLogin}/>
          <ProductLists/>
        </>
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </>
  );
}

export default App;
