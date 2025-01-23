/* eslint-disable react/prop-types */
import { memo } from 'react';
const Pagination = (props) => {
  const { getProductData, pageInfo } = props;
  const handlePageChange = (e,page) => {
    e.preventDefault();
    getProductData(page);
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
              <a
                className="page-link"
                href="#"
                onClick={(e) => handlePageChange(e,pageInfo.current_page - 1)}
              >
                上一頁
              </a>
            </li>
            {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
              return (
                <li
                  className={`page-item ${
                    pageInfo.current_page === index + 1 && "active"
                  } `}
                  key={index + 1}
                >
                  <a
                    className="page-link"
                    onClick={(e) => handlePageChange(e,index + 1)}
                    href="#"
                  >
                    {index + 1}
                  </a>
                </li>
              );
            })}
            <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
              <a
                className="page-link"
                href="#"
                onClick={(e) => handlePageChange(e,pageInfo.current_page + 1)}
              >
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default memo(Pagination);
