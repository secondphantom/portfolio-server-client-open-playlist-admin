import { RouterIndex } from "@/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const router = RouterIndex.getInstance();

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const auth = await router.verifyAuth(
    cookieStore.get("sessionKey")?.value as any
  );

  if (!auth) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      <main className="max-w-6xl mx-auto">
        <div className="h-full px-5 pt-20">{children}</div>
      </main>
    </>
  );
};

export default Layout;
