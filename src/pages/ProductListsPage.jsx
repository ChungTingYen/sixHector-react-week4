 
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useLogin } from "../component/LoginContext";
import * as apiService from "../apiService/apiService";
import * as utils from "../utils/utils";
import { productDataAtLocal } from "../data/products";
import { tempProductDefaultValue } from "../data/defaultValue";
import {
  Products,
  Pagination,
  ProductDetailModal,
  ProductEditModal,
  ProductDeleteModal,
  AppFunction
} from "../component";
import { useDebounce } from "@uidotdev/usehooks";
const APIPath = import.meta.env.VITE_API_PATH;

const ProductLists = () => {
  const { setIsLogin } = useLogin();
  const [productData, setProductData] = useState([]);
  const [editProduct, setEditProduct] = useState(tempProductDefaultValue);
  const [modalMode, setModalMode] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  //自已測試
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceAscending, setPriceAscending] = useState(false);
  //
  const ProductDetailModalRef = useRef(null);

  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(category, 1000);
  const handleSearchCategory = (e) => {
    setCategory(e.target.value);
  };
  const getCategoryProducts = async (query) => {
    utils.modalStatus(ProductDetailModalRef,"ProductListPage Desbounce 進行中", null, false);
    console.log("debounce");
    try {
      const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosGetProductDataByConfig(
        `/api/${APIPath}/admin/products`,
        {
          params: {
            category: query,
          },
          headers: headers,
        }
      );
      setProductData(resProduct.data.products);
    } catch (error) {
      console.log("error:", error);
    }
    ProductDetailModalRef.current.close();
  };
  useEffect(() => {
    debouncedSearchTerm
      ? getCategoryProducts(debouncedSearchTerm)
      : handleGetProducts();
    console.log("debouncedSearchTerm=", debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const filterData = useMemo(() => {
    return (
      [...productData]
        .filter((item) => item.title.match(search))
        // .sort((a, b) => a.title.localeCompare(b.title))
        .sort((a, b) => priceAscending && a.price - b.price)
    );
  }, [productData, search, priceAscending]);

  const handleGetProducts = async () => {
    utils.modalStatus(ProductDetailModalRef,"ProductListPage 載入中", null, false);
    await getProductData();
    ProductDetailModalRef.current.close();
  };
  const getProductData = useCallback(async (page = 1) => {
    try {
      const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosGetProductDataByConfig(
        `/api/${APIPath}/admin/products`,
        {
          params: {
            page: page,
            category: pageInfo.category,
          },
          headers: headers,
        }
      );
      setProductData(resProduct.data.products);
      setPageInfo(resProduct.data.pagination);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    } 
  },[setProductData,pageInfo,setPageInfo]);
  const handleDeleteModal = useCallback(
    (productId) => {
      const updatedProduct =
        productData.find((product) => product.id === productId) || {};
      setEditProduct(updatedProduct);
      setIsProductDeleteModalOpen(true);
    },
    [productData]
  );
  const handleOpenEditModalWithValue = useCallback(
    (mode, productId = null) => {
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
      setIsProductEditModalOpen(true);
    },
    [productData]
  );
  //上傳內建資料隨機一項產品
  const handleAddProduct = async () => {
    utils.modalStatus(ProductDetailModalRef,"ProductListPage 建立中", null, false);
    const productIndex = parseInt(Date.now()) % productDataAtLocal.length;
    const temp = { ...productDataAtLocal[productIndex],buyerNumber:100 };
    const wrapData = {
      // data: productDataAtLocal[productIndex],
      data:temp
    };
    try {
      const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
      resProduct.data.success && getProductData();
      alert(resProduct.data.success ? resProduct.data.message : "新增商品失敗");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    } finally{
      ProductDetailModalRef.current.close();
    }
    
  };
  //上傳全部內建資料產品
  const handleAddAllProducts = async () => {
    utils.modalStatus(ProductDetailModalRef,"ProductListPage 上傳中", null, false);
    const results = await utils.AddProductsSequentially(productDataAtLocal);
    setEditProduct(tempProductDefaultValue);
    !results.length ? alert('上傳成功') : alert(results.join(","));
    !results.length && getProductData();
    ProductDetailModalRef.current.close();
  };
  //刪除第一頁全部產品
  const handleDeleteAllProducts = async () => {
    utils.modalStatus(ProductDetailModalRef,"ProductListPage 刪除中", null, false);
    if (productData.length > 0) {
      const results = await utils.deleteProductsSequentially(productData);
      setEditProduct(tempProductDefaultValue);
      !results.length ? alert('刪除成功') : alert(results.join(","));
      getProductData();
    }
    ProductDetailModalRef.current.close();
  };

  useEffect(() => {
    getProductData();

  }, []);

  return (
    <>
      <AppFunction setIsLogin={setIsLogin} />
      <div className="row mt-1 mb-2 mx-1">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center mb-2">
            <h3>產品功能</h3>
            <button
              type="button"
              className="btn btn-warning mx-1"
              onClick={handleGetProducts}
            >
              更新產品清單
            </button>
            <button
              type="button"
              className="btn btn-info mx-1"
              onClick={handleAddAllProducts}
            >
              上傳全部內建資料產品
            </button>
            <button
              type="button"
              className="btn btn-info mx-1"
              onClick={handleAddProduct}
            >
              上傳內建資料隨機一項產品
            </button>
            <button
              type="button"
              className="btn btn-danger mx-1"
              onClick={handleDeleteAllProducts}
            >
              刪除第一頁全部產品
            </button>
          </div>
          <div className="d-flex align-items-center mb-2">
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={() => handleOpenEditModalWithValue("create")}
            >
              建立新的產品
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center mt-2">
          <div className="">
            搜尋此頁商品名稱:
            <input
              type="search"
              style={{ width: "100px" }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
            />
            <button
              type="button"
              className="btn btn-secondary mx-1"
              onClick={() => setSearch("")}
            >
              清除
            </button>
          </div>
          <div className="me-2 mx-1">
            價格排序:
            <input
              type="checkbox"
              checked={priceAscending}
              onChange={(e) => setPriceAscending(e.target.checked)}
              className="mx-1 form-check-input"
            />
          </div>
          <div className="me-2 mx-1 ms-5">
            測試Desbounce for category:
            <input
              type="search"
              style={{ width: "200px" }}
              className="mx-1"
              onChange={handleSearchCategory}
              value={category}
            />
            <button
              type="button"
              className="btn btn-secondary mx-1"
              onClick={(e) => handleSearchCategory(e)}
            >
              清除
            </button>
          </div>
        </div>
      </div>
      {productData.length > 0 ? (
        <>
          <div className="row mt-1 mb-2 mx-1">
            <div>
              <h3>產品列表</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>index</th>
                    <th style={{ width: "20%" }}>產品名稱</th>
                    <th>類別</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th style={{ width: "10%" }}>啟用</th>
                    {/* <th style={{ width: "10%" }}>細節</th>
                    <th style={{ width: "10%" }}>刪除</th> */}
                    <th style={{ width: "20%" }}>功能</th>
                    <th>假的購買人數</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData.map((product, index) => {
                    // {productData.map((product, index) => {
                    return (
                      <Products
                        key={product.id}
                        {...product}
                        index={index}
                        handleDeleteModal={handleDeleteModal}
                        handleOpenEditModalWithValue={
                          handleOpenEditModalWithValue
                        }
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination getProductData={getProductData} pageInfo={pageInfo} />
        </>
      ) : (
        <h1>沒有商品或商品載入中</h1>
      )}
      <ProductEditModal
        editProduct={editProduct}
        setModalMode={setModalMode}
        modalMode={modalMode}
        getProductData={getProductData}
        isProductEditModalOpen={isProductEditModalOpen}
        setIsProductEditModalOpen={setIsProductEditModalOpen}
      />

      <ProductDeleteModal 
        setModalMode={setModalMode}
        modalMode={modalMode}
        getProductData={getProductData}
        isProductDeleteModalOpen={isProductDeleteModalOpen}
        setIsProductDeleteModalOpen={setIsProductDeleteModalOpen}
        editProduct={editProduct}
      />

      <ProductDetailModal
        ref={ProductDetailModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "300px", height: "200px" }}
        modalImgSize={{ width: "300px", height: "120px" }}
      />
    </>
  );
};

export default ProductLists;
