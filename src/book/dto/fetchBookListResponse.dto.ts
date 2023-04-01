class BookDetailResponse {
  id: string;
  title: string;
  author: string;
  publisher: string;
  imageUrl: string;
  isbn: string;
}

export class FetchBookListResponse {
  readonly total: number;
  readonly result: BookDetailResponse[];
}
