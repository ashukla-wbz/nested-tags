"use client";

import { useEffect, useState } from "react";
import { fetchTrees } from "@/lib/api";
import TagTree from "./components/tagTree";
import { Tree } from "@/types/tree";
import CreateTreeDialog from "./components/createTreeDialog";
import { TreePineIcon } from "lucide-react";
import Particles from "@/components/Particles";

export default function Page() {
  const [trees, setTrees] = useState<Tree[]>([]);

  const loadTrees = async () => {
    const result = await fetchTrees();
    setTrees(result);
  };

  useEffect(() => {
    loadTrees();
  }, []);

  return (
    <main className="p-6 space-y-6 h-screen overflow-auto">
      <div className="absolute inset-0 -z-10">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {!trees.length && (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          <TreePineIcon className="size-48 text-muted-foreground" />
          {trees.length === 0 && (
            <p className="text-muted-foreground text-lg mb-8">
              No trees yet — create one to get started.
            </p>
          )}
          <CreateTreeDialog onSuccess={loadTrees} />
        </div>
      )}

      {trees.length > 0 && <CreateTreeDialog onSuccess={loadTrees} />}
      {trees.map((t) => (
        <TagTree key={t.id} initialTree={t} reloadTrees={loadTrees} />
      ))}
    </main>
  );
}
