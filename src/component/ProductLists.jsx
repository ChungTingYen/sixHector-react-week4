import { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import axios from "axios";
import * as apiService from "../apiService/apiService";
import { Products } from "../component";
import * as utils from "../utils/utils";
// import { productDataAtLocal } from "../productDataAtLocal";
// import { tempProductDefaultValue } from "../defaultValue";
// import { Modal } from "bootstrap";
const APIPath = import.meta.env.VITE_API_PATH;
const ProductLists = (props) => {
  const [productData, setProductData] = useState([]);
  //   const { handleOpenEditModalWithValue } = props;
  const getProductDataNormal = async () => {
    try {
      const headers = utils.getHeadersFromCookie();
      // axios.defaults.headers.common.Authorization = token;
      const resProduct =
        (await apiService.axiosGetProductData(
          `/api/${APIPath}/admin/products`,
          headers
        )) || [];
      setProductData(resProduct.data.products);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  const onGetProduct = useCallback(
    (productId) => {
      //   productDetailIdRef.current = productId;
      //   if (tempProduct?.id === productId) {
      //     // 當前選擇的產品與上一次相同，不進行任何操作
      //     console.log("產品ID相同，不重複打開模態框");
      //     return;
      //   }
      //   const filterProduct =
      //     productData.filter((product) => product.id === productId)[0] || [];
      //   setTempProduct(filterProduct);
      //   setSelectedRowIndex(filterProduct.id);
      //測試用Modal，點擊會出現Modal顯示載入中
      // AppModalRef.current.open();
      // AppModalRef.current.setModalImage(null);
      // setDetailLoading(productId);
      // AppModalRef.current.toggleFooter(false);
      //這個方法也可以
      // AppModalRef.current.modalDivRef.current.querySelector(".modal-footer").style.display = 'none';
    },
    []
    // [tempProduct, productData]
  );
  const onDeleteProduct = useCallback(
    async (productId) => {
      //   modalStatus("刪除中", null, false);
      // const headers = utils.getHeadersFromCookie();
      //   try {
      //     await apiService.axiosDeleteProduct(
      //       `/api/${APIPath}/admin/product/${productId}`,
      //       headers
      //     );
      //     utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
      //     const res = await apiService.axiosGetProductData2(
      //       `/api/${APIPath}/admin/products`,
      //       axiosConfigRef.current
      //     );
      //     const { current_page, total_pages, category } = res.data.pagination;
      //     setProductData(res.data.products);
      //     utils.setPagesRef(pagesRef, { current_page, total_pages, category });
      //     if (tempProduct?.id === productId) {
      //       setTempProduct(null);
      //     }
      //   } catch (error) {
      //     console.error("刪除產品時發生錯誤：", error);
      //     alert("刪除產品時發生錯誤：", error);
      //   }
      //   AppModalRef.current.close();
    },
    []
    // [tempProduct]
  );
  useEffect(() => {
    // console.log("list");
    getProductDataNormal();
  }, []);
  return (
    <>
      {/* <div className="row mt-5 mb-3 mx-3"> */}
      <div className="row mt-5 mb-3 mx-3">
        <div className="d-flex justify-content-between mb-3 ">
          <p className="text-secondary">Logging</p>
          <button
            type="button"
            className="btn btn-primary"
            // onClick={() => handleOpenEditModalWithValue("create")}
          >
            建立新的產品
          </button>
        </div>
        <div className="d-flex">
          {/* <button
            type="button"
            className="btn btn-warning me-2"
            onClick={handleCheckLogin}
          >
            檢查登入狀態
          </button> */}
          {/* <button
            type="button"
            className="btn btn-success me-2"
            onClick={handleAddProduct}
          >
            上傳內建資料隨機一項產品
          </button> */}
          {/* <button
            type="button"
            className="btn btn-success me-2"
            onClick={handleAddAllProducts}
          >
            上傳全部內建資料產品
          </button> */}
          {/* <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={handleGetProducts}
          >
            重新取得產品資料
          </button> */}
          {/* <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleGetUpDownPageProducts("up")}
          >
            上一頁
          </button> */}
          {/* <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => handleGetUpDownPageProducts("down")}
          >
            下一頁
          </button> */}
          {/* <button
            type="button"
            className="btn btn-danger me-2"
            onClick={handleDeleteAllProducts}
          >
            刪除本頁全部產品
          </button> */}
          {/* <button
            type="button"
            className="btn btn-warning me-2"
            onClick={handleLogout}
          >
            登出
          </button> */}
        </div>
        {/* <div className="d-flex align-items-center mt-3">
          <div className="me-3">
            搜尋名稱:
            <input
              type="search"
              style={{ width: "100px" }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="me-3">
            價格排序:
            <input
              type="checkbox"
              checked={priceAscending}
              onChange={(e) => setPriceAscending(e.target.checked)}
            />
            {priceAscending.toString()}
          </div>
        </div> */}
      </div>
      {productData.length > 0 ? (
        <>
          <div className="row mt-1 mb-1 mx-1">
            {/* <h1>
              本頁產品數:{productData.length}, {pagesRef.current.current_page}/
              {pagesRef.current.total_pages} 頁{" "}
            </h1> */}
          </div>
          <div className="row mt-1 mb-1 mx-1">
            <div className="">
              <h3>產品列表</h3>
              {/* <p onClick={ShowNextPage}>第二頁</p> */}
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>index</th>
                    <th style={{ width: "15%" }}>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th style={{ width: "10%" }}>啟用</th>
                    {/* <th style={{ width: "10%" }}>細節</th>
                    <th style={{ width: "10%" }}>刪除</th> */}
                    <th style={{ width: "20%" }}>功能</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {filterData.map((product, index) => { */}
                  {productData.map((product, index) => {
                    return (
                      <Products
                        key={product.id}
                        {...product}
                        index={index}
                        onGetProduct={onGetProduct}
                        onDeleteProduct={onDeleteProduct}
                        // handleDeleteModal={handleDeleteModal}
                        // isSelected={product.id === selectedRowIndex}
                        // handleOpenEditModalWithValue={
                        //   handleOpenEditModalWithValue
                        // }
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <h1>沒有商品或商品載入中</h1>
      )}
    </>
  );
};

export default ProductLists;
