import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RouterIndex } from "@/server";

import { MobileHeader } from "./(routes)/_components/mobile-header";
import { Sidebar } from "./(routes)/_components/sidebar";

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
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-auto pt-3 h-full px-3">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
