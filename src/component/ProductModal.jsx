/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import * as apiService from "../apiService/apiService";
import * as utils from "../utils/utils";
import { tempProductDefaultValue } from "../data/defaultValue";

const APIPath = import.meta.env.VITE_API_PATH;

const ProductModal = (props) => {
  const {
    setEditProduct,
    editProduct,
    setModalMode,
    modalMode,
    modalStatus,
    getProductData,
    isProductModalOpen,
    setIsProductModalOpen,
    // uploadRef,
  } = props;
  //   const [editProduct, seteditProduct] = useState(editProduct);
  const appModalRef = useRef(null);
  const editModalDivRef = useRef(null);
  const uploadRef = useRef(null);
  useEffect(() => {
    if (editModalDivRef.current) {
      new Modal(editModalDivRef.current, { backdrop: false });
    }
    // if (deleteModalDivRef.current) {
    //   new Modal(deleteModalDivRef.current, { backdrop: false });
    // }
  });
  useEffect(() => {
    if (isProductModalOpen) openEditModal();
    console.log("editProduct=", editProduct);
  });
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
  const handleImgToMaster = (e, imgsIndex) => {
    const temp = editProduct.imagesUrl.map((item, index) =>
      index === imgsIndex ? editProduct.imageUrl : item
    );
    const tt = { ...editProduct, imagesUrl: temp, imageUrl: e.target.src };
    setEditProduct(tt);
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
  const closeEditModal = () => {
    setModalMode(null);
    setEditProduct(tempProductDefaultValue);
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.hide();
  };
  const openEditModal = () => {
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.show();
  };
  const handleImgUpload = async (e) => {
    modalStatus("上傳中", null, false);
    try {
      const headers = utils.getHeadersFromCookie();
      const formData = new FormData();
      formData.append("file-to-upload", e.target.files[0]);
      const result = await apiService.axiosPostImg(
        `/api/${APIPath}/admin/upload`,
        formData,
        headers
      );
      result?.data?.success &&
        setEditProduct({ ...editProduct, imageUrl: result.data.imageUrl });
    } catch (error) {
      alert("上傳主圖錯誤:" + error);
      console.log(error);
    }
    appModalRef.current.close();
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
      const result = await implementEditProduct(modalMode, editProduct);
      if (result) {
        getProductData();
        setEditProduct(tempProductDefaultValue);
        alert(modalMode === "create" ? "新增完成" : "更新完成");
      } else {
        alert(modalMode === "create" ? "新增失敗:" : "更新失敗:");
      }
    } catch (error) {
      alert(modalMode === "create" ? "新增失敗:" : "更新失敗:" + error);
    }
    appModalRef.current.close();
    closeEditModal();
  };
  return (
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
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label">
                    {" "}
                    主圖上傳{" "}
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleImgUpload}
                    ref={uploadRef}
                  />
                </div>
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
                <div style={{ width: "100%", height: "500px" }}>
                  <img
                    src={editProduct.imageUrl}
                    alt={editProduct.title}
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {image && (
                      <img
                        src={image}
                        alt={`副圖 ${index + 1}`}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onClick={(e) => handleImgToMaster(e, index)}
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
                editProduct.imagesUrl[editProduct.imagesUrl.length - 1] !==
                  "" && (
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
  );
};

export default ProductModal;
