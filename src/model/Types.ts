export type PoemType = {
  _id: string;
  title: string;
  description: string;
  author: Author;
};

export type Author = {
  _id: string;
  name: string;
  email: string;
};
