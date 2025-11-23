import { Tree } from "@/types/tree";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchTrees(): Promise<Tree[]> {
  const res = await fetch(`${BASE_URL}/trees`);
  return res.json();
}

export async function saveTree(tree: Tree): Promise<Tree> {
  // Auto-detects POST or PUT based on whether the tree has id.
  const method = tree.id ? "PUT" : "POST";
  const url = tree.id ? `${BASE_URL}/trees/${tree.id}` : `${BASE_URL}/trees`;

  const res = await fetch(url, {
    method,
    body: JSON.stringify(tree),
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
}
