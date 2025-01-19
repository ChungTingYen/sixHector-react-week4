/* eslint-disable indent */
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import * as apiService from "./apiService/apiService";
import {
  Products,
  ProductLists,
  ProductDetail,
  ProductDetailModal,
  Login,
} from "./component";
// import { productDataAtLocal } from "./productDataAtLocal";
import { productDataAtLocal } from "./products";
import { tempProductDefaultValue } from "./defaultValue";
import * as utils from "./utils/utils";
import { Modal } from "bootstrap";
function App() {
  // const [productData, setProductData] = useState([]);
  const [headers, setHeaders] = useState(null);
  //先給初始值，以免出現controll 跟 uncontroll的狀況
  const [tempProduct, setTempProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(tempProductDefaultValue);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const APIPath = import.meta.env.VITE_API_PATH;
  const [isLogin, setIsLogin] = useState(false);
  const productDetailIdRef = useRef(null);
  //測試功能 start
  const AppModalRef = useRef(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [priceAscending, setPriceAscending] = useState(false);
  const axiosConfigRef = useRef({
    params: { page: 0, category: "" },
    headers: { Authorization: "" },
  });
  const pagesRef = useRef({
    current_page: 0,
    total_pages: 0,
    category: "",
  });
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
  useEffect(() => {
    // console.log("headers:", headers);
    // console.log("productData=", productData);
  });
  //登入
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await apiService.axiosPostSignin("/admin/signin", account);
  //     alert(res.data.message);
  //     if (res.data.success) {
  //       const { token, expired } = res.data;
  //       document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
  //       //執行axios.defaults.headers.common.Authorization
  //       axios.defaults.headers.common.Authorization = token;
  //       const nowHeaders = {
  //         Authorization: token,
  //       };
  //       setIsLogin(true);
  //       setHeaders(nowHeaders);
  //       utils.getProductData(nowHeaders, setProductData, pagesRef);
  //     }
  //   } catch (error) {
  //     alert("error:", error);
  //     console.log(error);
  //   }
  // };
  //檢查登入狀態
  const handleCheckLogin = async () => {
    try {
      // const headers = utils.getHeadersFromCookie();
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
  const handleCheckLogin2 = async () => {
    if (headers === null) return;
    try {
      // const headers = utils.getHeadersFromCookie();
      await apiService.axiosPostCheckSingin("/api/user/check", headers);
      setIsLogin(true);
      utils.getProductData(headers, setProductData, pagesRef);
      // alert(res.data.success ? "已登入成功" : "請重新登入");
    } catch (error) {
      alert("error:", error?.response.data.message || error);
      console.log(error);
    }
  };
  //上傳內建資料隨機一項產品
  const handleAddProduct = async () => {
    const productIndex = parseInt(Date.now()) % productDataAtLocal.length;
    const wrapData = {
      data: productDataAtLocal[productIndex],
    };
    setTempProduct(null);
    try {
      // const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
      alert(resProduct.data.success ? resProduct.data.message : "新增商品失敗");
      if (resProduct.data.success) {
        await utils.getProductData(headers, setProductData, pagesRef);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  //上傳全部內建資料產品
  const handleAddAllProducts = async () => {
    modalStatus("上傳中", null, false);
    // const headers = utils.getHeadersFromCookie();
    const results = await utils.AddProductsSequentially(productDataAtLocal);
    utils.getProductData(headers, setProductData, pagesRef);
    setTempProduct(null);
    if (results.length > 0) alert(results.join(","));
    AppModalRef.current.close();
  };
  //刪除當頁全部產品
  const handleDeleteAllProducts = async () => {
    modalStatus("刪除中", null, false);
    if (productData.length > 0) {
      // const headers = utils.getHeadersFromCookie();
      const results = await utils.deleteProductsSequentially(productData);
      utils.getProductData(headers, setProductData, pagesRef);
      setTempProduct(null);
      if (results.length > 0) alert(results.join(","));
      AppModalRef.current.close();
    }
  };
  // 登出
  const handleLogout = async () => {
    try {
      // const headers = utils.getHeadersFromCookie();
      const res = await apiService.axiosPostLogout("/logout", headers);
      alert(res.data.success ? res.data.message : "登出失敗");
      if (res.data.success) {
        setIsLogin(false);
        setProductData([]);
        setTempProduct(null);
        setSelectedRowIndex(null);
        setHeaders(null);
      }
    } catch (error) {
      alert("error:" + error.response.data.message);
      console.log(error);
    }
  };
  //重新取得產品資料
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
    AppModalRef.current.close();
  };
  //下一頁資料
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
  const handleGetUpDownPageProducts = async (type) => {
    try {
      const implementApI =
        type === "up" ? getUpPageProducts : getDownPageProducts;
      await implementApI();
    } catch (error) {
      console.error(error);
    }
  };
  // const onGetProduct = useCallback(
  //   (productId) => {
  //     // console.log("onGetProduct");
  //     productDetailIdRef.current = productId;
  //     if (tempProduct?.id === productId) {
  //       // 當前選擇的產品與上一次相同，不進行任何操作
  //       console.log("產品ID相同，不重複打開模態框");
  //       return;
  //     }
  //     const filterProduct =
  //       productData.filter((product) => product.id === productId)[0] || [];
  //     setTempProduct(filterProduct);
  //     setSelectedRowIndex(filterProduct.id);
  //     //測試用Modal，點擊會出現Modal顯示載入中
  //     // AppModalRef.current.open();
  //     // AppModalRef.current.setModalImage(null);
  //     // setDetailLoading(productId);
  //     // AppModalRef.current.toggleFooter(false);
  //     //這個方法也可以
  //     // AppModalRef.current.modalDivRef.current.querySelector(".modal-footer").style.display = 'none';
  //   },
  //   [tempProduct, productData]
  // );
  // const onDeleteProduct = useCallback(
  //   async (productId) => {
  //     modalStatus("刪除中", null, false);
  //     // const headers = utils.getHeadersFromCookie();
  //     try {
  //       await apiService.axiosDeleteProduct(
  //         `/api/${APIPath}/admin/product/${productId}`,
  //         headers
  //       );
  //       utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
  //       const res = await apiService.axiosGetProductData2(
  //         `/api/${APIPath}/admin/products`,
  //         axiosConfigRef.current
  //       );
  //       const { current_page, total_pages, category } = res.data.pagination;
  //       setProductData(res.data.products);
  //       utils.setPagesRef(pagesRef, { current_page, total_pages, category });
  //       if (tempProduct?.id === productId) {
  //         setTempProduct(null);
  //       }
  //     } catch (error) {
  //       console.error("刪除產品時發生錯誤：", error);
  //       alert("刪除產品時發生錯誤：", error);
  //     }
  //     AppModalRef.current.close();
  //   },
  //   [tempProduct]
  // );
  const modalStatus = (imgAlt, modalImg, toggleFooter) => {
    AppModalRef.current.setImgAlt(imgAlt);
    AppModalRef.current.setModalImage(modalImg);
    AppModalRef.current.toggleFooter(toggleFooter);
    setTimeout(() => {
      AppModalRef.current.open(), 300;
    });
  };
  useEffect(() => {
    handleCheckLogin2();
  }, []);
  //use forwardRef AppModal
  // useEffect(() => {
  //   if (AppModalRef.current) {
  //     // AppModalRef.current.close();
  //     console.log("useEffect AppModalRef.current.close();");
  //   }
  // }, [productData]);

  //測試用Modal
  // useEffect(() => {
  //   if (detailLoading && Object.keys(tempProduct).length > 0) {
  //     const timeId = setTimeout(() => {
  //       AppModalRef.current.close();
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

  //------------------------------第三周-----------------------------
  const editModalDivRef = useRef(null);
  const deleteModalDivRef = useRef(null);
  useEffect(() => {
    if (editModalDivRef.current) {
      new Modal(editModalDivRef.current, { backdrop: false });
    }
    if (deleteModalDivRef.current) {
      new Modal(deleteModalDivRef.current, { backdrop: false });
    }
  }, []);
  const [modalMode, setModalMode] = useState(null);
  const handleEditDataChange = (e) => {
    const { name, type, value, checked } = e.target;
    let tempValue;
    if (type === "number") tempValue = Number(value);
    else if (type === "checkbox") tempValue = checked;
    else tempValue = value;
    const temp = {
      ...editProduct,
      [name]: tempValue,
    };
    setEditProduct(temp);
  };
  // const handleOpenEditModalWithValue = useCallback(
  //   (mode, productId = null) => {
  //     // console.log("handleEditModal,mode,productId=", mode, productId);
  //     if (mode === "create") {
  //       setEditProduct(tempProductDefaultValue);
  //       setModalMode(mode);
  //     } else if (productId && mode === "edit") {
  //       const { imagesUrl = [], ...rest } =
  //         productData.find((product) => product.id === productId) || {};
  //       const updatedProduct = {
  //         ...rest,
  //         imagesUrl: imagesUrl.filter(Boolean),
  //       };
  //       //imagesUrl.filter(Boolean) 是用來過濾掉 imagesUrl 數組中所有虛值的簡潔語法
  //       // （如 null、undefined、0、false、NaN 或空字符串）。
  //       setEditProduct(updatedProduct);
  //       setModalMode(mode);
  //     }
  //     openEditModal();
  //   },
  //   [productData]
  // );
  const openEditModal = () => {
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.show();
  };
  const closeEditModal = () => {
    setModalMode(null);
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.hide();
  };
  const implementEditProduct = async (type, editProduct) => {
    try {
      // const headers = utils.getHeadersFromCookie();
      const wrapData = {
        data: {
          ...editProduct,
          is_enabled: editProduct.is_enabled ? 1 : 0,
          //price,original_price在取得輸入資料時handleEditDataChange已處理過
        },
      };
      let path = "";
      let res = null;
      switch (type) {
        case "create":
          path = `/api/${APIPath}/admin/product`;
          res = await apiService.axiosPostAddProduct(path, wrapData, headers);
          break;
        case "edit":
          path = `/api/${APIPath}/admin/product/${editProduct.id}`;
          res = await apiService.axiosPutProduct(path, wrapData, headers);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      alert("上傳失敗");
    }
  };

  const handleUpdateProduct = async () => {
    modalStatus(modalMode === "create" ? "新增中" : "更新中", null, false);
    if (!editProduct.id && modalMode === "edit") {
      alert("未取得product ID");
      AppModalRef.current.close();
      return;
    }
    try {
      // const headers = utils.getHeadersFromCookie();
      await implementEditProduct(modalMode, editProduct);
      utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
      const res = await apiService.axiosGetProductData2(
        `/api/${APIPath}/admin/products`,
        axiosConfigRef.current
      );
      const { current_page, total_pages, category } = res.data.pagination;
      setProductData(res.data.products);
      utils.setPagesRef(pagesRef, { current_page, total_pages, category });
      setEditProduct(tempProductDefaultValue);
      alert(modalMode === "create" ? "新增完成" : "更新完成");
    } catch (error) {
      alert(modalMode === "create" ? "新增失敗:" : "更新失敗:" + error);
    }
    AppModalRef.current.close();
    closeEditModal();
  };
  const handleRemoveImage = () => {
    const newImageUrl = [...editProduct.imagesUrl];
    newImageUrl.pop();
    setEditProduct((prev) => ({ ...prev, imagesUrl: newImageUrl }));
  };
  const handleAddImage = () => {
    const newImageUrl = [...editProduct.imagesUrl];
    newImageUrl.push("");
    setEditProduct((prev) => ({ ...prev, imagesUrl: newImageUrl }));
  };
  const handleImgsUrlChange = useCallback(
    (e, index) => {
      console.log(e.target);
      const { value } = e.target;
      const newImageUrl = [...editProduct.imagesUrl];
      newImageUrl[index] = value;
      setEditProduct((prev) => ({ ...prev, imagesUrl: newImageUrl }));
    },
    [editProduct]
  );
  const openDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.show();
  };
  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.hide();
    setEditProduct(tempProductDefaultValue);
    setModalMode(null);
  };
  // const handleDeleteModal = useCallback(
  //   (productId) => {
  //     const updatedProduct =
  //       productData.find((product) => product.id === productId) || {};
  //     setEditProduct(updatedProduct);
  //     openDeleteModal();
  //   },
  //   [productData]
  // );
  const deleteProductInModal = async () => {
    modalStatus("刪除中", null, false);
    // const headers = utils.getHeadersFromCookie();
    try {
      await apiService.axiosDeleteProduct(
        `/api/${APIPath}/admin/product/${editProduct.id}`,
        headers
      );
      utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
      const res = await apiService.axiosGetProductData2(
        `/api/${APIPath}/admin/products`,
        axiosConfigRef.current
      );
      const { current_page, total_pages, category } = res.data.pagination;
      if (tempProduct.id === editProduct.id) {
        setTempProduct(null);
      }
      // setProductData(res.data.products);暫時刪除
      setEditProduct(tempProductDefaultValue);
      setModalMode(null);
      utils.setPagesRef(pagesRef, { current_page, total_pages, category });
      alert("刪除產品完成");
    } catch (error) {
      console.error("刪除產品時發生錯誤：", error);
      alert("刪除產品時發生錯誤：", error);
    }
    closeDeleteModal();
    AppModalRef.current.close();
  };
  return (
    <>
      {/* <pre>{JSON.stringify(productData, null, 2)}</pre> */}
      {isLogin ? (
        <>
          <ProductLists
          // productData={productData}
          // handleOpenEditModalWithValue={handleOpenEditModalWithValue}
          ></ProductLists>
        </>
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}

      {/* detail Modal */}
      {/* <ProductDetailModal
        ref={AppModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "200px", height: "200px" }}
        modalImgSize={{ width: "200px", height: "120px" }}
      /> */}
      {/* edit Modal */}

      <div
        id="productModal"
        className="modal fade"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        ref={editModalDivRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">{editProduct.title}</h5>
              {/* X 按鈕 */}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeEditModal}
                // data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={editProduct.imageUrl}
                        onChange={handleEditDataChange}
                      />
                      {/* <Input 
                        handleEditDataChange={handleEditDataChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={editProduct.imageUrl} /> */}
                    </div>
                    <img
                      src={editProduct.imageUrl}
                      alt={editProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {editProduct.imagesUrl.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                          value={image}
                          onChange={(e) => handleImgsUrlChange(e, index)}
                          name={`imagesUrl-${index + 1}`}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                        <hr />
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {editProduct.imagesUrl.length < 5 &&
                        editProduct.imagesUrl[
                          editProduct.imagesUrl.length - 1
                        ] != "" && (
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={(e) => handleAddImage(e.target.value)}
                          >
                            新增圖片
                          </button>
                        )}
                      {editProduct.imagesUrl.length > 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={(e) => handleRemoveImage(e.target.value)}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={editProduct.title}
                      onChange={handleEditDataChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={editProduct.category}
                      onChange={handleEditDataChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={editProduct.unit}
                      onChange={handleEditDataChange}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        min={0}
                        value={editProduct.origin_price}
                        onChange={handleEditDataChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        min={0}
                        value={editProduct.price}
                        onChange={handleEditDataChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      value={editProduct.description}
                      onChange={handleEditDataChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      value={editProduct.content}
                      onChange={handleEditDataChange}
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      checked={editProduct.is_enabled}
                      onChange={handleEditDataChange}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                aria-label="Close"
                onClick={closeEditModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* delete Modal */}
      <div
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ref={deleteModalDivRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{editProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteProductInModal}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
