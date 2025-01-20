import { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import axios from "axios";
import * as apiService from "../apiService/apiService";
import { Products,ProductDetailModal } from "../component";
import * as utils from "../utils/utils";
import { productDataAtLocal } from "../products";
import { tempProductDefaultValue } from "../defaultValue";
import { Modal } from "bootstrap";
const APIPath = import.meta.env.VITE_API_PATH;

const ProductLists = () => {
  const [productData, setProductData] = useState([]);
  const [editProduct, setEditProduct] = useState(tempProductDefaultValue);
  const [modalMode, setModalMode] = useState(null);
  const editModalDivRef = useRef(null);
  const deleteModalDivRef = useRef(null);
  const appModalRef = useRef(null);
  const modalStatus = (imgAlt, modalImg, toggleFooter) => {
    appModalRef.current.setImgAlt(imgAlt);
    appModalRef.current.setModalImage(modalImg);
    appModalRef.current.toggleFooter(toggleFooter);
    appModalRef.current.open(); 
  };
  
  const getProductDataNormal = async () => {
    try {
      const headers = utils.getHeadersFromCookie();
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

  const handleOpenEditModalWithValue = useCallback(
    (mode, productId = null) => {
      // console.log("handleEditModal,mode,productId=", mode, productId);
      if (mode === "create") {
        setEditProduct(tempProductDefaultValue);
        setModalMode(mode);
      } else if (productId && mode === "edit") {
        const { imagesUrl = [], ...rest } =
          productData.find((product) => product.id === productId) || {};
        const updatedProduct = {
          ...rest,
          imagesUrl: imagesUrl.filter(Boolean),
        };
        //imagesUrl.filter(Boolean) 是用來過濾掉 imagesUrl 數組中所有虛值的簡潔語法
        // （如 null、undefined、0、false、NaN 或空字符串）。
        setEditProduct(updatedProduct);
        setModalMode(mode);
      }
      openEditModal();
    },
    [productData]
  );
  const openEditModal = () => {
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.show();
  };
  const closeEditModal = () => {
    setModalMode(null);
    setEditProduct(tempProductDefaultValue);
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.hide();
  };
  
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
  const handleImgsUrlChange = useCallback(
    (e, index) => {
      // console.log(e.target);
      const { value } = e.target;
      const newImageUrl = [...editProduct.imagesUrl];
      newImageUrl[index] = value;
      setEditProduct((prev) => ({ ...prev, imagesUrl: newImageUrl }));
    },
    [editProduct]
  );
  const handleAddImage = () => {
    const newImageUrl = [...editProduct.imagesUrl];
    newImageUrl.push("");
    setEditProduct((prev) => ({ ...prev, imagesUrl: newImageUrl }));
  };
  const handleRemoveImage = () => {
    const newImageUrl = [...editProduct.imagesUrl];
    newImageUrl.pop();
    setEditProduct((prev) => ({ ...prev, imagesUrl: newImageUrl }));
  };
  const handleDeleteModal = useCallback(
    (productId) => {
      console.log('handleDeleteModal,productId=',productId);
      const updatedProduct =
        productData.find((product) => product.id === productId) || {};
      setEditProduct(updatedProduct);
      openDeleteModal();
    },
    [productData]
  );
  const implementEditProduct = async (type, editProduct) => {
    try {
      const headers = utils.getHeadersFromCookie();
      const wrapData = {
        data: {
          ...editProduct,
          is_enabled: editProduct.is_enabled ? 1 : 0,
          //price,original_price在取得輸入資料時handleEditDataChange已處理過
        },
      };
      let path = "";
      // const res = null;
      switch (type) {
      case "create":
        path = `/api/${APIPath}/admin/product`;
        await apiService.axiosPostAddProduct(path, wrapData, headers);
        break;
      case "edit":
        path = `/api/${APIPath}/admin/product/${editProduct.id}`;
        await apiService.axiosPutProduct(path, wrapData, headers);
        break;
      default:
        break;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
      // alert("上傳失敗");
    }
  };
  const handleUpdateProduct = async () => {
    if (!editProduct.id && modalMode === "edit") {
      alert("未取得product ID");
      return;
    }
    modalStatus("更新中", null, false);
    try {
      // const headers = utils.getHeadersFromCookie();
      const result = await implementEditProduct(modalMode, editProduct);
      if(result) {
        getProductDataNormal();
        setEditProduct(tempProductDefaultValue);
        alert(modalMode === "create" ? "新增完成" : "更新完成");
      } else{
        alert(modalMode === "create" ? "新增失敗:" : "更新失敗:");
      }
      // utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
      // const res = await apiService.axiosGetProductData2(
      //   `/api/${APIPath}/admin/products`,
      //   axiosConfigRef.current
      //  );
      // const { current_page, total_pages, category } = res.data.pagination;
      // setProductData(res.data.products);
      // utils.setPagesRef(pagesRef, { current_page, total_pages, category });
      // setEditProduct(tempProductDefaultValue);
    } catch (error) {
      alert(modalMode === "create" ? "新增失敗:" : "更新失敗:" + error);
    }
    appModalRef.current.close();
    closeEditModal();
  };
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
  const deleteProductInModal = async () => {
    if(editProduct?.id === null) return;
    // modalStatus("刪除中", null, false);
    try {
      const headers = utils.getHeadersFromCookie();
      await apiService.axiosDeleteProduct(
        `/api/${APIPath}/admin/product/${editProduct.id}`,
        headers
      );
      // utils.setAxiosConfigRef(axiosConfigRef, pagesRef, "current", headers);
      // const res = await apiService.axiosGetProductData2(
      //   `/api/${APIPath}/admin/products`,
      //   axiosConfigRef.current
      // );
      // const { current_page, total_pages, category } = res.data.pagination;
      // if (tempProduct.id === editProduct.id) {
      //   setTempProduct(null);
      // }
      // setProductData(res.data.products);暫時刪除
      setEditProduct(tempProductDefaultValue);
      setModalMode(null);
      getProductDataNormal();
      // utils.setPagesRef(pagesRef, { current_page, total_pages, category });
      alert("刪除產品完成");
    } catch (error) {
      console.error("刪除產品時發生錯誤：", error);
      alert("刪除產品時發生錯誤：", error);
    }
    appModalRef.current.close();
    closeDeleteModal();
  };
  const handleImgToMaster = (e,imgsIndex)=>{
    const temp = editProduct.imagesUrl.map((item,index)=>(
      index === imgsIndex
        ? editProduct.imageUrl : item
    ));
    const tt =  { ...editProduct,imagesUrl:temp,imageUrl:e.target.src };
    setEditProduct(tt);
  };
    //上傳內建資料隨機一項產品
  const handleAddProduct = async () => {
    const productIndex = parseInt(Date.now()) % productDataAtLocal.length;
    const wrapData = {
      data: productDataAtLocal[productIndex],
    };
    try {
      const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
      resProduct.data.success && getProductDataNormal();
      alert(resProduct.data.success ? resProduct.data.message : "新增商品失敗");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
    //上傳全部內建資料產品，先留著
  const handleAddAllProducts = async () => {
    // modalStatus("上傳中", null, false);
    const results = await utils.AddProductsSequentially(productDataAtLocal);
    results.data.success && getProductDataNormal();
    setEditProduct(tempProductDefaultValue);
    if (results.length > 0) alert(results.join(","));
  };
  useEffect(() => {
    getProductDataNormal();
  }, []);
  useEffect(()=>{
    if(editModalDivRef.current){
      new Modal(editModalDivRef.current,{ backdrop:false });
    }
    if(deleteModalDivRef.current){
      new Modal(deleteModalDivRef.current,{ backdrop:false });
    }
  },[]);
  useEffect(()=>{
  });
  return (
    <>
      {/* <div className="row mt-5 mb-3 mx-3"> */}
      <div className="row mb-3 mx-3">
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
          {/* <div className="row mb-1">
           <h1>
              本頁產品數:{productData.length}, {pagesRef.current.current_page}/
              {pagesRef.current.total_pages} 頁{" "}
            </h1> 
          </div>*/}
          <div className="row mt-1 mb-2 mx-1">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center mb-2">
                <h3>內層功能</h3>
                <button type='button' className="btn btn-warning mx-2" onClick={getProductDataNormal}>更新產品清單</button>
                <button type='button' className="btn btn-info mx-2" onClick={handleAddAllProducts}>上傳全部內建資料產品</button>
                <button type='button' className="btn btn-info mx-2" onClick={handleAddProduct}>上傳內建資料隨機一項產品</button>
              </div>  
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleOpenEditModalWithValue("create")}
              >
                建立新的產品
              </button>
            </div>  
            <div >
              {/* <p onClick={ShowNextPage}>第二頁</p> */}
              <h3>產品列表</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>index</th>
                    <th style={{ width: "20%" }}>產品名稱</th>
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
                        handleDeleteModal={handleDeleteModal}
                        handleOpenEditModalWithValue={
                          handleOpenEditModalWithValue
                        }
                        // onGetProduct={onGetProduct}
                        // onDeleteProduct={onDeleteProduct}
                        // isSelected={product.id === selectedRowIndex}
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
                <div className="col-md-12">
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
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-12 ">
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
                  </div>
                  <div style={{ width: '100%', height: '500px' }}>
                    <img
                      src={editProduct.imageUrl}
                      alt={editProduct.title}
                      className="img-fluid"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                {editProduct.imagesUrl.map((image, index) => (
                  <div key={index} className="col-md-6 mb-1">
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
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative',cursor:'pointer' }}>
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onClick={(e)=>handleImgToMaster(e,index)}
                        />
                      )}
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <div className="btn-group w-100">
                {editProduct.imagesUrl.length < 5 &&
                    editProduct.imagesUrl[editProduct.imagesUrl.length - 1] !== "" && (
                  <button
                    className="btn btn-outline-primary btn-sm w-50"
                    onClick={(e) => handleAddImage(e.target.value)}
                  >
                      新增圖片
                  </button>
                )}
                {editProduct.imagesUrl.length > 1 && (
                  <button
                    className="btn btn-outline-danger btn-sm w-50"
                    onClick={(e) => handleRemoveImage(e.target.value)}
                  >
                      取消最後尾圖片
                  </button>
                )}
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
      <ProductDetailModal
        ref={appModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "200px", height: "200px" }}
        modalImgSize={{ width: "200px", height: "120px" }}
      /> 
    </>
  );
};

export default ProductLists;
