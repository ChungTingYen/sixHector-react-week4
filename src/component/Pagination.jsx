/* eslint-disable react/prop-types */
const Pagination = (props) => {
  const { getProductData, pageInfo } = props;
  const handlePageChange = (page) => {
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
                onClick={() => handlePageChange(pageInfo.current_page - 1)}
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
                    onClick={() => handlePageChange(index + 1)}
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
                onClick={() => handlePageChange(pageInfo.current_page + 1)}
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

export default Pagination;
