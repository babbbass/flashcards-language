import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Body of every 404 (global and inside `[lang]`), so they look the same. */
export const NotFoundContent = () => (
  <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
    <p className="font-heading text-8xl">404</p>
    <h1 className="text-3xl">This page does not exist</h1>
    <Button size="lg" nativeButton={false} render={<Link href="/" />}>
      Back to my flashcards
    </Button>
  </main>
);
