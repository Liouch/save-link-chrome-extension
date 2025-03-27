export type Bookmark = {
  id: number;
  title: string;
  url: string;
  tags: Array<string>;
  createdAt: string;
  favIconURL: string;
};

export type BookmarkResponse = {
  record: {
    bookmarks: Array<Bookmark>;
  };
  metadata: {
    parentId: string;
    private: boolean;
  };
};
