import { Metadata } from "next";

import { cookies } from "next/headers";
import { ResponseBody } from "@/types/response.type";
import { redirect } from "next/navigation";
import { ResponseHealthGetListByQuery } from "@/server/spec/health/health.responses";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import UserTable from "./_components/user-table";

import { UserHeader } from "./_components/user-header";
import { ResponseUserGetListByQuery } from "@/server/spec/user/user.responses";

export const metadata: Metadata = {
  title: "Users",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const userListData = await fetch(
    `${process.env.API_SERVER_HOST}/api/users?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  )
    .then(async (res) => {
      if (res.status >= 300) throw new Error();
      const body = await res.json();
      return body as ResponseBody<ResponseUserGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { userListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { userListData } = await getPageData(searchParams as any);

  if (!userListData.data) {
    redirect("/");
  }

  // if (!healthListData.success) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Users" }]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <UserHeader />
      </div>
      <UserTable searchParams={searchParams} userListData={userListData.data} />
    </div>
  );
};

export default Page;
