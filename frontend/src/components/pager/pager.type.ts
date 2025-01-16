type PagingData = {
  page: number;
  size: number;
};

type PagingResults<T> = {
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  items: T[];
};
