 
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import * as apiService from "./apiService/apiService";
import {
  ProductLists,
  Login,
  AppFunction,
} from "./component";
import { productDataAtLocal } from "./products";
import * as utils from "./utils/utils";
// import { tempProductDefaultValue } from "./defaultValue";
// import { Modal } from "bootstrap";
function App() {
  // const [productData, setProductData] = useState([]);
  // const [headers, setHeaders] = useState(null);
  // const [tempProduct, setTempProduct] = useState(null);
  // const [editProduct, setEditProduct] = useState(tempProductDefaultValue);
  // const [account, setAccount] = useState({
  //   username: "",
  //   password: "",
  // });
  const APIPath = import.meta.env.VITE_API_PATH;
  const [isLogin, setIsLogin] = useState(false);
  // const productDetailIdRef = useRef(null);
  //測試功能 start
  const appModalRef = useRef(null);
  // const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  // const [search, setSearch] = useState("");
  // const [priceAscending, setPriceAscending] = useState(false);
  // const axiosConfigRef = useRef({
  //   params: { page: 0, category: "" },
  //   headers: { Authorization: "" },
  // });
  // const pagesRef = useRef({
  //   current_page: 0,
  //   total_pages: 0,
  //   category: "",
  // });
  //測試功能 end

  // const filterData = useMemo(() => {
  //   return [...productData]
  //     .filter((item) => item.title.match(search))
  //     .sort((a, b) => a.title.localeCompare(b.title))
  //     .sort((a, b) => priceAscending && a.price - b.price);
  // }, [productData, search, priceAscending]);

  // const changeInput = (e) => {
  //   setAccount({
  //     ...account,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  //檢查登入狀態，先留著
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
  //上傳內建資料隨機一項產品，先留著
  const handleAddProduct = async () => {
    const productIndex = parseInt(Date.now()) % productDataAtLocal.length;
    const wrapData = {
      data: productDataAtLocal[productIndex],
    };
    setTempProduct(null);
    try {
      const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
      alert(resProduct.data.success ? resProduct.data.message : "新增商品失敗");
      // if (resProduct.data.success) {
      //   await utils.getProductData(headers, setProductData, pagesRef);
      // }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  //上傳全部內建資料產品，先留著
  const handleAddAllProducts = async () => {
    modalStatus("上傳中", null, false);
    // const headers = utils.getHeadersFromCookie();
    const results = await utils.AddProductsSequentially(productDataAtLocal);
    // utils.getProductData(headers, setProductData, pagesRef);
    setTempProduct(null);
    if (results.length > 0) alert(results.join(","));
    appModalRef.current.close();
  };
  //刪除當頁全部產品，先留著
  const handleDeleteAllProducts = async () => {
    modalStatus("刪除中", null, false);
    if (productData.length > 0) {
      // const headers = utils.getHeadersFromCookie();
      const results = await utils.deleteProductsSequentially(productData);
      utils.getProductData(headers, setProductData, pagesRef);
      setTempProduct(null);
      if (results.length > 0) alert(results.join(","));
      appModalRef.current.close();
    }
  };
  // 登出，先留著
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
  //重新取得產品資料，先留著
  const handleGetProducts = async () => {
    modalStatus("載入中", null, false);
    setSelectedRowIndex("");
    try {
      // const headers = utils.getHeadersFromCookie();
      await utils.getProductData(headers, setProductData, pagesRef);
      utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
      setTempProduct(null);
    } catch (error) {
      alert("error:", error);
      console.log(error);
    }
    appModalRef.current.close();
  };
  //下一頁資料，先留著
  const getDownPageProducts = async () => {
    if (pagesRef.current.current_page >= pagesRef.current.total_pages) {
      alert(`已經是最後一頁`);
      return;
    }
    // const headers = utils.getHeadersFromCookie();
    utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "downPage", headers);
    try {
      const res = await apiService.axiosGetProductData2(
        `/api/${APIPath}/admin/products`,
        axiosConfigRef.current
      );
      const { current_page, total_pages, category } = res.data.pagination;
      setProductData(res.data.products);
      const config = { current_page, total_pages, category };
      utils.setPagesRef(pagesRef, config);
    } catch (error) {
      console.error(error);
    }
  };
  //第一頁資料，先留著
  const getUpPageProducts = async () => {
    if (pagesRef.current.current_page <= 1) {
      alert(`已經是第一頁`);
      return;
    }
    // const headers = utils.getHeadersFromCookie();
    utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "upPage", headers);
    try {
      const res = await apiService.axiosGetProductData2(
        `/api/${APIPath}/admin/products`,
        axiosConfigRef.current
      );
      const { current_page, total_pages, category } = res.data.pagination;
      setProductData(res.data.products);
      utils.setPagesRef(pagesRef, { current_page, total_pages, category });
    } catch (error) {
      console.error(error);
    }
  };
  //分辨上下頁，先留著
  const handleGetUpDownPageProducts = async (type) => {
    try {
      const implementApI =
        type === "up" ? getUpPageProducts : getDownPageProducts;
      await implementApI();
    } catch (error) {
      console.error(error);
    }
  };
  // const modalStatus = (imgAlt, modalImg, toggleFooter) => {
  //   appModalRef.current.setImgAlt(imgAlt);
  //   appModalRef.current.setModalImage(modalImg);
  //   appModalRef.current.toggleFooter(toggleFooter);
  //   setTimeout(() => {
  //     appModalRef.current.open(), 300;
  //   });
  // };
  //use forwardRef AppModal
  // useEffect(() => {
  //   if (appModalRef.current) {
  //     // appModalRef.current.close();
  //     console.log("useEffect appModalRef.current.close();");
  //   }
  // }, [productData]);

  //測試用Modal
  // useEffect(() => {
  //   if (detailLoading && Object.keys(tempProduct).length > 0) {
  //     const timeId = setTimeout(() => {
  //       appModalRef.current.close();
  //     }, 3000);
  //     return () => clearTimeout(timeId);
  //   }
  // }, [detailLoading]);
  // useEffect(() => {
  //   if (productDetailIdRef.current) {
  //     // console.log("productDetailIdRef=", productDetailIdRef.current);
  //     const temp = productData.find(
  //       (item) => item.id === productDetailIdRef.current
  //     );
  //     setTempProduct(temp);
  //     productDetailIdRef.current = null;
  //   }
  // }, [productDetailIdRef, productData]);

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
