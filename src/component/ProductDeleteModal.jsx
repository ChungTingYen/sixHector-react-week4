/* eslint-disable react/prop-types */
import { useEffect, useRef,memo  } from "react";
import { Modal } from "bootstrap";
import * as apiService from "../apiService/apiService";
import * as utils from "../utils/utils";
import { ProductDetailModal } from '.';
const APIPath = import.meta.env.VITE_API_PATH;
const ProductDeleteModal = (props)=>{
  const {
    editProduct,
    setModalMode,
    isProductDeleteModalOpen,
    setIsProductDeleteModalOpen,
    getProductData
  } = props;
  const deleteModalDivRef = useRef(null);
  const ProductDetailModalRef = useRef(null);
  useEffect(() => {
    if (deleteModalDivRef.current) {
      new Modal(deleteModalDivRef.current, { backdrop: false });
    }
  },[]);
  useEffect(() => {
    if (isProductDeleteModalOpen) openDeleteModal();
  },[isProductDeleteModalOpen]);

  const openDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.show();
  };
  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.hide();
    setModalMode(null);
    setIsProductDeleteModalOpen(false);
  };
  const deleteProductInModal = async () => {
    if (editProduct?.id === null) return;
    utils.modalStatus(ProductDetailModalRef,"ProductListPage 進行中", null, false);
    try {
      const headers = utils.getHeadersFromCookie();
      await apiService.axiosDeleteProduct(
        `/api/${APIPath}/admin/product/${editProduct.id}`,
        headers
      );
      //   setEditProduct(tempProductDefaultValue);
      setModalMode(null);
      getProductData();
      alert("刪除產品完成");
    } catch (error) {
      console.error("刪除產品時發生錯誤：", error);
      alert("刪除產品時發生錯誤：", error);
    } finally{
      ProductDetailModalRef.current.close();
      closeDeleteModal();
    }
  };
  return (
    <>
      <ProductDetailModal
        ref={ProductDetailModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "300px", height: "200px" }}
        modalImgSize={{ width: "300px", height: "120px" }}
      />
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
};

export default memo(ProductDeleteModal);