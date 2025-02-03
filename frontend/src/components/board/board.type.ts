type Board = {
  id: string;
  category: string;
  title: string;
  content: string;
  registerId: string;
  registerDate: string;
};

type SearchBoardType = PagingData & {
  category: string;
  registerId?: string;
  from?: string;
  to?: string;
  filter?: string;
};
