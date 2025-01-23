/* eslint-disable react/prop-types */
import React, { useRef, useEffect, } from 'react';
import { Toast } from 'bootstrap';

const ToastComponent = ({ toastText, type = 'success',isShowToast,setIsShowToast }) => {
  const toastDivRef = useRef();

  useEffect(() => {
    if (toastDivRef.current) {
      new Toast (toastDivRef.current,{
        autohide: true,
        delay: 2000 // x秒後自動關閉
      });
    }
  },[]);
  useEffect(()=>{
    if(isShowToast){
      showToast();
      setIsShowToast(false);
    }
    console.log('isShowToast:',isShowToast);
  },[isShowToast]);

  const showToast = () => {
    const toastInstance = Toast.getInstance(toastDivRef.current);
    toastInstance.show();
    setIsShowToast(false);
  };
  const closeToast = () => {
    const toastInstance = Toast.getInstance(toastDivRef.current);
    toastInstance.hide();
    setIsShowToast(false);
  };

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast text-bg-${type}`} role="alert" aria-live="assertive" 
        aria-atomic="true" ref={toastDivRef}>
        <div className="toast-body d-flex">
          {toastText}
          <button type="button" className="btn-close ms-auto flex-shrink-0" data-bs-dismiss="toast" 
            aria-label="Close"></button>
        </div>
      </div>
    </div>
  );
};

export default ToastComponent;