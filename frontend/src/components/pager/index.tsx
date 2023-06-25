function Pager(props: any) {
  const changeHandler = props.onChange || function () {};

  const page = props.page;
  const totalPages = props.totalPages;

  const renderPages = () => {
    const PAGE_SIZE = 10;
    let array = [];

    const startPage = Math.floor(page / PAGE_SIZE) * PAGE_SIZE;
    const endPages = Math.min(startPage + 10, totalPages);

    if (startPage >= PAGE_SIZE) {
      array.push(
        <li className="page-item">
          <span className="page-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only"></span>
          </span>
        </li>
      );
    }

    for (var i = startPage; i < endPages; i++) {
      const pageNumber = i + 1;
      array.push(
        <li className={"page-item " + (page == i ? "active" : "")} key={i}>
          <span
            className="page-link"
            onClick={(e) => {
              if (pageNumber - 1 == page) {
                return;
              }
              changeHandler(pageNumber - 1);
            }}
          >
            {i + 1}
          </span>
        </li>
      );
    }

    if (totalPages > endPages) {
      array.push(
        <li className="page-item">
          <span className="page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only"></span>
          </span>
        </li>
      );
    }

    return array;
  };

  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">{renderPages()}</ul>
      </nav>
    </div>
  );
}

export default Pager;
