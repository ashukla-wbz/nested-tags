export interface TagNode {
  name: string;
  data?: string;
  children?: TagNode[];
}

export interface Tree {
  id?: number;
  name: string;
  structure: TagNode;
}
