"use client";

import { useState } from "react";
import { TagNode } from "@/types/tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CirclePlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
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
  node: TagNode;
  onChange: () => void;
  parentChildren?: TagNode[]; // enables delete
  index?: number;
}

// Recursive UI per tag node
export default function TagNodeView({
  node,
  onChange,
  parentChildren,
  index,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const addChild = () => {
    if (!node.children) {
      node.children = [];
      delete node.data;
    }
    node.children.push({ name: "New Child", data: "Data" });
    toast.success("Child added successfully");
    onChange();
  };

  return (
    <div className="mt-2">
      <Card className="p-2 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="transition-transform"
          >
            {collapsed ? (
              <ChevronRightIcon className="animate-rotate" />
            ) : (
              <ChevronDownIcon className="animate-rotate" />
            )}
          </Button>

          {editingName ? (
            <Input
              autoFocus
              defaultValue={node.name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  node.name = (e.target as HTMLInputElement).value;
                  if (node.name.trim() === "") {
                    toast.error("Tag name cannot be empty");
                    return;
                  }
                  setEditingName(false);
                  onChange();
                }
              }}
              placeholder="Tag Name"
            />
          ) : (
            <div
              className="font-semibold cursor-pointer flex-1"
              onClick={() => setEditingName(true)}
            >
              {node.name}
            </div>
          )}

          <Button variant="secondary" onClick={addChild} size="sm">
            <CirclePlusIcon /> Add
          </Button>

          {parentChildren && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2Icon />
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete the <strong>{node.name}</strong> child node?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      parentChildren.splice(index!, 1);
                      toast.success("Node deleted successfully");
                      onChange();
                    }}
                  >
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* COLLAPSING ANIMATION */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            collapsed ? "max-h-0 opacity-0" : "max-h-[900px] opacity-100"
          }`}
        >
          <div className="pl-6 mt-2 mr-1 mb-1">
            {node.children ? (
              node.children.map((child, i) => (
                <TagNodeView
                  key={i}
                  node={child}
                  onChange={onChange}
                  parentChildren={node.children}
                  index={i}
                />
              ))
            ) : (
              <Input
                defaultValue={node.data}
                onChange={(e) => {
                  node.data = e.target.value;
                  onChange();
                }}
                className="mt-2"
                placeholder="Enter data here"
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
