import ReactPaginate from "react-paginate";

const Pagination = (props) => {
  const { pageCount, onPageChange, initialPage, OnClick } = props;

  return (
    <ReactPaginate
      initialPage={initialPage}
      className="pagination rounded-flat pagination-success d-flex justify-content-center mt-5"
      previousLabel={""}
      nextLabel={""}
      pageCount={pageCount}
      onPageChange={onPageChange}
      disabledClassName={"navigationDisabled"}
      activeLinkClassName="active"
      previousClassName={"page-item"}
      nextClassName={"page-item"}
      previousLinkClassName={"page-link mdi mdi-chevron-left"}
      nextLinkClassName={"page-link mdi mdi-chevron-right"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      activeClassName={"active"}
      onClick={OnClick}
    />
  );
};
export default Pagination;
