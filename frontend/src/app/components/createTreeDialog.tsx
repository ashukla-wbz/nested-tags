"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveTree } from "@/lib/api";
import { CirclePlusIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onSuccess: () => void;
}

export default function CreateTreeDialog({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false); // ⬅ dialog control

  const create = async () => {
    if (!name.trim()) return toast.error("Root name is required");
    const newTree = {
      name,
      structure: {
        name,
        data,
      },
    };
    await saveTree(newTree);

    toast.success("Tree created successfully");

    setName("");
    setData("");
    setOpen(false); // ⬅ close dialog
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlusIcon className="mr-2" />
          Create New Tree
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Nested Tag Tree</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Root Tag Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Root Data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <Button className="w-full" onClick={create}>
            Create Tree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
