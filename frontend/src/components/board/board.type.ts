type Board = {
  id: string;
  title: string;
  content: string;
  registerId: string;
  registerDate: string;
};

type SearchBoardType = PagingData & {
  filter: string;
};
