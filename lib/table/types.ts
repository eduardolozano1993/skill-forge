export type TablePagination = {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TableResult<Row> = {
  search: string;
  rows: Row[];
  pagination?: TablePagination;
};
