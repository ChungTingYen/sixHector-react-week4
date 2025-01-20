/* eslint-disable react/prop-types */
// import axios from "axios";
import { useState, useEffect } from "react";
import * as apiService from "../apiService/apiService";
import * as utils from "../utils/utils";

const Login = (props) => {
  const { setIsLogin } = props;
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const changeInput = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };
  //登入
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.axiosPostSignin("/admin/signin", account);
      alert(res.data.message);
      if (res.data.success) {
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        //執行axios.defaults.headers.common.Authorization
        // axios.defaults.headers.common.Authorization = token;
        setIsLogin(true);
        // const nowHeaders = {
        //   Authorization: token,
        // };
        // setHeaders(nowHeaders);
        // utils.getProductData(nowHeaders, setProductData, pagesRef);
      }
    } catch (error) {
      alert("error:", error);
      console.log(error);
    }
  };
  const handleCheckLogin2 = async () => {
    const headers = utils.getHeadersFromCookie();
    if (headers === null) return;
    try {
      await apiService.axiosPostCheckSingin("/api/user/check", headers);
      setIsLogin(true);
    } catch (error) {
      // alert("error123:",  error);
      console.log(error);
    }
  };
  useEffect(() => {
    console.log('handleCheckLogin2');
    handleCheckLogin2();
  });
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              placeholder="name@example.com"
              name="username"
              onChange={changeInput}
              value={account.username}
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="password"
              onChange={changeInput}
              value={account.password}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary" type="submit">
            登入
          </button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
};

export default Login;
