class BookRawResponseItems {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  isbn: string;
  description: string;
}

export class BookRawResponse {
  lastBuildDate: Date;
  total: number;
  start: number;
  display: number;
  items: BookRawResponseItems[];
}
