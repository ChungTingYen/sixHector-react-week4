/* eslint-disable react/prop-types */
import * as apiService from "../apiService/apiService";
import * as utils from "../utils/utils";
const AppFunction = (props) => {
  const { setIsLogin } = props;

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
      }
    } catch (error) {
      alert("error:" + error.response.data.message);
      console.log(error);
    }
  };
  return (
    <>
      <div className="row mt-5 mt-1 mb-2 mx-1">
        <div className="d-flex">
          <h3>檢查功能</h3>
          <button
            type="button"
            className="btn btn-warning mx-1"
            onClick={handleCheckLogin}
          >
            檢查登入狀態
          </button>
          <button
            type="button"
            className="btn btn-warning mx-1"
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
      </div>
    </>
  );
};

export default AppFunction;
