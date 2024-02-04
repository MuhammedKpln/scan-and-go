export type ITag = {
  userUid: string;
  tagName: string;
  tagNote: string;
  isAvailable: boolean;
};

export type ITagWithId = {
  [key: string]: ITag;
};
