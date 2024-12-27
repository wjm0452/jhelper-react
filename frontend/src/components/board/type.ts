type Board = {
  id: string;
  title: string;
  content: string;
  registerId: string;
  registerDate: string;
};

type SearchBoards = {
  page: number;
  pageSize: number;
};

type SearchBoardsResults = {
  page: number;
  pageSize: number;
  totalPages: number;
  items: Board[];
};
