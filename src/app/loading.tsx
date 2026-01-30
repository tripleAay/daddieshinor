// app/loading.tsx
import { Rocket } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative">
          <Rocket className="h-16 w-16 animate-spin text-orange-500" />
          <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Daddieshinor
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Awakening thinkers • one essay at a time
          </p>
        </div>
      </div>
    </div>
  );
}