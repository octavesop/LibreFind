class BookEsRawDetailResponse {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    id: string;
    title: string;
    author: string;
    publisher: string;
    imageUrl: string;
    isbn: string;
    reviewed: number;
  };
}

export class BookEsRawResponse {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: BookEsRawDetailResponse[];
  };
}
