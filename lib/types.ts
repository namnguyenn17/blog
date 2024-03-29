export enum Form {
  Initial,
  Loading,
  Success,
  Error
}

export enum PageType {
  WEBSITE = 'website',
  ARTICLE = 'article'
}

export type FormState = {
  state: Form;
  message?: string;
};

export type Subscribers = {
  count: number;
};

export type Article = {
  title: string;
  tags?: string[];
  coverImage: string;
  summary: string;
  publishedDate?: any;
  lastUpdatedDate?: any;
};

export type Views = {
  total: number;
};

export type Reactions = {
  like_count: number;
  love_count: number;
  clap_count: number;
  party_count: number;
};

export type Language =
  | 'markup'
  | 'bash'
  | 'clike'
  | 'c'
  | 'cpp'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'coffeescript'
  | 'actionscript'
  | 'css-extr'
  | 'diff'
  | 'git'
  | 'go'
  | 'graphql'
  | 'handlebars'
  | 'json'
  | 'less'
  | 'makefile'
  | 'markdown'
  | 'objectivec'
  | 'ocaml'
  | 'python'
  | 'reason'
  | 'sass'
  | 'scss'
  | 'sql'
  | 'stylus'
  | 'tsx'
  | 'typescript'
  | 'wasm'
  | 'yaml';
