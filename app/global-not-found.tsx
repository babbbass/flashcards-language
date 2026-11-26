import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";
import { RootDocument } from "@/components/root-document";

export const metadata: Metadata = {
  title: "Page not found · Flashcards",
};

/** 404 for URLs that match no route. Needed because the app has several root layouts. */
const GlobalNotFound = () => (
  <RootDocument lang="en">
    <NotFoundContent />
  </RootDocument>
);

export default GlobalNotFound;
