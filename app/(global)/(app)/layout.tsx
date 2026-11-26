import { Protected } from "@/components/auth/protected";

type Props = LayoutProps<"/">;

/** `/` and `/languages` are signed-in only. */
const AppLayout = ({ children }: Props) => <Protected>{children}</Protected>;

export default AppLayout;
