import { RouterIndex } from "@/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const router = RouterIndex.getInstance();

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const auth = await router.verifyAuth(
    cookieStore.get("sessionKey")?.value as any
  );

  if (auth) {
    redirect("/");
  }

  return (
    <>
      <main className="w-full min-h-screen px-5">{children}</main>
    </>
  );
};

export default Layout;
