/* eslint-disable react/prop-types */
import React from "react";
import * as apiService from "../apiService/apiService";
import { productDataAtLocal } from "../productDataAtLocal";
import * as utils from "../utils/utils";
const AppFunction = (props) =>{
  const { setIsLogin } = props;
    
  const APIPath = import.meta.env.VITE_API_PATH;
  //檢查登入狀態
  const handleCheckLogin = async () => {
    try {
      const headers = utils.getHeadersFromCookie();
      const res = await apiService.axiosPostCheckSingin(
        "/api/user/check",
        headers
      );
      alert(res.data.success ? "已登入成功" : "請重新登入");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  const handleLogout = async () => {
    try {
      const headers = utils.getHeadersFromCookie();
      const res = await apiService.axiosPostLogout("/logout", headers);
      alert(res.data.success ? res.data.message : "登出失敗");
      if (res.data.success) {
        setIsLogin(false);
        // setProductData([]);
        // setTempProduct(null);
        // setSelectedRowIndex(null);
        // setHeaders(null);
      }
    } catch (error) {
      alert("error:" + error.response.data.message);
      console.log(error);
    }
  };
  return (<>
    <div className="row mt-5 mx-2">
      <div className="d-flex">
        <h3>外層功能</h3>
        <button
          type="button"
          className="btn btn-warning mx-2"
          onClick={handleCheckLogin}
        >
                檢查登入狀態
        </button>
        <button
          type="button"
          className="btn btn-warning me-2"
          onClick={handleLogout}
        >
            登出
        </button>
      </div>
    </div>
  </>);
};

export default AppFunction;