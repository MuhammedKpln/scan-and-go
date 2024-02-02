type ITag = {
  userUid: string;
  tagName: string;
  tagNote: string;
  isAvailable: boolean;
};
type ITagWithId = {
  [key: string]: ITag;
};
