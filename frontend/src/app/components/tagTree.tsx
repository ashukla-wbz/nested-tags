import { useState } from "react";
import TagNodeView from "./tagNodeView";
import { Tree } from "@/types/tree";
import { saveTree } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BracesIcon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  initialTree: Tree;
  reloadTrees: () => void;
}

export default function TagTree({ initialTree, reloadTrees }: Props) {
  const [tree, setTree] = useState<Tree>(
    JSON.parse(JSON.stringify(initialTree))
  );
  const [renaming, setRenaming] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const onNodeChange = () => setTree({ ...tree });

  const saveAndExport = async () => {
    // Save to backend
    await saveTree(tree);
    toast.success("Tree saved successfully!");

    // Build JSON to download (structure only)
    const exportPayload = tree.structure;

    // Trigger file download
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Filename example: root-2025-01-01.json
    link.download = `${tree.structure.name || "tree"}.json`;
    link.click();
    URL.revokeObjectURL(url);

    reloadTrees();
  };

  return (
    <div className="border p-4 rounded-md shadow space-y-3">
      <div className="flex justify-between items-center">
        {renaming ? (
          <Input
            defaultValue={tree.name}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                tree.name = (e.target as HTMLInputElement).value;
                if (tree.name.trim() === "") {
                  toast.error("Tree name cannot be empty");
                  return;
                }
                setRenaming(false);
                onNodeChange();
              }
            }}
            autoFocus
            className="font-bold"
            placeholder="Tree Name"
          />
        ) : (
          <h2
            className="text-lg font-bold cursor-pointer w-full"
            onClick={() => setRenaming(true)}
          >
            {tree.name}
          </h2>
        )}

        <div className="flex gap-2 ml-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowJson(!showJson)}
          >
            <BracesIcon /> JSON
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2Icon /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete the <strong>{tree.name}</strong> tree?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/trees/${tree.id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    toast.success("Tree deleted successfully");
                    reloadTrees();
                  }}
                >
                  Yes, delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {showJson && (
        <pre className="bg-muted/50 text-muted-foreground p-3 rounded-md text-sm max-h-64 overflow-auto animate-fadeIn">
          {JSON.stringify(tree.structure, null, 2)}
        </pre>
      )}

      <TagNodeView node={tree.structure} onChange={onNodeChange} />

      <Button className="mt-4" onClick={saveAndExport}>
        Save & Export JSON
      </Button>
    </div>
  );
}
