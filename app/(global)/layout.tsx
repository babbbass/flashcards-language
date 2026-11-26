import { RootDocument, siteMetadata } from "@/components/root-document";

export const metadata = siteMetadata;

type Props = LayoutProps<"/">;

/** Root layout of the pages outside a language (`/`, `/languages`, sign-in/up): English. */
const GlobalRootLayout = ({ children }: Props) => <RootDocument lang="en">{children}</RootDocument>;

export default GlobalRootLayout;
