import { adminInstance } from "./apiconfig";

export const  axiosGetProductData = async(path)=>{
  const response = await adminInstance.get(path);
  return response;
};

export const  axiosGetProductDataByConfig = async(path,config)=>{
  const response = await adminInstance.get(path,  config ) || {};
  return response;
};

export const axiosPostSignin = async(path,account) =>{
  const response = await adminInstance.post(path, account);
  return response;
};

export const axiosPostCheckSingin = async(path) =>{
  const response = await adminInstance.post(path,{},);
  return response;
};

export const axiosPostLogout = async(path) =>{
  const response = await adminInstance.post(path,{});
  return response;
};
export const axiosPostAddProduct = async(path,productData) =>{
  const response = await adminInstance.post(path,productData);
  return response;
};

export const axiosDeleteProduct = async(path) =>{
  const response = await adminInstance.delete(path);
  return response;
};

export const axiosPutProduct = async(path,putData)=>{
  const response = await adminInstance.put(path,putData);
  return response;
};

export const axiosPostImg = async(path,putData,)=>{
  const response = await adminInstance.post(path,putData);
  return response;
};
